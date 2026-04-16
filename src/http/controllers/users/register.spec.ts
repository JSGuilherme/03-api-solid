import { app } from '@/src/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to register a new user', async () => {
        const email = `johndoe-${Date.now()}@example.com`;

        const response = await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email,
                password: '123456',
            });

        expect(response.statusCode).toEqual(201);
    });
});