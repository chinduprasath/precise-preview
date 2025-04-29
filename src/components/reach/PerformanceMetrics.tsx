
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getPlatformColor } from './utils/formatUtils';

interface PerformanceMetric {
  label: string;
  value: string | number;
  percentage: number;
  color?: string;
}

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 text-foreground">Campaign Performance Metrics</h3>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">{metric.label}</span>
                <span className="text-foreground">{metric.value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${metric.percentage}%`,
                    backgroundColor: metric.color || getPlatformColor(index.toString())
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
