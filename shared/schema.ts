import { z } from "zod";
import { pgTable, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

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
export const drawnTools = pgTable("drawn_tools", {
  id: varchar("id").primaryKey(),
  categoryId: varchar("category_id").notNull(),
  categoryName: varchar("category_name").notNull(),
  parentToolName: varchar("parent_tool_name").notNull(),
  childToolName: varchar("child_tool_name"),
  scaleValue: integer("scale_value"),
  unveiledValue: integer("unveiled_value"),
  journalEntry: text("journal_entry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export type ParentTool = z.infer<typeof parentToolSchema>;
export type ToolCategory = z.infer<typeof toolCategorySchema>;
export type DrawnTool = z.infer<typeof drawnToolSchema>;
export type InsertDrawnTool = z.infer<typeof insertDrawnToolSchema>;
export type DbDrawnTool = typeof drawnTools.$inferSelect;
