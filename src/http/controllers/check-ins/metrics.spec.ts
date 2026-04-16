import { app } from '@/src/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/src/utils/test/create-and-authenticate-user';
import { prisma } from '@/src/lib/prisma';

describe('Check-in Metrics (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to get the count of check-in metrics', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                title: 'JS Gym',
                description: 'Some description',
                phone: '123456789',
                latitude: -19.9777551,
                longitude: -47.7736227
            }
        });

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id,
                }, {
                    gym_id: gym.id,
                    user_id: user.id,
                }
                ]
        });

        const response = await request(app.server)
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.statusCode).toEqual(200);
        expect(response.body.checkInsCount).toEqual(2);
    });
});