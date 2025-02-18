import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	nameRu: text('name_ru').notNull(),
	slug: text('slug').unique().notNull(),
	createdAt: timestamp('created_at').defaultNow(),
})

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	telegramId: text('telegram_id').unique().notNull(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	username: text('username'),
	createdAt: timestamp('created_at').defaultNow(),
})

export const userRelations = relations(users, ({ many }) => ({
	scores: many(userScores),
}))

export const quizQuestions = pgTable('quiz_questions', {
	id: serial('id').primaryKey(),
	categoryId: integer('category_id').references(() => categories.id).notNull(),
	question: text('question').notNull(),
	correctAnswer: text('correct_answer').notNull(),
	score: integer('score').notNull(),
	options: text('options').array().notNull(),
	difficulty: text('difficulty').notNull(),
})

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
	category: one(categories, {
		fields: [quizQuestions.categoryId],
		references: [categories.id],
	}),
}))

export const userScores = pgTable('user_scores', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => users.id),
	categoryId: integer('category_id').references(() => categories.id),
	score: integer('score').notNull(),
	correctAnswers: integer('correct_answers').notNull(),
	completedAt: timestamp('completed_at').defaultNow(),
})

export const userScoresRelations = relations(userScores, ({ one }) => ({
	user: one(users, {
		fields: [userScores.userId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [userScores.categoryId],
		references: [categories.id],
	}),
})) 