'use client'

import { motion } from 'framer-motion'

export function Loading() {
	const circleVariants = {
		start: {
			scale: 0.8,
			opacity: 0.5,
		},
		end: {
			scale: 1,
			opacity: 1,
		},
	}

	const containerVariants = {
		start: {
			rotate: 0,
		},
		end: {
			rotate: 360,
		},
	}

	return (
		<div className="flex flex-col items-center justify-center gap-8">
			<motion.div
				className="relative w-20 h-20"
				variants={containerVariants}
				initial="start"
				animate="end"
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: "linear"
				}}
			>
				{[...Array(3)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
						variants={circleVariants}
						style={{
							top: `${Math.sin((i * 2 * Math.PI) / 3) * 30 + 50}%`,
							left: `${Math.cos((i * 2 * Math.PI) / 3) * 30 + 50}%`,
						}}
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.5, 1, 0.5],
						}}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							delay: i * 0.2,
							ease: "easeInOut",
						}}
					/>
				))}
			</motion.div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="relative"
			>
				<span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-medium">
					Загрузка
				</span>
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 1, 0] }}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute -right-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
				>
					...
				</motion.span>
			</motion.div>
		</div>
	)
} 