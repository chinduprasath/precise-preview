
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  name: string;
  volume: number;
  service: number;
}

const LevelChart: React.FC = () => {
  const data: DataPoint[] = [
    { name: 'Jan', volume: 70, service: 90 },
    { name: 'Feb', volume: 90, service: 30 },
    { name: 'Mar', volume: 70, service: 40 },
    { name: 'Apr', volume: 60, service: 75 },
    { name: 'May', volume: 50, service: 30 },
    { name: 'Jun', volume: 45, service: 35 },
  ];

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">Level</h2>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#4F46E5" />
              <Bar dataKey="service" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center items-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            <span className="text-sm">Volume</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-black"></div>
            <span className="text-sm">Service</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelChart;
