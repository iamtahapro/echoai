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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatHistory: Map<string, any[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.chatHistory = new Map();
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
}

export const storage = new MemStorage();
