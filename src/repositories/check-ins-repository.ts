import { CheckIn, Prisma } from "@/generated/prisma/client";

export interface CheckInsRepository {
    findById(id: String): Promise<CheckIn | null>;
    findByUserIdOnDate(userId: String, date: Date): Promise<CheckIn | null>;
    findManyByUserId(userId: String, page: number): Promise<CheckIn[]>;
    countByUserId(userId: String): Promise<number>;

    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
    save(checkIn: CheckIn): Promise<CheckIn>;
}