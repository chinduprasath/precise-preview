
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

interface FulfillmentData {
  name: string;
  lastMonth: number;
  thisMonth: number;
}

const CustomerFulfillment: React.FC = () => {
  // Sample data
  const data: FulfillmentData[] = [
    { name: 'Jan', lastMonth: 4000, thisMonth: 2400 },
    { name: 'Feb', lastMonth: 3000, thisMonth: 1398 },
    { name: 'Mar', lastMonth: 2000, thisMonth: 9800 },
    { name: 'Apr', lastMonth: 2780, thisMonth: 3908 },
    { name: 'May', lastMonth: 1890, thisMonth: 4800 },
    { name: 'Jun', lastMonth: 2390, thisMonth: 3800 },
    { name: 'Jul', lastMonth: 3490, thisMonth: 4300 },
  ];

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-2">Customer Fulfillment</h2>
        
        <div className="h-[200px] w-full mt-4">
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="thisMonth" 
                stackId="1" 
                stroke="#4F46E5" 
                fill="#4F46E5" 
                fillOpacity={0.5}
              />
              <Area 
                type="monotone" 
                dataKey="lastMonth" 
                stackId="1" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            <span>Last Month</span>
            <span className="font-medium">$4,087</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>This Month</span>
            <span className="font-medium">$5,506</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerFulfillment;
