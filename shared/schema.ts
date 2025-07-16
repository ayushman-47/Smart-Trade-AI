import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tradeRecommendations = pgTable("trade_recommendations", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'crypto' or 'stock'
  currentPrice: real("current_price").notNull(),
  targetPrice: real("target_price").notNull(),
  stopLoss: real("stop_loss").notNull(),
  entry: real("entry").notNull(),
  exit: real("exit").notNull(),
  trend: text("trend").notNull(), // 'bullish' or 'bearish'
  projectedReturn: real("projected_return").notNull(),
  score: integer("score").notNull(),
  riskLevel: text("risk_level").notNull(), // 'low', 'medium', 'high'
  explanation: text("explanation").notNull(),
  timeframe: text("timeframe").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTradeRecommendationSchema = createInsertSchema(tradeRecommendations).omit({
  id: true,
  createdAt: true,
});

export const analyzeRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  timeframe: z.enum(["1min", "5min", "15min", "30min", "1H", "4H", "1D", "1W", "1M"]),
  riskLevel: z.enum(["low", "medium", "high"]),
});

export const marketOverviewSchema = z.object({
  sentiment: z.string(),
  sentimentChange: z.string(),
  activeTrades: z.number(),
  successRate: z.number(),
  totalReturn: z.number(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TradeRecommendation = typeof tradeRecommendations.$inferSelect;
export type InsertTradeRecommendation = z.infer<typeof insertTradeRecommendationSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type MarketOverview = z.infer<typeof marketOverviewSchema>;
