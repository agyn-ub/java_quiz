import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'
import { userScores, users } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const telegramId = searchParams.get('telegramId')

    let query = db.query.userScores.findMany({
      with: {
        user: true,
        category: true,
      },
      orderBy: [desc(userScores.score), desc(userScores.completedAt)],
      limit: 100,
    })

    if (categoryId) {
      query = db.query.userScores.findMany({
        where: eq(userScores.categoryId, parseInt(categoryId)),
        with: {
          user: true,
          category: true,
        },
        orderBy: [desc(userScores.score), desc(userScores.completedAt)],
        limit: 100,
      })
    }

    if (telegramId) {
      // First get the user by telegramId
      const user = await db.query.users.findFirst({
        where: eq(users.telegramId, telegramId)
      })

      if (!user) {
        return NextResponse.json({ topScores: [] })
      }

      // Then get scores using the user's ID
      query = db.query.userScores.findMany({
        where: eq(userScores.userId, user.id),
        with: {
          user: true,
          category: true,
        },
        orderBy: [desc(userScores.score), desc(userScores.completedAt)],
        limit: 100,
      })
    }

    const scores = await query

    return NextResponse.json({
      topScores: scores.map(score => ({
        id: score.id,
        score: score.score,
        correctAnswers: score.correctAnswers,
        completedAt: score.completedAt,
        category: score.category,
        user: score.user ? {
          firstName: score.user.firstName,
          lastName: score.user.lastName,
          username: score.user.username,
        } : null,
      })),
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
} 