
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

interface VisitorData {
  name: string;
  visitors: number;
}

const VisitorInsights: React.FC = () => {
  // Sample data for the visitor insights chart
  const data: VisitorData[] = [
    { name: 'Jan', visitors: 120 },
    { name: 'Feb', visitors: 140 },
    { name: 'Mar', visitors: 350 },
    { name: 'Apr', visitors: 270 },
    { name: 'May', visitors: 320 },
    { name: 'Jun', visitors: 280 },
    { name: 'Jul', visitors: 380 },
    { name: 'Aug', visitors: 400 },
    { name: 'Sep', visitors: 350 },
    { name: 'Oct', visitors: 320 },
    { name: 'Nov', visitors: 280 },
    { name: 'Dec', visitors: 300 },
  ];

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">Visitor Insights</h2>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="#4F46E5" 
                fillOpacity={1} 
                fill="url(#colorVisitors)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorInsights;
