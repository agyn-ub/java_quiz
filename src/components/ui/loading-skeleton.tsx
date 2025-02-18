'use client'

import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  className?: string
  count?: number
}

export function LoadingSkeleton({ className = '', count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
            rounded-lg ${className}
          `}
        />
      ))}
    </>
  )
} 