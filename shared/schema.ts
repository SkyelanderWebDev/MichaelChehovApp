import { z } from "zod";

export const toolCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tools: z.array(z.string()),
  hasScale: z.boolean().optional(),
});

export const drawnToolSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
  toolName: z.string(),
  scaleValue: z.number().optional(),
  timestamp: z.number(),
});

export type ToolCategory = z.infer<typeof toolCategorySchema>;
export type DrawnTool = z.infer<typeof drawnToolSchema>;
