import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeSearchGymsUseCase } from '@/src/use-cases/factories/make-search-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().default(1),
    });

    const { query, page } = searchGymQuerySchema.parse(request.query);
    const searchGymUseCase = makeSearchGymsUseCase();
    const { gyms } = await searchGymUseCase.execute({
        query,
        page
    });

    return reply.status(200).send({
        gyms
    });
}