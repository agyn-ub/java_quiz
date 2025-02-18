'use client'

import { motion } from 'framer-motion'
import { LoadingSpinner } from './loading-spinner'

interface LoadingStateProps {
  text?: string
  className?: string
}

export function LoadingState({ text = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col items-center justify-center space-y-4 p-8 ${className}`}
    >
      <LoadingSpinner size="lg" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 font-medium"
      >
        {text}
      </motion.p>
    </motion.div>
  )
} 