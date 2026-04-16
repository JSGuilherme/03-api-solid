import { app } from '@/src/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/src/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to list nearby gyms', async () => {

        const { token } = await createAndAuthenticateUser(app, true);
        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JS Gym',
                description: 'Some description',
                phone: '123456789',
                latitude: -19.9777551,
                longitude: -47.7736227
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TS Gym',
                description: 'Some description',
                phone: '123456789',
                latitude: -19.801517,
                longitude: -47.906125
            });

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -19.9777551,
                longitude: -47.7736227
            })
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JS Gym',
            }),
        ]);
    });
});