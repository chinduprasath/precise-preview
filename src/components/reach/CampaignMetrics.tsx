
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from './utils/formatUtils';
import { CircleDollarSign, BarChart, Users, Target, ArrowUp, ArrowDown } from 'lucide-react';

interface CampaignMetricsProps {
  campaignValue: number;
  campaignGoal: number;
  metrics: {
    impressions: {
      value: number;
      change: number;
    };
    engagementRate: {
      value: number;
      change: number;
    };
    conversionRate: {
      value: number;
      change: number;
    };
  };
}

const CampaignMetrics: React.FC<CampaignMetricsProps> = ({ 
  campaignValue, 
  campaignGoal, 
  metrics 
}) => {
  const percentage = Math.min(Math.round((campaignValue / campaignGoal) * 100), 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Campaign Revenue</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-full">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </div>
          
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-primary">
              {formatCurrency(campaignValue)}
            </h2>
            <p className="text-sm text-muted-foreground">
              of {formatCurrency(campaignGoal)} Monthly Goal
            </p>
          </div>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary/10 text-primary">
                  {percentage}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
              <div 
                style={{ width: `${percentage}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-primary-foreground justify-center bg-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Impressions</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-full">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {metrics.impressions.value.toLocaleString()}
            </h2>
            <div className={`flex items-center text-sm ${metrics.impressions.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.impressions.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {formatPercentage(Math.abs(metrics.impressions.change))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Engagement Rate</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-full">
              <BarChart className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.engagementRate.value)}
            </h2>
            <div className={`flex items-center text-sm ${metrics.engagementRate.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.engagementRate.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {formatPercentage(Math.abs(metrics.engagementRate.change))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-full">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.conversionRate.value)}
            </h2>
            <div className={`flex items-center text-sm ${metrics.conversionRate.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.conversionRate.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {formatPercentage(Math.abs(metrics.conversionRate.change))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignMetrics;
