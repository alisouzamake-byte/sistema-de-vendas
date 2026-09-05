import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_URL_NON_POOLING
const connectionString = databaseUrl && databaseUrl.includes('sslmode=')
  ? databaseUrl
  : databaseUrl ? `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}sslmode=require` : undefined

const globalForDb = globalThis as unknown as { svPool?: Pool }
export const pool = globalForDb.svPool ?? new Pool(connectionString ? { connectionString } : undefined)
if (process.env.NODE_ENV !== 'production') globalForDb.svPool = pool
export const db = drizzle(pool, { schema })
