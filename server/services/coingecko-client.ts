export class CoinGeckoClient {
  private baseUrl = "https://api.coingecko.com/api/v3";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.COINGECKO_API_KEY || "";
  }

  async getTopCryptos(): Promise<any[]> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json"
      };

      if (this.apiKey) {
        headers["x-cg-demo-api-key"] = this.apiKey;
      }

      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.map((coin: any) => ({
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
    } catch (error) {
      console.error("CoinGecko API error:", error);
      throw new Error("Failed to fetch crypto data: " + error.message);
    }
  }

  async getMarketStats(): Promise<any> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json"
      };

      if (this.apiKey) {
        headers["x-cg-demo-api-key"] = this.apiKey;
      }

      const response = await fetch(
        `${this.baseUrl}/global`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        total_market_cap: data.data.total_market_cap?.usd || 0,
        total_volume: data.data.total_volume?.usd || 0,
        market_cap_change_percentage_24h: data.data.market_cap_change_percentage_24h_usd || 0,
        active_cryptocurrencies: data.data.active_cryptocurrencies || 0
      };
    } catch (error) {
      console.error("CoinGecko market stats error:", error);
      throw new Error("Failed to fetch crypto market stats: " + error.message);
    }
  }
}
