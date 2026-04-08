import { drawnTools, journalEntries, type InsertDrawnTool, type DbDrawnTool, type InsertJournalEntry, type DbJournalEntry } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getDrawnTools(): Promise<DbDrawnTool[]>;
  getDrawnTool(id: string): Promise<DbDrawnTool | undefined>;
  createDrawnTool(tool: InsertDrawnTool): Promise<DbDrawnTool>;
  updateDrawnToolJournal(id: string, journalEntry: string): Promise<DbDrawnTool | undefined>;
  // Journal entries
  getJournalEntry(id: string): Promise<DbJournalEntry | undefined>;
  getJournalEntriesByDrawnTool(drawnToolId: string): Promise<DbJournalEntry[]>;
  getJournalEntryByDate(date: string): Promise<DbJournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<DbJournalEntry>;
  updateJournalEntry(id: string, data: Partial<InsertJournalEntry>): Promise<DbJournalEntry | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getDrawnTools(): Promise<DbDrawnTool[]> {
    return db.select().from(drawnTools).orderBy(desc(drawnTools.createdAt)).all();
  }

  async getDrawnTool(id: string): Promise<DbDrawnTool | undefined> {
    const tool = db.select().from(drawnTools).where(eq(drawnTools.id, id)).get();
    return tool || undefined;
  }

  async createDrawnTool(tool: InsertDrawnTool): Promise<DbDrawnTool> {
    db.insert(drawnTools).values(tool).run();
    return db.select().from(drawnTools).where(eq(drawnTools.id, tool.id)).get()!;
  }

  async updateDrawnToolJournal(id: string, journalEntry: string): Promise<DbDrawnTool | undefined> {
    db.update(drawnTools).set({ journalEntry }).where(eq(drawnTools.id, id)).run();
    return db.select().from(drawnTools).where(eq(drawnTools.id, id)).get() || undefined;
  }

  async getJournalEntry(id: string): Promise<DbJournalEntry | undefined> {
    return db.select().from(journalEntries).where(eq(journalEntries.id, id)).get() || undefined;
  }

  async getJournalEntriesByDrawnTool(drawnToolId: string): Promise<DbJournalEntry[]> {
    return db.select().from(journalEntries)
      .where(eq(journalEntries.drawnToolId, drawnToolId))
      .orderBy(desc(journalEntries.createdAt))
      .all();
  }

  async getJournalEntryByDate(date: string): Promise<DbJournalEntry | undefined> {
    return db.select().from(journalEntries)
      .where(eq(journalEntries.date, date))
      .get() || undefined;
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<DbJournalEntry> {
    db.insert(journalEntries).values(entry).run();
    return db.select().from(journalEntries).where(eq(journalEntries.id, entry.id)).get()!;
  }

  async updateJournalEntry(id: string, data: Partial<InsertJournalEntry>): Promise<DbJournalEntry | undefined> {
    db.update(journalEntries)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(journalEntries.id, id))
      .run();
    return db.select().from(journalEntries).where(eq(journalEntries.id, id)).get() || undefined;
  }
}

export const storage = new DatabaseStorage();
