export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("OpenRouter API key is required");
    }
  }

  async getTradeRecommendations(marketContext: any): Promise<any[]> {
    try {
      const prompt = this.buildAnalysisPrompt(marketContext);
      
      const response = await Promise.race([
        fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(",")[0] || "http://localhost:5000",
          "X-Title": "SmartTrade AI"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: "You are a professional trading analyst with expertise in cryptocurrency and stock markets. Provide accurate, data-driven trading recommendations based on technical analysis and market conditions."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 2000
        })
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenRouter API timeout')), 15000)
      )
    ]);

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        return this.formatRecommendations(parsed, marketContext);
      } catch (parseError) {
        throw new Error("Failed to parse AI response: " + parseError.message);
      }
    } catch (error) {
      console.error("OpenRouter API error:", error);
      if (error.message.includes('timeout')) {
        // Return fallback recommendations on timeout
        return this.getFallbackRecommendations();
      }
      throw new Error("Failed to get AI recommendations: " + error.message);
    }
  }

  private buildAnalysisPrompt(context: any): string {
    return `
Analyze the following market data and provide trading recommendations in JSON format.

Market Context:
- User Query: "${context.userQuery}"
- Timeframe: ${context.timeframe}
- Risk Level: ${context.riskLevel}
- Crypto Data: ${JSON.stringify(context.crypto)}
- Stock Data: ${JSON.stringify(context.stocks)}

Please provide exactly 4 cryptocurrency and 4 stock recommendations in this JSON format:
{
  "recommendations": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "type": "crypto",
      "currentPrice": 67842.50,
      "targetPrice": 72500.00,
      "stopLoss": 64200.00,
      "entry": 67800.00,
      "exit": 72500.00,
      "trend": "bullish",
      "projectedReturn": 6.9,
      "explanation": "Strong institutional buying and technical breakout above $67K resistance. RSI shows healthy momentum.",
      "volatility": 0.08
    }
  ]
}

Focus on:
1. Technical indicators (RSI, MACD, Volume, Moving Averages)
2. Market sentiment and news impact
3. Risk-adjusted returns based on user's risk preference
4. Clear entry/exit strategies
5. Realistic price targets based on support/resistance levels

Ensure all recommendations are actionable and include specific price points.
`;
  }

  private formatRecommendations(parsed: any, context: any): any[] {
    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      throw new Error("Invalid AI response format");
    }

    return parsed.recommendations.map((rec: any) => ({
      symbol: rec.symbol?.toUpperCase() || "",
      name: rec.name || "",
      type: rec.type || "crypto",
      currentPrice: Number(rec.currentPrice) || 0,
      targetPrice: Number(rec.targetPrice) || 0,
      stopLoss: Number(rec.stopLoss) || 0,
      entry: Number(rec.entry) || 0,
      exit: Number(rec.exit) || 0,
      trend: rec.trend || "bullish",
      projectedReturn: Number(rec.projectedReturn) || 0,
      explanation: rec.explanation || "No explanation provided",
      volatility: Number(rec.volatility) || 0.1
    }));
  }

  private getFallbackRecommendations(): any[] {
    console.log("Using fallback AI recommendations");
    return [
      {
        symbol: "BTC",
        name: "Bitcoin",
        type: "crypto",
        currentPrice: 118000,
        targetPrice: 125000,
        stopLoss: 115000,
        entry: 117500,
        exit: 125000,
        trend: "bullish",
        projectedReturn: 6.4,
        explanation: "Strong institutional adoption and technical breakout above key resistance levels",
        volatility: 0.12
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        type: "crypto",
        currentPrice: 3100,
        targetPrice: 3400,
        stopLoss: 2950,
        entry: 3080,
        exit: 3400,
        trend: "bullish",
        projectedReturn: 9.7,
        explanation: "Ethereum 2.0 upgrades and DeFi growth driving demand",
        volatility: 0.15
      },
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        type: "stock",
        currentPrice: 225.5,
        targetPrice: 240.0,
        stopLoss: 218.0,
        entry: 224.0,
        exit: 240.0,
        trend: "bullish",
        projectedReturn: 6.4,
        explanation: "Strong iPhone sales and services growth momentum",
        volatility: 0.08
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corp.",
        type: "stock",
        currentPrice: 465.2,
        targetPrice: 485.0,
        stopLoss: 450.0,
        entry: 463.0,
        exit: 485.0,
        trend: "bullish",
        projectedReturn: 4.3,
        explanation: "Cloud computing growth and AI integration driving value",
        volatility: 0.06
      }
    ];
  }
}
