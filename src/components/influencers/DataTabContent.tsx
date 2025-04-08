
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';

interface DataTabContentProps {
  influencerId?: string;
}

const MetricCard: React.FC<{ value: number | string; title: string; isLoading?: boolean }> = ({ value, title, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="bg-gray-100">
        <CardContent className="p-4 text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-1" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gray-100">
      <CardContent className="p-4 text-center">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs text-gray-500">{title}</div>
      </CardContent>
    </Card>
  );
};

const formatMonthName = (month: number): string => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[month - 1];
};

const DataTabContent: React.FC<DataTabContentProps> = ({ influencerId }) => {
  const { analytics, monthlyData, loading, error } = useAnalyticsData(influencerId);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error loading analytics data: {error}</p>
      </div>
    );
  }

  // Transform monthly data for charts
  const chartData = monthlyData.map(item => ({
    name: formatMonthName(item.month),
    likes: item.likes,
    views: item.views,
    comments: item.comments,
    shares: item.shares,
    engagement: item.engagement_rate,
    orders: item.orders,
    earnings: item.earnings
  }));

  // Format engagement rate
  const formatEngagementRate = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard 
          value={loading ? 0 : analytics?.total_campaigns || 0} 
          title="Total Campaigns" 
          isLoading={loading} 
        />
        <MetricCard 
          value={loading ? 0 : analytics?.avg_likes || 0} 
          title="Avg Likes" 
          isLoading={loading} 
        />
        <MetricCard 
          value={loading ? 0 : formatEngagementRate(analytics?.engagement_rate || 0)} 
          title="Engagement" 
          isLoading={loading} 
        />
        <MetricCard 
          value={loading ? 0 : analytics?.avg_comments || 0} 
          title="Avg Comments" 
          isLoading={loading} 
        />
        <MetricCard 
          value={loading ? 0 : analytics?.avg_shares || 0} 
          title="Avg Shares" 
          isLoading={loading} 
        />
        <MetricCard 
          value={loading ? 0 : `${analytics?.fake_followers_percent || 0}%`} 
          title="Fake Followers" 
          isLoading={loading} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <Card className="bg-gray-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-4">Engagement Rate</h3>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="h-48">
                <ChartContainer config={{ engagement: { color: "#4f46e5" } }}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      name="Engagement Rate"
                      stroke="#4f46e5" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earnings Card */}
        <Card className="bg-gray-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-4">Earnings</h3>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Earnings</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{monthlyData.reduce((sum, item) => sum + item.earnings, 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {monthlyData.length > 0 && monthlyData[monthlyData.length - 1].earnings > monthlyData[monthlyData.length - 2]?.earnings
                      ? "Earnings are up from last month"
                      : "Earnings are down from last month"}
                  </p>
                </div>
                
                <div className="mt-2 h-24">
                  <ChartContainer config={{ earnings: { color: "#4f46e5" } }}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="earnings" name="Earnings" fill="#4f46e5" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Interactions Chart */}
      <Card className="bg-gray-100">
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-4">Content Interactions</h3>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64">
              <ChartContainer 
                config={{ 
                  likes: { color: "#4f46e5" },
                  comments: { color: "#22c55e" },
                  shares: { color: "#f59e0b" }
                }}
              >
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="likes"
                    name="Likes"
                    stroke="#4f46e5"
                    fillOpacity={1}
                    fill="url(#colorLikes)"
                  />
                  <Area
                    type="monotone"
                    dataKey="comments"
                    name="Comments"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorComments)"
                  />
                  <Area
                    type="monotone"
                    dataKey="shares"
                    name="Shares"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorShares)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTabContent;
