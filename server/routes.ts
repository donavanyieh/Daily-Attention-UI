import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatWithPaper, type ChatMessage } from "./gemini";

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

  // GET paper markdown by ID
  app.get("/api/papers/:id/markdown", async (req, res) => {
    try {
      const { id } = req.params;
      const markdown = await storage.getPaperMarkdown(id);
      
      if (!markdown) {
        res.status(404).json({ error: "Paper markdown not found" });
        return;
      }
      
      res.json(markdown);
    } catch (error) {
      console.error("Error fetching paper markdown:", error);
      res.status(500).json({ error: "Failed to fetch paper markdown" });
    }
  });

  // POST chat with paper
  app.post("/api/chat/:paperId", async (req, res) => {
    try {
      const { paperId } = req.params;
      const { messages, paperTitle, paperMarkdown } = req.body as { 
        messages: ChatMessage[]; 
        paperTitle?: string;
        paperMarkdown?: string;
      };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Messages array is required" });
        return;
      }

      // Use provided paper data or fetch from BigQuery as fallback
      let markdown;
      if (paperTitle && paperMarkdown) {
        // Use paper data provided by frontend (optimization - no BigQuery call!)
        markdown = {
          title: paperTitle,
          markdown_text: paperMarkdown,
        };
      } else {
        // Fallback: fetch from BigQuery if not provided
        markdown = await storage.getPaperMarkdown(paperId);
        if (!markdown) {
          res.status(404).json({ error: "Paper not found or not available for chat" });
          return;
        }
      }

      // Chat with Gemini
      const response = await chatWithPaper(messages, {
        title: markdown.title,
        markdownText: markdown.markdown_text,
      });

      res.json({ response });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      res.status(500).json({ 
        error: "Failed to generate response",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return httpServer;
}
