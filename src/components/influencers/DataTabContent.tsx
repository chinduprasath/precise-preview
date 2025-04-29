
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatNumber } from '@/components/influencers/utils/formatUtils';

interface DataTabContentProps {
  influencerId?: string;
}

const MetricCard = ({ value, label }: { value: number | string; label: string }) => (
  <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
    <span className="text-3xl font-medium">{value}</span>
    <span className="text-sm text-gray-600 mt-1">{label}</span>
  </div>
);

const priceRangeData = [
  { price: 2000, count: 2 },
  { price: 2100, count: 3 },
  { price: 2200, count: 4 },
  { price: 2300, count: 5 },
  { price: 2400, count: 6 },
  { price: 2500, count: 7 },
  { price: 2600, count: 8 },
  { price: 2700, count: 7 },
  { price: 2800, count: 6 },
  { price: 2900, count: 5 },
  { price: 3000, count: 4 },
  { price: 3100, count: 3 },
  { price: 3200, count: 2 },
];

const weightData = [
  { month: 'Jan', yourWeight: 200, idealWeight: 220 },
  { month: 'Feb', yourWeight: 280, idealWeight: 220 },
  { month: 'Mar', yourWeight: 280, idealWeight: 220 },
  { month: 'Apr', yourWeight: 200, idealWeight: 220 },
  { month: 'May', yourWeight: 200, idealWeight: 220 },
  { month: 'Jun', yourWeight: 270, idealWeight: 220 },
  { month: 'Jul', yourWeight: 280, idealWeight: 220 },
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
  const { analytics, loading, error } = useAnalyticsData(influencerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error loading analytics data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard 
          value={analytics?.total_campaigns || 90} 
          label="Total Campaigns" 
        />
        <MetricCard 
          value={analytics?.avg_likes ? formatNumber(analytics.avg_likes) : "90"} 
          label="Avg Likes" 
        />
        <MetricCard 
          value={analytics?.engagement_rate ? `${analytics.engagement_rate}%` : "90"} 
          label="Engagement" 
        />
        <MetricCard 
          value={analytics?.avg_comments ? formatNumber(analytics.avg_comments) : "90"} 
          label="Avg Comments" 
        />
        <MetricCard 
          value={analytics?.avg_shares ? formatNumber(analytics.avg_shares) : "90"} 
          label="Avg Shares" 
        />
        <MetricCard 
          value={analytics?.fake_followers_percent ? `${analytics.fake_followers_percent}%` : "90"} 
          label="Fake Followers" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Range Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priceRangeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid vertical={false} stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="price" hide={true} />
              <YAxis hide={true} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full border border-gray-300 bg-white mr-1 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-600"></div>
              </div>
              <span>$2000</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full border border-gray-300 bg-white mr-1 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-600"></div>
              </div>
              <span>$3500</span>
            </div>
          </div>
        </Card>

        {/* Performance Comparison */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weightData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis hide={true} />
              <Tooltip />
              <Bar dataKey="idealWeight" fill="#93C5FD" name="Ideal Weight" />
              <Bar dataKey="yourWeight" fill="#4F46E5" name="Your Weight" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
              <span>Your Weight</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-200 mr-1"></div>
              <span>Ideal Weight</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Engagement Growth */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement Growth</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" hide={true} />
            <YAxis hide={true} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4F46E5" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DataTabContent;
