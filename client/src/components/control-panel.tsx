import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Brain, Clock, Shield, Search } from "lucide-react";
import type { AnalyzeRequest } from "@shared/schema";

interface ControlPanelProps {
  onAnalyze: (data: AnalyzeRequest) => void;
  isLoading: boolean;
}

export function ControlPanel({ onAnalyze, isLoading }: ControlPanelProps) {
  const [prompt, setPrompt] = useState("Which trade should I take now?");
  const [timeframe, setTimeframe] = useState<string>("1H");
  const [riskLevel, setRiskLevel] = useState<string>("low");

  const handleSubmit = () => {
    onAnalyze({
      prompt,
      timeframe: timeframe as any,
      riskLevel: riskLevel as any,
    });
  };

  return (
    <Card 
      className="backdrop-blur-sm border-slate-700" 
      style={{ backgroundColor: "var(--trading-secondary)" }}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Prompt Input */}
          <div className="lg:col-span-6">
            <Label className="block text-sm font-medium text-slate-300 mb-3">
              <Brain className="inline mr-2" style={{ color: "var(--trading-accent)" }} />
              AI Trading Query
            </Label>
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                placeholder="Which trade should I take now?"
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                <span className="text-xs text-slate-400">AI-Powered</span>
                <Brain className="text-sm" style={{ color: "var(--trading-accent)" }} />
              </div>
            </div>
          </div>

          {/* Timeframe Selection */}
          <div className="lg:col-span-3">
            <Label className="block text-sm font-medium text-slate-300 mb-3">
              <Clock className="inline mr-2" style={{ color: "var(--trading-accent)" }} />
              Timeframe
            </Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1min">1 Minute</SelectItem>
                <SelectItem value="5min">5 Minutes</SelectItem>
                <SelectItem value="15min">15 Minutes</SelectItem>
                <SelectItem value="30min">30 Minutes</SelectItem>
                <SelectItem value="1H">1 Hour</SelectItem>
                <SelectItem value="4H">4 Hours</SelectItem>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Level */}
          <div className="lg:col-span-3">
            <Label className="block text-sm font-medium text-slate-300 mb-3">
              <Shield className="inline mr-2" style={{ color: "var(--trading-accent)" }} />
              Risk Level
            </Label>
            <div className="flex bg-slate-800 rounded-lg border border-slate-600 p-1">
              <Button
                variant={riskLevel === "low" ? "default" : "ghost"}
                className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                  riskLevel === "low" 
                    ? "bg-green-600 text-white" 
                    : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setRiskLevel("low")}
              >
                Low
              </Button>
              <Button
                variant={riskLevel === "medium" ? "default" : "ghost"}
                className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                  riskLevel === "medium" 
                    ? "bg-yellow-600 text-white" 
                    : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setRiskLevel("medium")}
              >
                Medium
              </Button>
              <Button
                variant={riskLevel === "high" ? "default" : "ghost"}
                className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                  riskLevel === "high" 
                    ? "bg-red-600 text-white" 
                    : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setRiskLevel("high")}
              >
                High
              </Button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-500 transition-all duration-200 shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Market
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
