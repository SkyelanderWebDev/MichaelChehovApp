import { drawnTools, type InsertDrawnTool, type DbDrawnTool } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Drawn tools with journal entries
  getDrawnTools(): Promise<DbDrawnTool[]>;
  getDrawnTool(id: string): Promise<DbDrawnTool | undefined>;
  createDrawnTool(tool: InsertDrawnTool): Promise<DbDrawnTool>;
  updateDrawnToolJournal(id: string, journalEntry: string): Promise<DbDrawnTool | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getDrawnTools(): Promise<DbDrawnTool[]> {
    return await db.select().from(drawnTools).orderBy(desc(drawnTools.createdAt));
  }

  async getDrawnTool(id: string): Promise<DbDrawnTool | undefined> {
    const [tool] = await db.select().from(drawnTools).where(eq(drawnTools.id, id));
    return tool || undefined;
  }

  async createDrawnTool(tool: InsertDrawnTool): Promise<DbDrawnTool> {
    const [createdTool] = await db
      .insert(drawnTools)
      .values(tool)
      .returning();
    return createdTool;
  }

  async updateDrawnToolJournal(id: string, journalEntry: string): Promise<DbDrawnTool | undefined> {
    const [updatedTool] = await db
      .update(drawnTools)
      .set({ journalEntry })
      .where(eq(drawnTools.id, id))
      .returning();
    return updatedTool || undefined;
  }
}

export const storage = new DatabaseStorage();
