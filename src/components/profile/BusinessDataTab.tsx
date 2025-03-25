
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Area, Bar, BarChart, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const MetricCard: React.FC<{ value: string; title: string }> = ({ value, title }) => (
  <Card className="bg-gray-100">
    <CardContent className="p-4 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </CardContent>
  </Card>
);

const BusinessDataTab: React.FC = () => {
  // Data for the Level chart
  const levelData = [
    { name: 'M', volume: 60, service: 40 },
    { name: 'T', volume: 80, service: 50 },
    { name: 'W', volume: 50, service: 30 },
    { name: 'T', volume: 70, service: 40 },
    { name: 'F', volume: 40, service: 25 },
    { name: 'S', volume: 30, service: 20 },
    { name: 'S', volume: 25, service: 15 },
  ];

  // Data for the Visitor Insights chart
  const visitorData = [
    { name: 'Jan', visitors: 100 },
    { name: 'Feb', visitors: 120 },
    { name: 'Mar', visitors: 140 },
    { name: 'Apr', visitors: 400 },
    { name: 'May', visitors: 300 },
    { name: 'Jun', visitors: 250 },
    { name: 'Jul', visitors: 350 },
    { name: 'Aug', visitors: 400 },
    { name: 'Sep', visitors: 350 },
    { name: 'Oct', visitors: 300 },
    { name: 'Nov', visitors: 200 },
    { name: 'Dec', visitors: 250 },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard value="90" title="Total Campaigns" />
        <MetricCard value="90" title="Avg Likes" />
        <MetricCard value="90" title="Engagement" />
        <MetricCard value="90" title="Avg Comments" />
        <MetricCard value="90" title="Avg Shares" />
        <MetricCard value="90" title="Impressions" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Level Chart */}
        <Card className="bg-gray-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-4">Level</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" name="Volume" fill="#000" />
                  <Bar dataKey="service" name="Service" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center items-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-black"></div>
                <span className="text-sm">Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-sm">Service</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Card */}
        <Card className="bg-gray-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-4">Earnings</h3>
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="text-3xl font-bold text-blue-600">$6078.76</p>
              <p className="text-xs text-gray-500 mt-2">
                Profit is 48% More than last Month
              </p>
            </div>
            
            <div className="mt-4 relative h-24 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 50" className="w-full">
                  {/* Background arc */}
                  <path
                    d="M 0,50 A 50,50 0 0,1 100,50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  {/* Foreground arc (80% filled) */}
                  <path
                    d="M 0,50 A 50,50 0 0,1 80,50"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="10"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                  80%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitor Insights */}
      <Card className="bg-gray-100">
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-4">Visitor Insights</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visitorData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#4f46e5"
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDataTab;
