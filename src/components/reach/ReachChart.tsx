
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { getPlatformColor } from './utils/formatUtils';

interface ReachChartProps {
  data: Array<{
    day: string;
    [key: string]: any;
  }>;
  dataKeys: Array<{
    key: string;
    name: string;
  }>;
  title?: string;
}

const ReachChart: React.FC<ReachChartProps> = ({ 
  data, 
  dataKeys,
  title = 'Reach & Impressions' 
}) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 text-foreground">{title}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
              <Legend />
              {dataKeys.map((dataKey, index) => (
                <Area 
                  key={dataKey.key}
                  type="monotone" 
                  dataKey={dataKey.key} 
                  stroke={getPlatformColor(dataKey.key)} 
                  fill={`${getPlatformColor(dataKey.key)}40`} 
                  name={dataKey.name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReachChart;
