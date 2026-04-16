import { prisma } from "@/src/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance, idAdmin = false) {
    const email = `johndoe@example.com`;
    const name = 'John Doe';
    const password_hash = await hash('123456', 6);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password_hash,
            role: idAdmin ? 'ADMIN' : 'MEMBER',
        }
    });


    const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            email,
            password: '123456'
        });
        const { token } = authResponse.body;
    return {
        token,
        user: {
            email,
            name
        }
    }
}