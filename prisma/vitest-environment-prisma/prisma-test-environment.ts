import 'dotenv/config';

import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import type { Environment } from 'vitest/environments';

function generateDatabaseUrl(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set('schema', schema);

    return url.toString();
}

export default <Environment>{
    name: 'prisma',
    viteEnvironment: 'ssr',
    async setup() {
        // Generate an isolated schema for each test run.
        const schema = randomUUID();
        const databaseUrl = generateDatabaseUrl(schema);

        process.env.DATABASE_URL = databaseUrl;
        process.env.DATABASE_SCHEMA = schema;

        execSync('npx prisma migrate deploy', {
            env: process.env,
            stdio: 'ignore',
        });

        return {
            async teardown() {
                const cleanupUrl = new URL(databaseUrl);
                cleanupUrl.searchParams.set('schema', 'public');

                try {
                    execSync('npx prisma db execute --stdin', {
                        env: {
                            ...process.env,
                            DATABASE_URL: cleanupUrl.toString(),
                        },
                        stdio: ['pipe', 'ignore', 'ignore'],
                        input: `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
                    });
                } catch (error) {
                    console.warn(`Failed to drop schema ${schema}:`, error);
                }
            },

        };
    }
};