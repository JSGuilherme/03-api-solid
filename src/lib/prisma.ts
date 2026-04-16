
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@/src/env';
let log: Array<'query' | 'info' | 'warn' | 'error'> = [];
if(env.NODE_ENV === 'dev'){
   log = ['query'];
}

const connectionString = process.env.DATABASE_URL ?? env.DATABASE_URL;

function getSchemaFromConnectionString(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get('schema') ?? undefined;
  } catch {
    return undefined;
  }
}

const schema = process.env.DATABASE_SCHEMA ?? getSchemaFromConnectionString(connectionString);
const adapterOptions = schema ? { schema } : undefined;

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }, adapterOptions),
  log
});
