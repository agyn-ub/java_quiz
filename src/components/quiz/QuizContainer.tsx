'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QuizResult } from './QuizResult'

interface Question {
	id: number
	question: string
	options: string[]
	correctAnswer: string
	difficulty: string
	score: number
}

export function QuizContainer({ questions }: { questions: Question[] }) {
	const router = useRouter()
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [score, setScore] = useState(0)
	const [totalPoints, setTotalPoints] = useState(0)
	const [showResult, setShowResult] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
	const [showFeedback, setShowFeedback] = useState(false)
	const [isLoadingResults, setIsLoadingResults] = useState(false)

	const handleAnswer = async (answer: string) => {
		if (isSubmitting || showFeedback) return

		setSelectedAnswer(answer)
		setShowFeedback(true)
		const isCorrect = answer === questions[currentQuestion].correctAnswer

		// Show feedback for 1 second before moving to next question
		setTimeout(async () => {
			if (isCorrect) {
				setScore(score + 1)
				setTotalPoints(totalPoints + questions[currentQuestion].score)
			}

			if (currentQuestion + 1 < questions.length) {
				setCurrentQuestion(currentQuestion + 1)
				setSelectedAnswer(null)
				setShowFeedback(false)
			} else {
				setIsLoadingResults(true)
				setIsSubmitting(true)
				const finalScore = score + (isCorrect ? 1 : 0)
				const finalPoints = totalPoints + (isCorrect ? questions[currentQuestion].score : 0)
				const saved = await saveScore(finalScore, finalPoints)
				setIsLoadingResults(false)
				setShowResult(true)
				if (!saved) {
					setSaveError('Не удалось сохранить результат. Попробуйте еще раз.')
				}
				setIsSubmitting(false)
			}
		}, 1000)
	}

	const saveScore = async (correctAnswers: number, totalPoints: number) => {
		try {
			const telegramId = localStorage.getItem('telegram_id')
			const categoryId = localStorage.getItem('selected_category_id')

			if (!telegramId || !categoryId) {
				throw new Error('Missing user or category information')
			}

			const response = await fetch('/api/quiz/score', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					score: totalPoints,
					correctAnswers: correctAnswers,
					telegramId: parseInt(telegramId),
					categoryId: parseInt(categoryId)
				}),
			})
			
			if (!response.ok) {
				throw new Error('Failed to save score')
			}
			
			return true
		} catch (error) {
			console.error('Error saving score:', error)
			return false
		}
	}

	const handleRetry = () => {
		setSaveError(null)
		router.push('/quiz/start')
	}

	if (showResult) {
		return (
			<QuizResult 
				score={score}
				totalPoints={totalPoints}
				totalQuestions={questions.length} 
				onRetry={handleRetry}
				error={saveError}
			/>
		)
	}

	if (!questions.length) return null

	const currentQuestionData = questions[currentQuestion]
	const isCorrectAnswer = selectedAnswer === currentQuestionData.correctAnswer

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="quiz-container p-4 sm:p-6"
		>
			{/* Progress bar */}
			<div className="mb-6 relative h-2 bg-gray-100 rounded-full overflow-hidden">
				<motion.div
					className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500"
					initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
					animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
					transition={{ duration: 0.3 }}
				/>
			</div>

			<div className="mb-8">
				<motion.div
					key={currentQuestion}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className="space-y-4"
				>
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-lg text-gray-600">
							Вопрос {currentQuestion + 1} из {questions.length}
						</h2>
						<div className="flex items-center gap-3">
							<span className={`
								px-3 py-1 rounded-full text-sm font-medium
								${currentQuestionData.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
									currentQuestionData.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
									'bg-red-100 text-red-700'}
							`}>
								{currentQuestionData.difficulty === 'easy' ? 'Легкий' :
								 currentQuestionData.difficulty === 'medium' ? 'Средний' : 
								 'Сложный'}
							</span>
							<span className="text-sm font-medium text-blue-600">
								
								 {currentQuestionData.score} баллов
							</span>
						</div>
					</div>
					<p className="text-2xl font-medium text-gray-800">
						{currentQuestionData.question}
					</p>
				</motion.div>
			</div>

			<div className="space-y-3">
				<AnimatePresence mode="wait">
					{isLoadingResults ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="text-center py-8"
						>
							<p className="text-gray-600">Сохранение результатов...</p>
						</motion.div>
					) : (
						currentQuestionData.options.map((option, index) => (
							<motion.button
								key={option}
								onClick={() => handleAnswer(option)}
								disabled={isSubmitting || showFeedback || isLoadingResults}
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ 
									opacity: 1, 
									scale: 1, 
									y: 0,
									transition: {
										delay: index * 0.1,
										duration: 0.3,
										ease: [0.23, 1, 0.32, 1] // Custom easing for smoother animation
									}
								}}
								whileHover={{ 
									scale: 1.02,
									transition: { duration: 0.2 }
								}}
								whileTap={{ scale: 0.98 }}
								exit={{ 
									opacity: 0, 
									scale: 0.95,
									y: -20,
									transition: { duration: 0.2 }
								}}
								className={`
									w-full p-4 text-left rounded-xl transition-colors duration-200
									text-[17px] font-medium border-2
									${showFeedback && selectedAnswer === option
										? isCorrectAnswer
											? 'bg-green-50 border-green-500 text-green-700'
											: 'bg-red-50 border-red-500 text-red-700'
										: showFeedback && option === currentQuestionData.correctAnswer
										? 'bg-green-50 border-green-500 text-green-700'
										: 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50'
									}
									${(isSubmitting || showFeedback || isLoadingResults) && selectedAnswer !== option
										? 'opacity-50 cursor-not-allowed'
										: 'hover:shadow-md'
									}
								`}
							>
								<div className="flex items-center justify-between">
									<span>{option}</span>
									{showFeedback && (selectedAnswer === option || option === currentQuestionData.correctAnswer) && (
										<motion.span
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className={`ml-2 ${
												option === currentQuestionData.correctAnswer ? 'text-green-500' : 'text-red-500'
											}`}
										>
											{option === currentQuestionData.correctAnswer ? '✓' : '✗'}
										</motion.span>
									)}
								</div>
							</motion.button>
						))
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	)
} 