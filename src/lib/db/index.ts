import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Create a PostgreSQL connection pool
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === 'production' 
		? { rejectUnauthorized: false } 
		: false,
})

// Create drizzle database instance
export const db = drizzle(pool, { schema })

// Export for use in migrations
export const poolConfig = pool 