'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/loading'

export default function QuizStartPage() {
  const router = useRouter()

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const categoryId = localStorage.getItem('selected_category_id')
        if (!categoryId) {
          router.replace('/categories')
          return
        }

        const response = await fetch(`/api/quiz/questions?categoryId=${categoryId}`)
        if (!response.ok) throw new Error('Failed to fetch questions')
        router.push('/quiz')
      } catch (error) {
        console.error('Error initializing quiz:', error)
      }
    }

    initializeQuiz()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Loading />
      <p className="mt-4 text-gray-600">Подготовка вопросов...</p>
    </div>
  )
} 