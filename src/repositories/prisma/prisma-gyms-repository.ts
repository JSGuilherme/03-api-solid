import { Gym, Prisma } from "@/generated/prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { prisma } from "@/src/lib/prisma";

function getSchemaFromConnectionString(url: string) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.searchParams.get('schema') ?? undefined;
    } catch {
        return undefined;
    }
}

export class PrismaGymsRepository implements GymsRepository {
    async findById(userId: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id: userId,
            }
        });
        return gym;
    }

    async findManyNearby({ userLatitude, userLongitude }: FindManyNearbyParams) {
        const schema = process.env.DATABASE_SCHEMA ?? getSchemaFromConnectionString(process.env.DATABASE_URL ?? '');
        const gymTable = schema
            ? Prisma.raw(`"${schema.replace(/"/g, '""')}"."gyms"`)
            : Prisma.raw('gyms');

        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM ${gymTable}
            WHERE (
                6371 * acos(
                    LEAST(
                        1,
                        GREATEST(
                            -1,
                            cos(radians(${userLatitude})) * cos(radians(latitude::double precision)) * cos(radians(longitude::double precision) - radians(${userLongitude}))
                            + sin(radians(${userLatitude})) * sin(radians(latitude::double precision))
                        )
                    )
                )
            ) <= 10
       `
        return gyms;
    }

    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                    //mode: 'insensitive',
                }
            },
            skip: (page - 1) * 20,
            take: 20,
        });
        return gyms;
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data,
        });
        return gym;
    }

}