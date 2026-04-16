import { makeGetUserProfileUseCase } from '@/src/use-cases/factories/make-get-user-profile-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const getUserProfile = makeGetUserProfileUseCase();

    let { user } = await getUserProfile.execute({
        userId: request.user.sub,
    });

    return reply.status(200).send({ 
        user: {
            ...user,
            password_hash: undefined,
        }
    });
}