import type { Express } from "express";
import { createServer, type Server } from "http";
import { MarketAnalyzer } from "./services/market-analyzer";
import { analyzeRequestSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const marketAnalyzer = new MarketAnalyzer();

  // Market analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedData = analyzeRequestSchema.parse(req.body);
      const result = await marketAnalyzer.analyzeMarket(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      
      console.error("Market analysis error:", error);
      res.status(500).json({ 
        message: "Failed to analyze market data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Market overview endpoint
  app.get("/api/market-overview", async (req, res) => {
    try {
      const overview = await marketAnalyzer.getMarketOverview();
      res.json(overview);
    } catch (error) {
      console.error("Market overview error:", error);
      res.status(500).json({ 
        message: "Failed to fetch market overview",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
