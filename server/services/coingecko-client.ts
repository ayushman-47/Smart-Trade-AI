export class CoinGeckoClient {
  private baseUrl = "https://api.coingecko.com/api/v3";
  private apiKey: string;
  private lastRequestTime: number = 0;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests

  constructor() {
    this.apiKey = process.env.COINGECKO_API_KEY || "";
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      const waitTime = this.RATE_LIMIT_DELAY - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getTopCryptos(): Promise<any[]> {
    const cacheKey = 'top_cryptos';
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      await this.waitForRateLimit();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json"
      };

      // Try with API key first, then fall back to free tier
      if (this.apiKey) {
        headers["x-cg-pro-api-key"] = this.apiKey;
      }

      let response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
        { headers }
      );

      // If API key fails, try without it (free tier)
      if (!response.ok && this.apiKey) {
        console.log("CoinGecko API key failed, trying free tier...");
        delete headers["x-cg-pro-api-key"];
        await this.waitForRateLimit();
        response = await fetch(
          `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
          { headers }
        );
      }

      if (!response.ok) {
        // Check if it's a rate limit error (429)
        if (response.status === 429) {
          const cachedData = this.getCachedData(cacheKey);
          if (cachedData) {
            console.log("Using cached data due to rate limit");
            return cachedData;
          }
          console.log("Rate limited, using fallback data");
          return this.getFallbackCryptoData();
        }
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const processedData = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h
      }));

      this.setCachedData(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error("CoinGecko API error:", error);
      // If rate limited, return cached data or fallback
      if (error.message.includes("429") || error.message.includes("Too Many Requests")) {
        const cachedData = this.getCachedData(cacheKey);
        if (cachedData) {
          console.log("Using cached data due to rate limit");
          return cachedData;
        }
        // Fallback to basic crypto data
        return this.getFallbackCryptoData();
      }
      throw new Error("Failed to fetch crypto data: " + error.message);
    }
  }

  async getMarketStats(): Promise<any> {
    const cacheKey = 'market_stats';
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      await this.waitForRateLimit();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json"
      };

      // Try with API key first, then fall back to free tier
      if (this.apiKey) {
        headers["x-cg-pro-api-key"] = this.apiKey;
      }

      let response = await fetch(
        `${this.baseUrl}/global`,
        { headers }
      );

      // If API key fails, try without it (free tier)
      if (!response.ok && this.apiKey) {
        console.log("CoinGecko API key failed, trying free tier...");
        delete headers["x-cg-pro-api-key"];
        await this.waitForRateLimit();
        response = await fetch(
          `${this.baseUrl}/global`,
          { headers }
        );
      }

      if (!response.ok) {
        // Check if it's a rate limit error (429)
        if (response.status === 429) {
          const cachedData = this.getCachedData(cacheKey);
          if (cachedData) {
            console.log("Using cached market stats due to rate limit");
            return cachedData;
          }
          console.log("Rate limited, using fallback market stats");
          return this.getFallbackMarketStats();
        }
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const processedData = {
        total_market_cap: data.data.total_market_cap?.usd || 0,
        total_volume: data.data.total_volume?.usd || 0,
        market_cap_change_percentage_24h: data.data.market_cap_change_percentage_24h_usd || 0,
        active_cryptocurrencies: data.data.active_cryptocurrencies || 0
      };

      this.setCachedData(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error("CoinGecko market stats error:", error);
      // If rate limited, return cached data or fallback
      if (error.message.includes("429") || error.message.includes("Too Many Requests")) {
        const cachedData = this.getCachedData(cacheKey);
        if (cachedData) {
          console.log("Using cached market stats due to rate limit");
          return cachedData;
        }
        // Fallback to basic market data
        return this.getFallbackMarketStats();
      }
      throw new Error("Failed to fetch crypto market stats: " + error.message);
    }
  }

  private getFallbackCryptoData(): any[] {
    console.log("Using fallback crypto data");
    return [
      {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        current_price: 118000,
        market_cap: 2350000000000,
        price_change_percentage_24h: 2.5,
        price_change_percentage_7d_in_currency: 5.2,
        total_volume: 60000000000,
        high_24h: 120000,
        low_24h: 116000
      },
      {
        id: "ethereum",
        symbol: "ETH",
        name: "Ethereum",
        current_price: 3100,
        market_cap: 380000000000,
        price_change_percentage_24h: 3.8,
        price_change_percentage_7d_in_currency: 7.1,
        total_volume: 44000000000,
        high_24h: 3200,
        low_24h: 2980
      },
      {
        id: "ripple",
        symbol: "XRP",
        name: "XRP",
        current_price: 2.95,
        market_cap: 174000000000,
        price_change_percentage_24h: 1.8,
        price_change_percentage_7d_in_currency: 4.3,
        total_volume: 5800000000,
        high_24h: 3.0,
        low_24h: 2.85
      },
      {
        id: "tether",
        symbol: "USDT",
        name: "Tether",
        current_price: 1.0,
        market_cap: 160000000000,
        price_change_percentage_24h: 0.02,
        price_change_percentage_7d_in_currency: 0.05,
        total_volume: 130000000000,
        high_24h: 1.001,
        low_24h: 0.999
      }
    ];
  }

  private getFallbackMarketStats(): any {
    console.log("Using fallback market stats");
    return {
      total_market_cap: 3500000000000,
      total_volume: 200000000000,
      market_cap_change_percentage_24h: 2.1,
      active_cryptocurrencies: 15000
    };
  }
}
