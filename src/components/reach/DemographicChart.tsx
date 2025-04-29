
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getPlatformColor } from './utils/formatUtils';

interface DemographicChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
}

const COLORS = ['#4361EE', '#7209B7', '#F72585', '#06D6A0', '#FFBE0B'];

const DemographicChart: React.FC<DemographicChartProps> = ({ data, title = 'Audience Demographics' }) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 text-foreground">{title}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemographicChart;
