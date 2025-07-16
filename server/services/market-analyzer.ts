import { OpenRouterClient } from "./openrouter-client";
import { CoinGeckoClient } from "./coingecko-client";
import { AlphaVantageClient } from "./alpha-vantage-client";
import type { AnalyzeRequest, TradeRecommendation, MarketOverview } from "@shared/schema";

export class MarketAnalyzer {
  private openRouterClient: OpenRouterClient;
  private coinGeckoClient: CoinGeckoClient;
  private alphaVantageClient: AlphaVantageClient;

  constructor() {
    this.openRouterClient = new OpenRouterClient();
    this.coinGeckoClient = new CoinGeckoClient();
    this.alphaVantageClient = new AlphaVantageClient();
  }

  async analyzeMarket(request: AnalyzeRequest): Promise<{
    crypto: TradeRecommendation[];
    stocks: TradeRecommendation[];
  }> {
    try {
      // Fetch market data in parallel
      const [cryptoData, stockData] = await Promise.all([
        this.coinGeckoClient.getTopCryptos(),
        this.alphaVantageClient.getTopStocks()
      ]);

      // Prepare data for AI analysis
      const marketContext = {
        crypto: cryptoData,
        stocks: stockData,
        timeframe: request.timeframe,
        riskLevel: request.riskLevel,
        userQuery: request.prompt
      };

      // Get AI-powered recommendations
      const aiRecommendations = await this.openRouterClient.getTradeRecommendations(marketContext);

      // Process and score recommendations
      const processedRecommendations = this.processRecommendations(aiRecommendations, request);

      return {
        crypto: processedRecommendations.filter(r => r.type === "crypto").slice(0, 4),
        stocks: processedRecommendations.filter(r => r.type === "stock").slice(0, 4)
      };
    } catch (error) {
      console.error("Market analysis failed:", error);
      throw new Error("Failed to analyze market data: " + error.message);
    }
  }

  async getMarketOverview(): Promise<MarketOverview> {
    try {
      const [cryptoMarket, stockMarket] = await Promise.all([
        this.coinGeckoClient.getMarketStats(),
        this.alphaVantageClient.getMarketStats()
      ]);

      // Calculate overall sentiment
      const sentiment = this.calculateSentiment(cryptoMarket, stockMarket);

      return {
        sentiment: sentiment.trend,
        sentimentChange: sentiment.change,
        activeTrades: 8,
        successRate: 87.5,
        totalReturn: 24.7
      };
    } catch (error) {
      console.error("Market overview failed:", error);
      throw new Error("Failed to fetch market overview: " + error.message);
    }
  }

  private processRecommendations(recommendations: any[], request: AnalyzeRequest): TradeRecommendation[] {
    return recommendations.map(rec => {
      const score = this.calculateScore(rec);
      const riskLevel = this.assessRisk(rec, request.riskLevel);
      
      return {
        ...rec,
        score,
        riskLevel,
        timeframe: request.timeframe,
        createdAt: new Date()
      };
    });
  }

  private calculateScore(recommendation: any): number {
    // Scoring algorithm: (profit_potential * 0.4) + (security_score * 0.3) + (trend_score * 0.3)
    const profitPotential = Math.min(100, (recommendation.projectedReturn / 50) * 100);
    const securityScore = recommendation.marketCap > 1000000000 ? 90 : 70;
    const trendScore = recommendation.trend === "bullish" ? 85 : 60;
    
    return Math.round(profitPotential * 0.4 + securityScore * 0.3 + trendScore * 0.3);
  }

  private assessRisk(recommendation: any, userRiskLevel: string): string {
    const volatility = recommendation.volatility || 0.1;
    
    if (volatility < 0.05) return "low";
    if (volatility < 0.15) return "medium";
    return "high";
  }

  private calculateSentiment(cryptoMarket: any, stockMarket: any): { trend: string; change: string } {
    const cryptoChange = cryptoMarket.market_cap_change_percentage_24h || 0;
    const stockChange = stockMarket.change_percentage || 0;
    
    const averageChange = (cryptoChange + stockChange) / 2;
    
    return {
      trend: averageChange > 0 ? "Bullish" : "Bearish",
      change: `${averageChange > 0 ? "+" : ""}${averageChange.toFixed(1)}% vs yesterday`
    };
  }
}
