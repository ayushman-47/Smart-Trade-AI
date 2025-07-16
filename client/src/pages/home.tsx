import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ControlPanel } from "@/components/control-panel";
import { MarketOverview } from "@/components/market-overview";
import { TradeCard } from "@/components/trade-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Coins, Activity, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzeRequest, TradeRecommendation, MarketOverview as MarketOverviewType } from "@shared/schema";

export default function Home() {
  const [analysisData, setAnalysisData] = useState<{
    crypto: TradeRecommendation[];
    stocks: TradeRecommendation[];
  } | null>(null);
  
  const { toast } = useToast();

  const { data: marketOverview, isLoading: marketLoading } = useQuery<MarketOverviewType>({
    queryKey: ["/api/market-overview"],
  });

  const analyzeMarketMutation = useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisData(data);
      toast({
        title: "Analysis Complete",
        description: `Found ${data.crypto.length} crypto and ${data.stocks.length} stock recommendations`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (data: AnalyzeRequest) => {
    analyzeMarketMutation.mutate(data);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--trading-primary)" }}>
      {/* Header */}
      <header className="border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50" style={{ backgroundColor: "var(--trading-secondary)" }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SmartTrade AI</h1>
                <p className="text-sm" style={{ color: "var(--trading-muted)" }}>Real-time Trading Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm" style={{ color: "var(--trading-muted)" }}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Market Data</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono" style={{ color: "var(--trading-success)" }}>+$2,847.32</div>
                <div className="text-xs" style={{ color: "var(--trading-muted)" }}>Today's P&L</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Control Panel */}
        <div className="mb-8">
          <ControlPanel onAnalyze={handleAnalyze} isLoading={analyzeMarketMutation.isPending} />
        </div>

        {/* Market Overview */}
        <div className="mb-8">
          <MarketOverview data={marketOverview} isLoading={marketLoading} />
        </div>

        {/* Loading State */}
        {analyzeMarketMutation.isPending && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="p-8 text-center" style={{ backgroundColor: "var(--trading-secondary)" }}>
              <CardContent className="pt-0">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "var(--trading-accent)" }} />
                <p className="text-white font-medium">Analyzing Market Data...</p>
                <p className="text-sm mt-2" style={{ color: "var(--trading-muted)" }}>Fetching real-time prices and AI recommendations</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trade Recommendations */}
        {analysisData && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Cryptocurrency Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Coins className="mr-3" style={{ color: "var(--trading-warning)" }} />
                  Top Crypto Trades
                </h2>
                <div className="flex items-center space-x-2 text-sm" style={{ color: "var(--trading-muted)" }}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {analysisData.crypto.map((trade, index) => (
                  <TradeCard key={index} trade={trade} />
                ))}
              </div>
            </div>

            {/* Stock Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Activity className="mr-3" style={{ color: "var(--trading-accent)" }} />
                  Top Stock Trades
                </h2>
                <div className="flex items-center space-x-2 text-sm" style={{ color: "var(--trading-muted)" }}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Market Hours</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {analysisData.stocks.map((trade, index) => (
                  <TradeCard key={index} trade={trade} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
