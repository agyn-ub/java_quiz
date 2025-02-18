'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthenticatedContent } from '@/components/auth/authenticated-content'
import { LoadingState } from '@/components/ui/loading-state'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/ui/page-transition'

export default function Home() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [isInitialLoad, setIsInitialLoad] = useState(true)

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const telegramId = localStorage.getItem('telegram_id')

				if (!telegramId) {
					router.replace('/auth')
					return
				}

				// Simulate loading for better UX on fast connections
				await new Promise(resolve => setTimeout(resolve, 800))
				setIsLoading(false)
				setIsInitialLoad(false)
			} catch (error) {
				console.error('Error checking auth:', error)
				router.replace('/auth')
			}
		}

		checkAuth()
	}, [router])

	if (isInitialLoad) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
				<LoadingState 
					text="Загрузка..." 
					className="min-h-screen"
				/>
			</div>
		)
	}

	return (
		<PageTransition>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 md:p-8">
				<div className="max-w-2xl mx-auto">
					<AnimatePresence mode="wait">
						{isLoading ? (
							<LoadingState text="Загрузка контента..." />
						) : (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<motion.div
									className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
									initial={{ scale: 0.95 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.3, ease: 'easeOut' }}
								>
									<AuthenticatedContent />
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</PageTransition>
	)
}
