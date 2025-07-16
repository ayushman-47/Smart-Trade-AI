import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Lightbulb, Bitcoin, DollarSign, Apple, Cpu, Car, Layers } from "lucide-react";
import type { TradeRecommendation } from "@shared/schema";

interface TradeCardProps {
  trade: TradeRecommendation;
}

const getIconForSymbol = (symbol: string, type: string) => {
  if (type === "crypto") {
    switch (symbol.toUpperCase()) {
      case "BTC":
        return <Bitcoin className="text-orange-500" />;
      case "ETH":
        return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">E</span>
        </div>;
      case "SOL":
        return <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">S</span>
        </div>;
      case "ADA":
        return <Layers className="text-blue-600" />;
      default:
        return <DollarSign className="text-green-500" />;
    }
  } else {
    switch (symbol.toUpperCase()) {
      case "TSLA":
        return <Car className="text-red-500" />;
      case "NVDA":
        return <Cpu className="text-green-500" />;
      case "MSFT":
        return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">M</span>
        </div>;
      case "AAPL":
        return <Apple className="text-gray-600" />;
      default:
        return <DollarSign className="text-green-500" />;
    }
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":
      return "bg-green-600/20 text-green-400";
    case "medium":
      return "bg-yellow-600/20 text-yellow-400";
    case "high":
      return "bg-red-600/20 text-red-400";
    default:
      return "bg-gray-600/20 text-gray-400";
  }
};

export function TradeCard({ trade }: TradeCardProps) {
  const formatPrice = (price: number) => `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatReturn = (returnPercent: number) => `+${returnPercent.toFixed(1)}%`;

  return (
    <Card 
      className="backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-200" 
      style={{ backgroundColor: "var(--trading-secondary)" }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              {getIconForSymbol(trade.symbol, trade.type)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{trade.name}</h3>
              <p className="text-sm" style={{ color: "var(--trading-muted)" }}>{trade.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Badge className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(trade.riskLevel)}`}>
                {trade.riskLevel.toUpperCase()} RISK
              </Badge>
              <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-mono font-medium">
                {trade.score}/100
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--trading-muted)" }}>Current Price</p>
            <p className="font-mono text-lg font-semibold text-white">{formatPrice(trade.currentPrice)}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--trading-muted)" }}>Target Price</p>
            <p className="font-mono text-lg font-semibold" style={{ color: "var(--trading-success)" }}>
              {formatPrice(trade.targetPrice)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--trading-muted)" }}>Entry</p>
            <p className="font-mono text-sm text-white">{formatPrice(trade.entry)}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--trading-muted)" }}>Stop Loss</p>
            <p className="font-mono text-sm" style={{ color: "var(--trading-danger)" }}>
              {formatPrice(trade.stopLoss)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--trading-muted)" }}>Exit</p>
            <p className="font-mono text-sm" style={{ color: "var(--trading-success)" }}>
              {formatPrice(trade.exit)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {trade.trend === "bullish" ? (
              <TrendingUp style={{ color: "var(--trading-success)" }} />
            ) : (
              <TrendingDown style={{ color: "var(--trading-danger)" }} />
            )}
            <span className={`text-sm font-medium ${trade.trend === "bullish" ? "text-green-400" : "text-red-400"}`}>
              {trade.trend === "bullish" ? "Bullish" : "Bearish"} Trend
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: "var(--trading-muted)" }}>Projected Return</p>
            <p className="font-mono text-lg font-semibold" style={{ color: "var(--trading-success)" }}>
              {formatReturn(trade.projectedReturn)}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-sm text-slate-300">
            <Lightbulb className="inline mr-2" style={{ color: "var(--trading-warning)" }} />
            {trade.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
