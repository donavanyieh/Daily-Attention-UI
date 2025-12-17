import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Papers API endpoints
  
  // GET all papers
  app.get("/api/papers", async (req, res) => {
    try {
      const papers = await storage.getAllPapers();
      res.json(papers);
    } catch (error) {
      console.error("Error fetching papers:", error);
      res.status(500).json({ error: "Failed to fetch papers" });
    }
  });

  // GET all daily summaries
  app.get("/api/daily-summaries", async (req, res) => {
    try {
      const summaries = await storage.getAllDailySummaries();
      res.json(summaries);
    } catch (error) {
      console.error("Error fetching daily summaries:", error);
      res.status(500).json({ error: "Failed to fetch daily summaries" });
    }
  });

  return httpServer;
}
