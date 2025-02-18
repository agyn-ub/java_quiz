import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { userScores, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const telegramId = searchParams.get('telegramId')

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      )
    }

    // First get the user by telegramId
    const user = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId)
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Then get scores with category information
    const results = await db.query.userScores.findMany({
      where: eq(userScores.userId, user.id),
      with: {
        category: true,
      },
      orderBy: [
        desc(userScores.completedAt)
      ],
    })

    return NextResponse.json({
      results: results.map(result => ({
        id: result.id,
        score: result.score,
        correctAnswers: result.correctAnswers,
        completedAt: result.completedAt,
        category: result.category ? {
          id: result.category.id,
          name: result.category.name,
          nameRu: result.category.nameRu,
        } : null,
      }))
    })
  } catch (error) {
    console.error('Error fetching user results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
} 