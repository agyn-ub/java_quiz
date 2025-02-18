import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { userScores, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { score, correctAnswers, telegramId, categoryId } = await request.json()

    if (!telegramId || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }

    // Get user by telegram ID
    const user = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId),
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Save both score (points) and correctAnswers separately
    await db.insert(userScores).values({
      userId: user.id,
      categoryId: parseInt(categoryId),
      score: score,
      correctAnswers: correctAnswers,
      completedAt: new Date(),
    })

    return NextResponse.json({ 
      success: true,
      message: 'Score saved successfully'
    })
  } catch (error) {
    console.error('Error saving score:', error)
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    )
  }
} 