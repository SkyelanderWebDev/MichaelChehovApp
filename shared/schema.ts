import { z } from "zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

// Parent tool with optional children (up to 100 specific examples)
export const parentToolSchema = z.object({
  name: z.string(),
  children: z.array(z.string()).max(100).optional(),
  scope: z.enum(["full-body", "parts", "both"]).optional(), // for Imaginary Body: whether body-part selection applies
});

// Grandparent category containing parent tools
export const toolCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tools: z.array(parentToolSchema),
  hasScale: z.boolean().optional(),
  energyFlow: z.string().optional(), // e.g. "what", "how", "why" — role of this category in the energy system
  family: z.string().optional(),     // e.g. "psycho-physical" — grouping of related categories
});

// Database table for drawn tools with journal entries
export const drawnTools = sqliteTable("drawn_tools", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  categoryName: text("category_name").notNull(),
  parentToolName: text("parent_tool_name").notNull(),
  childToolName: text("child_tool_name"),
  scaleValue: integer("scale_value"),
  unveiledValue: integer("unveiled_value"),
  journalEntry: text("journal_entry"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// Zod schemas for validation
export const drawnToolSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
  parentToolName: z.string(),
  childToolName: z.string().optional(),
  scaleValue: z.number().optional(),
  unveiledValue: z.number().optional(),
  journalEntry: z.string().optional(),
  timestamp: z.number(),
});

export const insertDrawnToolSchema = createInsertSchema(drawnTools).omit({
  createdAt: true,
});

// POA Journal entries
export const journalEntries = sqliteTable("journal_entries", {
  id: text("id").primaryKey(),
  drawnToolId: text("drawn_tool_id").notNull(),
  date: text("date").notNull(), // ISO date e.g. "2026-04-08"
  mode: text("mode").notNull(), // "structured" | "journal"
  practiceNotes: text("practice_notes"),
  observeMorning: text("observe_morning"),
  observeMidday: text("observe_midday"),
  observeEvening: text("observe_evening"),
  applyMorning: text("apply_morning"),
  applyMidday: text("apply_midday"),
  applyEvening: text("apply_evening"),
  journalText: text("journal_text"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  createdAt: true,
  updatedAt: true,
});

export const journalEntrySchema = z.object({
  id: z.string(),
  drawnToolId: z.string(),
  date: z.string(),
  mode: z.enum(["structured", "journal"]),
  practiceNotes: z.string().nullable().optional(),
  observeMorning: z.string().nullable().optional(),
  observeMidday: z.string().nullable().optional(),
  observeEvening: z.string().nullable().optional(),
  applyMorning: z.string().nullable().optional(),
  applyMidday: z.string().nullable().optional(),
  applyEvening: z.string().nullable().optional(),
  journalText: z.string().nullable().optional(),
});

export type ParentTool = z.infer<typeof parentToolSchema>;
export type ToolCategory = z.infer<typeof toolCategorySchema>;
export type DrawnTool = z.infer<typeof drawnToolSchema>;
export type InsertDrawnTool = z.infer<typeof insertDrawnToolSchema>;
export type DbDrawnTool = typeof drawnTools.$inferSelect;
export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type DbJournalEntry = typeof journalEntries.$inferSelect;
