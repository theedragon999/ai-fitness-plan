import { users, type User, type InsertUser, FitnessData, UserPreferences, FitnessPlan } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Initialize memory store for sessions
const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveFitnessData(userId: number, data: FitnessData): Promise<void>;
  getFitnessData(userId: number): Promise<FitnessData | undefined>;
  savePreferences(userId: number, preferences: UserPreferences): Promise<void>;
  getPreferences(userId: number): Promise<UserPreferences | undefined>;
  savePlan(userId: number, plan: FitnessPlan): Promise<void>;
  getCurrentPlan(userId: number): Promise<FitnessPlan | undefined>;
  getPlanHistory(userId: number): Promise<FitnessPlan[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private fitnessData: Map<number, FitnessData>;
  private preferences: Map<number, UserPreferences>;
  private plans: Map<number, FitnessPlan[]>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.fitnessData = new Map();
    this.preferences = new Map();
    this.plans = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    
    // Create user with explicit type definitions
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name ?? null, // Use nullish coalescing to ensure null
      email: insertUser.email ?? null // Use nullish coalescing to ensure null
    };
    
    this.users.set(id, user);
    return user;
  }

  async saveFitnessData(userId: number, data: FitnessData): Promise<void> {
    this.fitnessData.set(userId, data);
  }

  async getFitnessData(userId: number): Promise<FitnessData | undefined> {
    return this.fitnessData.get(userId);
  }

  async savePreferences(userId: number, preferences: UserPreferences): Promise<void> {
    this.preferences.set(userId, preferences);
  }

  async getPreferences(userId: number): Promise<UserPreferences | undefined> {
    return this.preferences.get(userId);
  }

  async savePlan(userId: number, plan: FitnessPlan): Promise<void> {
    // Get existing plans or initialize an empty array
    const userPlans = this.plans.get(userId) || [];
    // Add the new plan
    userPlans.unshift(plan); // Add to the beginning to make it the "current" plan
    // Update the plans map
    this.plans.set(userId, userPlans);
  }

  async getCurrentPlan(userId: number): Promise<FitnessPlan | undefined> {
    const userPlans = this.plans.get(userId);
    return userPlans ? userPlans[0] : undefined;
  }

  async getPlanHistory(userId: number): Promise<FitnessPlan[]> {
    return this.plans.get(userId) || [];
  }
}

export const storage = new MemStorage();
