
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceMetricsProps {
  metrics: {
    cpe: number;
    cpm: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const data = [
    { name: 'CPE', value: metrics.cpe },
    { name: 'CPM', value: metrics.cpm }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{`${label}: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barCategoryGap="40%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                tick={{ fontSize: 14, fontWeight: 500, fill: '#374151' }}
              />
              <YAxis 
                domain={[0, 'dataMax + 0.5']}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
