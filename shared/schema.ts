import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users for tracking progress
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

// Educational content sections
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  order: integer("order").notNull(),
  content: text("content").notNull(),
});

export const insertSectionSchema = createInsertSchema(sections).pick({
  title: true,
  slug: true,
  order: true,
  content: true,
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  question: true,
  options: true,
  correctAnswer: true,
  explanation: true,
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  progress: integer("progress").notNull().default(0),
  completedSections: jsonb("completed_sections").notNull().default([]),
  quizScores: jsonb("quiz_scores").notNull().default({}),
  sectionProgress: jsonb("section_progress").notNull().default({}),
  lastAccessed: text("last_accessed").notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  progress: true,
  completedSections: true,
  quizScores: true,
  sectionProgress: true,
  lastAccessed: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
