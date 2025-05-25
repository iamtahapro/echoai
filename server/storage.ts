import { users, chatMessages, type User, type InsertUser, type ChatMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveChatMessage(userId: string, type: 'user' | 'ai', content: string): Promise<void>;
  getChatHistory(userId: string): Promise<ChatMessage[]>;
  getTodayMessageCount(userId: string): Promise<number>;
  incrementUserRequestCount(userId: string): Promise<number>;
  canUserMakeRequest(userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatHistory: Map<string, any[]>;
  private dailyRequests: Map<string, { count: number; date: string }>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.chatHistory = new Map();
    this.dailyRequests = new Map();
    this.currentId = 1;
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveChatMessage(userId: string, type: 'user' | 'ai', content: string): Promise<void> {
    const history = this.chatHistory.get(userId) || [];
    history.push({
      id: Date.now().toString(),
      userId,
      type,
      content,
      timestamp: new Date().toISOString()
    });
    this.chatHistory.set(userId, history);
  }

  async getChatHistory(userId: string): Promise<any[]> {
    return this.chatHistory.get(userId) || [];
  }

  async getTodayMessageCount(userId: string): Promise<number> {
    const history = this.chatHistory.get(userId) || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count only user messages from today
    const todayCount = history.filter(msg => 
      msg.type === 'user' && 
      new Date(msg.timestamp) >= today
    ).length;
    
    return todayCount;
  }

  async incrementUserRequestCount(userId: string): Promise<number> {
    const today = new Date().toDateString();
    const userRequests = this.dailyRequests.get(userId);
    
    if (!userRequests || userRequests.date !== today) {
      // Reset count for new day
      this.dailyRequests.set(userId, { count: 1, date: today });
      return 1;
    } else {
      // Increment count for same day
      userRequests.count += 1;
      this.dailyRequests.set(userId, userRequests);
      return userRequests.count;
    }
  }

  async canUserMakeRequest(userId: string): Promise<boolean> {
    const today = new Date().toDateString();
    const userRequests = this.dailyRequests.get(userId);
    
    if (!userRequests || userRequests.date !== today) {
      return true; // New day or first request
    }
    
    return userRequests.count < 10; // Daily limit of 10 requests
  }
}

export const storage = new MemStorage();
