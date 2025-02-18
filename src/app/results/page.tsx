'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { ResultsList } from '@/components/results/results-list'
import { ResultsSkeleton } from '@/components/results/results-skeleton'
import { useRouter } from 'next/navigation'

export default function ResultsPage() {
  const router = useRouter()

  useEffect(() => {
    const storedTelegramId = localStorage.getItem('telegram_id')
    if (!storedTelegramId) {
      router.replace('/auth')
    }
  }, [router])

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Вернуться назад
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Мои результаты</h2>
          <Suspense fallback={<ResultsSkeleton />}>
            <ResultsList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
