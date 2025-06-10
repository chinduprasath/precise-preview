import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

interface SegmentedDonutChartProps {
  data: {
    paid: {
      impressions: number;
      reach: number;
      engagement: number;
    };
    organic: {
      impressions: number;
      reach: number;
      engagement: number;
    };
  };
  title?: string;
}

const SegmentedDonutChart: React.FC<SegmentedDonutChartProps> = ({ 
  data, 
  title = 'Paid vs Organic Analytics' 
}) => {
  // Calculate totals
  const paidTotal = data.paid.impressions + data.paid.reach + data.paid.engagement;
  const organicTotal = data.organic.impressions + data.organic.reach + data.organic.engagement;
  const grandTotal = paidTotal + organicTotal;

  // Outer ring data (Paid vs Organic)
  const outerRingData = [
    {
      name: 'Paid',
      value: paidTotal,
      percentage: Math.round((paidTotal / grandTotal) * 100)
    },
    {
      name: 'Organic',
      value: organicTotal,
      percentage: Math.round((organicTotal / grandTotal) * 100)
    }
  ];

  // Inner ring data (Sub-metrics)
  const innerRingData = [
    {
      name: 'Paid Impressions',
      value: data.paid.impressions,
      category: 'Paid',
      percentage: Math.round((data.paid.impressions / paidTotal) * 100),
      totalPercentage: Math.round((data.paid.impressions / grandTotal) * 100)
    },
    {
      name: 'Paid Reach',
      value: data.paid.reach,
      category: 'Paid',
      percentage: Math.round((data.paid.reach / paidTotal) * 100),
      totalPercentage: Math.round((data.paid.reach / grandTotal) * 100)
    },
    {
      name: 'Paid Engagement',
      value: data.paid.engagement,
      category: 'Paid',
      percentage: Math.round((data.paid.engagement / paidTotal) * 100),
      totalPercentage: Math.round((data.paid.engagement / grandTotal) * 100)
    },
    {
      name: 'Organic Impressions',
      value: data.organic.impressions,
      category: 'Organic',
      percentage: Math.round((data.organic.impressions / organicTotal) * 100),
      totalPercentage: Math.round((data.organic.impressions / grandTotal) * 100)
    },
    {
      name: 'Organic Reach',
      value: data.organic.reach,
      category: 'Organic',
      percentage: Math.round((data.organic.reach / organicTotal) * 100),
      totalPercentage: Math.round((data.organic.reach / grandTotal) * 100)
    },
    {
      name: 'Organic Engagement',
      value: data.organic.engagement,
      category: 'Organic',
      percentage: Math.round((data.organic.engagement / organicTotal) * 100),
      totalPercentage: Math.round((data.organic.engagement / grandTotal) * 100)
    }
  ];

  // Color schemes
  const outerColors = {
    'Paid': 'hsl(var(--primary))', // Blue
    'Organic': 'hsl(142, 76%, 36%)' // Green
  };

  const innerColors = {
    'Paid Impressions': 'hsl(221, 83%, 45%)', // Dark blue
    'Paid Reach': 'hsl(221, 83%, 60%)', // Medium blue
    'Paid Engagement': 'hsl(221, 83%, 75%)', // Light blue
    'Organic Impressions': 'hsl(142, 76%, 25%)', // Dark green
    'Organic Reach': 'hsl(142, 76%, 36%)', // Medium green
    'Organic Engagement': 'hsl(142, 76%, 50%)' // Light green
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Value: {data.value.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.category ? `${data.percentage}% of ${data.category}` : `${data.percentage}% of total`}
          </p>
          {data.totalPercentage && (
            <p className="text-sm text-muted-foreground">
              {data.totalPercentage}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const formatPercentageLabel = (entry: any) => {
    return `${entry.name}\n${entry.percentage}%`;
  };

  // Legend items with all metrics
  const allLegendItems = [
    ...outerRingData.map(item => ({
      name: item.name,
      color: outerColors[item.name as keyof typeof outerColors],
      percentage: item.percentage,
      value: item.value
    })),
    ...innerRingData.map(item => ({
      name: item.name,
      color: innerColors[item.name as keyof typeof innerColors],
      percentage: item.totalPercentage,
      value: item.value
    }))
  ];

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 text-foreground">{title}</h3>
        <div className="flex items-start gap-8">
          {/* Chart Container - Matching height with ReachViewsChart (320px) */}
          <div className="flex-1 h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Outer ring (Paid vs Organic) */}
                <Pie
                  data={outerRingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={formatPercentageLabel}
                  outerRadius={120}
                  innerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {outerRingData.map((entry, index) => (
                    <Cell 
                      key={`outer-cell-${index}`} 
                      fill={outerColors[entry.name as keyof typeof outerColors]} 
                    />
                  ))}
                </Pie>
                
                {/* Inner ring (Sub-metrics) */}
                <Pie
                  data={innerRingData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {innerRingData.map((entry, index) => (
                    <Cell 
                      key={`inner-cell-${index}`} 
                      fill={innerColors[entry.name as keyof typeof innerColors]} 
                    />
                  ))}
                </Pie>
                
                <Tooltip 
                  content={<CustomTooltip />} 
                  wrapperStyle={{ zIndex: 9999 }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xs text-muted-foreground font-medium">Total Activity</div>
                <div className="text-lg font-bold text-foreground">
                  {(grandTotal / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Legend - Removed top margin/padding */}
          <div className="w-72 space-y-2">
            <h4 className="text-sm font-semibold text-foreground mb-2">Legend</h4>
            <div className="space-y-2">
              {allLegendItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground font-medium">
                      {item.name} - {item.percentage}% • {item.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentedDonutChart;
