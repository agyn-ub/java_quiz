import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.NODE_ENV === 'production' 
			? { rejectUnauthorized: false } 
			: false,
	})

	const db = drizzle(pool)

	console.log('⏳ Running migrations...')
	
	await migrate(db, {
		migrationsFolder: 'drizzle',
	})

	console.log('✅ Migrations completed!')
	
	await pool.end()
}

main()
	.then(() => {
		process.exit(0)
	})
	.catch((err) => {
		console.error('❌ Migration failed!')
		console.error(err)
		process.exit(1)
	}) 