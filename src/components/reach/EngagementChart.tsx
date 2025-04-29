
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPlatformColor } from './utils/formatUtils';

interface EngagementChartProps {
  data: Array<{
    day: string;
    instagram?: number;
    facebook?: number;
    twitter?: number;
    youtube?: number;
    [key: string]: any;
  }>;
  title?: string;
  dataKeys: Array<{
    key: string;
    name: string;
  }>;
}

const EngagementChart: React.FC<EngagementChartProps> = ({ 
  data, 
  title = 'Engagement Overview',
  dataKeys
}) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 text-foreground">{title}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="day" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))'
                }} 
              />
              {dataKeys.map((dataKey) => (
                <Bar 
                  key={dataKey.key}
                  dataKey={dataKey.key} 
                  name={dataKey.name} 
                  fill={getPlatformColor(dataKey.key)} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
