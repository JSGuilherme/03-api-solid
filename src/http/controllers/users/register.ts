import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@/src/use-cases/errors/user-alredy-exists.error';
import { makeRegisterUseCase } from '@/src/use-cases/factories/make-register-use-case';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerUseBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerUseBodySchema.parse(request.body);

    try {
        const registerUseCase = makeRegisterUseCase();
        await registerUseCase.execute({ name, email, password });

    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message });
        } 
        
        throw error;
    }

    return reply.status(201).send();
}