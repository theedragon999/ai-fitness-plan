import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

// Fitness data table
export const fitnessData = pgTable("fitness_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  source: text("source").notNull(), // 'csv', 'manual', 'api'
  dailyAverage: jsonb("daily_average").notNull(),
  weeklyTotal: jsonb("weekly_total").notNull(),
  activityLevel: text("activity_level"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences table
export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  goal: text("goal").notNull(), // 'weight-loss', 'muscle-gain', 'endurance', etc.
  dietary: text("dietary").notNull(), // 'no-restrictions', 'vegetarian', 'vegan', etc.
  availableTime: text("available_time").notNull(), // '0-15', '15-30', '30-60', '60+'
  fitnessLevel: integer("fitness_level").notNull(), // 1-5
  createdAt: timestamp("created_at").defaultNow(),
});

// Fitness plans table
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planData: jsonb("plan_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Fitness data types
export interface FitnessData {
  source: string; // 'csv', 'manual', 'api'
  dailyAverage: {
    steps: number;
    caloriesBurned: number;
  };
  weeklyTotal: {
    workoutMinutes: number;
  };
  activityLevel: string;
}

// User preferences types
export interface UserPreferences {
  goal: string; // 'weight-loss', 'muscle-gain', 'endurance', etc.
  dietary: string; // 'no-restrictions', 'vegetarian', 'vegan', etc.
  availableTime: string; // '0-15', '15-30', '30-60', '60+'
  fitnessLevel: number; // 1-5
}

// Day plan types
export interface Exercise {
  name: string;
  description: string;
}

export interface Nutrition {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: string[];
}

export interface DayPlan {
  workout: Exercise[];
  nutrition: Nutrition;
  tip: string;
}

// Fitness plan types
export interface FitnessPlan {
  id: string;
  userId: number;
  createdAt: string;
  days: {
    monday: DayPlan;
    tuesday: DayPlan;
    wednesday: DayPlan;
    thursday: DayPlan;
    friday: DayPlan;
    saturday: DayPlan;
    sunday: DayPlan;
  };
}
