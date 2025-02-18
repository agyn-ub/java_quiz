import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { quizQuestions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Get questions for selected category
    const rawQuestions = await db.query.quizQuestions.findMany({
      where: eq(quizQuestions.categoryId, parseInt(categoryId)),
      orderBy: sql`RANDOM()`,
      limit: 15,
    })

    // Shuffle options for each question
    const questions = rawQuestions.map(question => ({
      id: question.id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      score: question.score
    }))

    console.log('Questions:', questions)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
} 