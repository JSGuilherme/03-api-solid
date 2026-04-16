import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

import fastify from 'fastify';
import { check, ZodError } from 'zod';
import { usersRoutes } from '@/src/http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { env } from './env';
import { checkInsRoutes } from './http/controllers/check-ins/routes';

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    }
});

app.register(fastifyCookie);
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler(async (error, request, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({
                message: 'Validation error.',
                issues: error.format()
            });
    }

    if(env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        //TO DO: LOG ERROR IN EXTERNAL SERVICE (EX: DATADOG, SENTRY, NEW RELIC, ETC)
    }

    return reply.status(500).send({
        message: 'Internal server error.'
    });
});
