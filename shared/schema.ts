import { z } from "zod";

// Parent tool with optional children (up to 100 specific examples)
export const parentToolSchema = z.object({
  name: z.string(),
  children: z.array(z.string()).max(100).optional(),
});

// Grandparent category containing parent tools
export const toolCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tools: z.array(parentToolSchema),
  hasScale: z.boolean().optional(),
});

export const drawnToolSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
  parentToolName: z.string(),
  childToolName: z.string().optional(),
  scaleValue: z.number().optional(),
  unveiledValue: z.number().optional(), // 1-10 scale for how unveiled the tool is
  timestamp: z.number(),
});

export type ParentTool = z.infer<typeof parentToolSchema>;
export type ToolCategory = z.infer<typeof toolCategorySchema>;
export type DrawnTool = z.infer<typeof drawnToolSchema>;
