import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDrawnToolSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all drawn tools
  app.get("/api/drawn-tools", async (req, res) => {
    try {
      const tools = await storage.getDrawnTools();
      res.json(tools);
    } catch (error) {
      console.error("Error fetching drawn tools:", error);
      res.status(500).json({ error: "Failed to fetch drawn tools" });
    }
  });

  // Create a new drawn tool
  app.post("/api/drawn-tools", async (req, res) => {
    try {
      const validatedTool = insertDrawnToolSchema.parse(req.body);
      const createdTool = await storage.createDrawnTool(validatedTool);
      res.json(createdTool);
    } catch (error) {
      console.error("Error creating drawn tool:", error);
      res.status(400).json({ error: "Invalid drawn tool data" });
    }
  });

  // Update journal entry for a drawn tool
  app.patch("/api/drawn-tools/:id/journal", async (req, res) => {
    try {
      const { id } = req.params;
      const { journalEntry } = req.body;

      if (typeof journalEntry !== "string") {
        return res.status(400).json({ error: "Journal entry must be a string" });
      }

      const updatedTool = await storage.updateDrawnToolJournal(id, journalEntry);
      
      if (!updatedTool) {
        return res.status(404).json({ error: "Tool not found" });
      }

      res.json(updatedTool);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      res.status(500).json({ error: "Failed to update journal entry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
