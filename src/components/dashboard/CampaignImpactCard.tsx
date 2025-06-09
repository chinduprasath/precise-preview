import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, TrendingUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CampaignImpactCardProps {
  score: number;
  isLoading?: boolean;
}

const CampaignImpactCard: React.FC<CampaignImpactCardProps> = ({ score, isLoading = false }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return "text-green-600";
    } else if (score >= 60) {
      return "text-orange-600";
    } else {
      return "text-yellow-600";
    }
  };

  return (
    <Card className="bg-card text-card-foreground border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 font-medium">Campaign Impact Score</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p className="text-sm">
                    Impact Score = Engagement Rate (35%) + Reach (25%) + Consistency (15%) + Platform Diversity (10%) + Order Completion Rate (15%)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="rounded-full p-2 bg-white/50 dark:bg-white/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-2">
          <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {isLoading ? "..." : `${score}/100`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignImpactCard; 