
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ReachViewsChartProps {
  data: Array<{
    day: string;
    reach: number;
    views: number;
  }>;
  title?: string;
}

const ReachViewsChart: React.FC<ReachViewsChartProps> = ({ 
  data, 
  title = 'Reach & Views Overview' 
}) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 text-foreground">{title}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis 
                dataKey="day" 
                stroke="currentColor"
                fontSize={12}
              />
              <YAxis 
                stroke="currentColor"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value, name) => [
                  value.toLocaleString(),
                  name === 'reach' ? 'Reach' : 'Views'
                ]}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="reach" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Reach"
                dot={{ 
                  fill: "hsl(var(--primary))", 
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={3}
                name="Views"
                dot={{ 
                  fill: "hsl(var(--secondary))", 
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: "hsl(var(--secondary))",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))"
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReachViewsChart;
