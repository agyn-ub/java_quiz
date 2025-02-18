import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
	try {
		const userData = await request.json()

		if (!userData.id) {
			return NextResponse.json(
				{ error: 'Missing user ID' },
				{ status: 400 }
			)
		}

		// Check if user exists first
		let user = await db.query.users.findFirst({
			where: eq(users.telegramId, userData.id.toString()),
		})

		if (!user) {
			// Create new user if doesn't exist
			const result = await db.insert(users).values({
				telegramId: userData.id.toString(),
				firstName: userData.first_name || null,
				lastName: userData.last_name || null,
				username: userData.username || null,
			}).returning()
			
			user = result[0]
		} else {
			// Update existing user's info
			await db.update(users)
				.set({
					firstName: userData.first_name || null,
					lastName: userData.last_name || null,
					username: userData.username || null,
				})
				.where(eq(users.telegramId, userData.id.toString()))
		}

		return NextResponse.json({
			success: true,
			user: {
				id: userData.id,
				firstName: userData.first_name,
				lastName: userData.last_name,
				username: userData.username,
			},
		})

	} catch (error) {
		console.error('Auth error:', error)
		return NextResponse.json(
			{ error: 'Authentication failed' },
			{ status: 500 }
		)
	}
} 