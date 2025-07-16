export class AlphaVantageClient {
  private baseUrl = "https://www.alphavantage.co/query";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.ALPHAVANTAGE_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("Alpha Vantage API key is required");
    }
  }

  async getTopStocks(): Promise<any[]> {
    try {
      // Get data for popular stocks
      const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"];
      const stockData = [];

      // Fetch stock data with rate limiting
      for (const symbol of symbols.slice(0, 8)) {
        try {
          const data = await this.getStockQuote(symbol);
          if (data) {
            stockData.push(data);
          }
          
          // Rate limiting: Alpha Vantage allows 5 requests per minute for free tier
          await this.sleep(12000); // Wait 12 seconds between requests
        } catch (error) {
          console.error(`Failed to fetch ${symbol}:`, error);
          continue;
        }
      }

      return stockData;
    } catch (error) {
      console.error("Alpha Vantage stocks error:", error);
      throw new Error("Failed to fetch stock data: " + error.message);
    }
  }

  private async getStockQuote(symbol: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }

    if (data["Note"]) {
      throw new Error("API rate limit exceeded");
    }

    const quote = data["Global Quote"];
    if (!quote) {
      throw new Error("Invalid response format");
    }

    return {
      symbol: quote["01. symbol"],
      name: this.getCompanyName(quote["01. symbol"]),
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      change_percent: quote["10. change percent"],
      volume: parseInt(quote["06. volume"]),
      previous_close: parseFloat(quote["08. previous close"]),
      open: parseFloat(quote["02. open"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"])
    };
  }

  async getMarketStats(): Promise<any> {
    try {
      // Since Alpha Vantage doesn't have a general market stats endpoint,
      // we'll calculate based on popular indices
      const spyData = await this.getStockQuote("SPY");
      
      return {
        spy_price: spyData?.price || 0,
        change_percentage: spyData?.change_percent || "0%",
        volume: spyData?.volume || 0
      };
    } catch (error) {
      console.error("Alpha Vantage market stats error:", error);
      // Return default values if API fails
      return {
        spy_price: 0,
        change_percentage: "0%",
        volume: 0
      };
    }
  }

  private getCompanyName(symbol: string): string {
    const companies: { [key: string]: string } = {
      "AAPL": "Apple Inc.",
      "MSFT": "Microsoft Corp.",
      "GOOGL": "Alphabet Inc.",
      "AMZN": "Amazon.com Inc.",
      "TSLA": "Tesla Inc.",
      "NVDA": "NVIDIA Corp.",
      "META": "Meta Platforms Inc.",
      "NFLX": "Netflix Inc."
    };
    
    return companies[symbol] || symbol;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
