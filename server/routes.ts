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

  // GET available paper dates
  app.get("/api/papers/dates", async (req, res) => {
    try {
      const dates = await storage.getAvailablePaperDates();
      res.json(dates);
    } catch (error) {
      console.error("Error fetching paper dates:", error);
      res.status(500).json({ error: "Failed to fetch paper dates" });
    }
  });

  // GET papers for a specific date
  app.get("/api/papers/by-date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const papers = await storage.getPapersByDate(date);
      res.json(papers);
    } catch (error) {
      console.error("Error fetching papers by date:", error);
      res.status(500).json({ error: "Failed to fetch papers by date" });
    }
  });

  // GET latest date and its papers
  app.get("/api/papers/latest-date", async (req, res) => {
    try {
      const result = await storage.getLatestDatePapers();
      res.json(result);
    } catch (error) {
      console.error("Error fetching latest date papers:", error);
      res.status(500).json({ error: "Failed to fetch latest date papers" });
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
