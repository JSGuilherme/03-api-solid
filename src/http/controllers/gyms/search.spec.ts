import { app } from '@/src/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/src/utils/test/create-and-authenticate-user';

describe('Search Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to search for gyms by title', async () => {
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
                latitude: -19.9777551,
                longitude: -47.7736227
            });

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                query: 'JS'
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