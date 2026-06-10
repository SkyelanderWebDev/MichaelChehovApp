import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes } from "./auth";
import { insertDrawnToolSchema, insertJournalEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Local demo auth slice (username/password, scrypt hashes, httpOnly sessions).
  registerAuthRoutes(app);

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

  // --- POA Journal routes ---

  // Create a journal entry
  app.post("/api/journal", async (req, res) => {
    try {
      const validated = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(validated);
      res.json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(400).json({ error: "Invalid journal entry data" });
    }
  });

  // Get journal entries for a specific drawn tool
  app.get("/api/journal/:drawnToolId", async (req, res) => {
    try {
      const { drawnToolId } = req.params;
      const entries = await storage.getJournalEntriesByDrawnTool(drawnToolId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  // Get today's journal entry
  app.get("/api/journal-today", async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const entry = await storage.getJournalEntryByDate(today);
      res.json(entry || null);
    } catch (error) {
      console.error("Error fetching today's journal:", error);
      res.status(500).json({ error: "Failed to fetch today's journal" });
    }
  });

  // Update a journal entry
  app.patch("/api/journal/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateJournalEntry(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      res.status(500).json({ error: "Failed to update journal entry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
