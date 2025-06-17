import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull().default([]),
  github_url: text("github_url").notNull(),
  demo_link: text("demo_link"),
  prerequisites: text("prerequisites").array().notNull().default([]),
  toolstack: text("toolstack").array().notNull().default([]),
  thumbnail: text("thumbnail"),
  rating: integer("rating").default(0),
  downloads: integer("downloads").default(0),
  difficulty: text("difficulty").notNull().default("Beginner"),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
});

export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  automation_goals: text("automation_goals").array().notNull().default([]),
  tools_used: text("tools_used").array().notNull().default([]),
  experience_level: text("experience_level").notNull(),
  created_at: text("created_at").notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  rating: true,
  downloads: true,
});

export const insertSurveySchema = createInsertSchema(surveys).omit({
  id: true,
  created_at: true,
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
