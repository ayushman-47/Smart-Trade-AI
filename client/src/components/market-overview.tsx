import { Card, CardContent } from "@/components/ui/card";
import { PieChart, ArrowRightLeft, Target, TrendingUp } from "lucide-react";
import type { MarketOverview } from "@shared/schema";

interface MarketOverviewProps {
  data?: MarketOverview;
  isLoading: boolean;
}

export function MarketOverview({ data, isLoading }: MarketOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="backdrop-blur-sm border-slate-700 animate-pulse" style={{ backgroundColor: "var(--trading-secondary)" }}>
            <CardContent className="p-6">
              <div className="h-16 bg-slate-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-sm border-slate-700" style={{ backgroundColor: "var(--trading-secondary)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-300">Market Sentiment</h3>
              <PieChart style={{ color: "var(--trading-accent)" }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--trading-success)" }}>Bullish</div>
            <div className="text-sm" style={{ color: "var(--trading-muted)" }}>+12.3% vs yesterday</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm border-slate-700" style={{ backgroundColor: "var(--trading-secondary)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-300">Active Trades</h3>
              <ArrowRightLeft style={{ color: "var(--trading-accent)" }} />
            </div>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-sm" style={{ color: "var(--trading-muted)" }}>4 crypto, 4 stocks</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm border-slate-700" style={{ backgroundColor: "var(--trading-secondary)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-300">Success Rate</h3>
              <Target style={{ color: "var(--trading-accent)" }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--trading-success)" }}>87.5%</div>
            <div className="text-sm" style={{ color: "var(--trading-muted)" }}>Last 30 days</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm border-slate-700" style={{ backgroundColor: "var(--trading-secondary)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-300">Total Return</h3>
              <TrendingUp style={{ color: "var(--trading-accent)" }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--trading-success)" }}>+24.7%</div>
            <div className="text-sm" style={{ color: "var(--trading-muted)" }}>This month</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="backdrop-blur-sm border-slate-700" style={{ backgroundColor: "var(--trading-secondary)" }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Market Sentiment</h3>
            <PieChart style={{ color: "var(--trading-accent)" }} />
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--trading-success)" }}>{data.sentiment}</div>
          <div className="text-sm" style={{ color: "var(--trading-muted)" }}>{data.sentimentChange}</div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-sm border-slate-700" style={{ backgroundColor: "var(--trading-secondary)" }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Active Trades</h3>
            <ArrowRightLeft style={{ color: "var(--trading-accent)" }} />
          </div>
          <div className="text-2xl font-bold text-white">{data.activeTrades}</div>
          <div className="text-sm" style={{ color: "var(--trading-muted)" }}>4 crypto, 4 stocks</div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-sm border-slate-700" style={{ backgroundColor: "var(--trading-secondary)" }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Success Rate</h3>
            <Target style={{ color: "var(--trading-accent)" }} />
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--trading-success)" }}>{data.successRate}%</div>
          <div className="text-sm" style={{ color: "var(--trading-muted)" }}>Last 30 days</div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-sm border-slate-700" style={{ backgroundColor: "var(--trading-secondary)" }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Total Return</h3>
            <TrendingUp style={{ color: "var(--trading-accent)" }} />
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--trading-success)" }}>+{data.totalReturn}%</div>
          <div className="text-sm" style={{ color: "var(--trading-muted)" }}>This month</div>
        </CardContent>
      </Card>
    </div>
  );
}
