'use client'

import { useRouter } from 'next/navigation'
import { LeadersList } from '@/components/leaders/leaders-list'
import { PageTransition } from '@/components/ui/page-transition'
import { motion } from 'framer-motion'

export default function LeadersPage() {
  const router = useRouter()

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between mb-6">
              <motion.h1 
                className="text-2xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Таблица лидеров
              </motion.h1>
              <motion.button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Назад</span>
              </motion.button>
            </div>
            <LeadersList />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
} 