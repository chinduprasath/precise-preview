import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, ResponsiveContainer } from 'recharts';

interface DataTabContentProps {
  influencerId?: string;
}

const MetricCard = ({ value, label }: { value: number; label: string }) => (
  <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
    <span className="text-2xl font-semibold">{value}</span>
    <span className="text-sm text-gray-600 mt-1">{label}</span>
  </div>
);

const priceRangeData = [
  { price: 2000, count: 2 },
  { price: 2200, count: 3 },
  { price: 2400, count: 4 },
  { price: 2600, count: 5 },
  { price: 2800, count: 7 },
  { price: 3000, count: 6 },
  { price: 3200, count: 5 },
  { price: 3400, count: 4 },
  { price: 3500, count: 2 },
];

const weightData = [
  { month: 'Jan', yourWeight: 200, idealWeight: 250 },
  { month: 'Feb', yourWeight: 250, idealWeight: 240 },
  { month: 'Mar', yourWeight: 400, idealWeight: 230 },
  { month: 'Apr', yourWeight: 300, idealWeight: 260 },
  { month: 'May', yourWeight: 280, idealWeight: 240 },
  { month: 'Jun', yourWeight: 220, idealWeight: 230 },
];

const engagementData = [
  { date: '2024-01', value: 50 },
  { date: '2024-02', value: 52 },
  { date: '2024-03', value: 55 },
  { date: '2024-04', value: 58 },
  { date: '2024-05', value: 60 },
  { date: '2024-06', value: 62 },
];

const DataTabContent: React.FC<DataTabContentProps> = ({ influencerId }) => {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard value={90} label="Total Campaigns" />
        <MetricCard value={90} label="Avg Likes" />
        <MetricCard value={90} label="Engagement" />
        <MetricCard value={90} label="Avg Comments" />
        <MetricCard value={90} label="Avg Shares" />
        <MetricCard value={90} label="Fake Followers" />
      </div>

      {/* Price Range Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={priceRangeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="price" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>$2000</span>
          <span>$3500</span>
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Engagement Growth */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4F46E5" 
                fillOpacity={1} 
                fill="url(#colorEngagement)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance Comparison */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="yourWeight" fill="#4F46E5" name="Your Weight" />
              <Bar dataKey="idealWeight" fill="#93C5FD" name="Ideal Weight" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default DataTabContent;
