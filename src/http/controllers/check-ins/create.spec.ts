import { app } from '@/src/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/src/utils/test/create-and-authenticate-user';
import { prisma } from '@/src/lib/prisma';

describe('Create Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to create a check-in', async () => {
        const { token, user } = await createAndAuthenticateUser(app);

        const gym = await prisma.gym.create({
            data: {
                title: 'JS Gym',
                description: 'Some description',
                phone: '123456789',
                latitude: -19.9777551,
                longitude: -47.7736227
            }
        });

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -19.9777551,
                longitude: -47.7736227
            });

        expect(response.statusCode).toEqual(201);
    });
});