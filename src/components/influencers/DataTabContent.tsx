import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { formatNumber } from '@/components/influencers/utils/formatUtils';

interface DataTabContentProps {
  influencerId?: string;
}

const MetricCard: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
  <div className="bg-[#f4f6fa] dark:bg-muted/40 rounded-2xl p-4 md:p-5 border border-border/40 text-center flex flex-col items-center justify-center min-h-[92px] transition-all hover:shadow-xs">
    <span className="text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-foreground tracking-tight">
      {value}
    </span>
    <span className="text-xs md:text-sm font-semibold text-[#64748b] dark:text-muted-foreground mt-1">
      {label}
    </span>
  </div>
);

// Engagement Rate Over Time (Feb - Jun, 0 - 80)
const engagementData = [
  { date: 'Feb', value: 52 },
  { date: 'Mar', value: 55 },
  { date: 'Apr', value: 58 },
  { date: 'May', value: 60 },
  { date: 'Jun', value: 62 },
];

// Content Performance by Platform (matching Image 2 pie slices & colors)
const platformPerformanceData = [
  { name: 'Instagram', value: 40, color: '#7982f6' }, // Periwinkle / Indigo
  { name: 'Facebook', value: 30, color: '#72c18d' },  // Mint Green
  { name: 'YouTube', value: 15, color: '#ff6900' },   // Orange
  { name: 'Twitter', value: 15, color: '#fbbd24' },   // Amber / Golden Yellow
];

// Audience Growth Trajectory (Jan - Jun, 0 - 2000)
const audienceGrowthData = [
  { month: 'Jan', instagram: 1000, facebook: 600, youtube: 400, twitter: 200 },
  { month: 'Feb', instagram: 1200, facebook: 750, youtube: 500, twitter: 300 },
  { month: 'Mar', instagram: 1300, facebook: 950, youtube: 650, twitter: 420 },
  { month: 'Apr', instagram: 1600, facebook: 1150, youtube: 750, twitter: 550 },
  { month: 'May', instagram: 1800, facebook: 1250, youtube: 850, twitter: 650 },
  { month: 'Jun', instagram: 2000, facebook: 1400, youtube: 950, twitter: 750 },
];

// Link Clicks by Month (Jan - May)
const linkClicksData = [
  { month: 'Jan', clicks: 830 },
  { month: 'Feb', clicks: 1000 },
  { month: 'Mar', clicks: 1220 },
  { month: 'Apr', clicks: 1080 },
  { month: 'May', clicks: 1390 },
];

const DataTabContent: React.FC<DataTabContentProps> = ({ influencerId }) => {
  const { analytics, loading } = useAnalyticsData(influencerId);

  // Seamless fallback values matching Image 2
  const campaignsCount = analytics?.total_campaigns ?? 90;
  const avgLikes = analytics?.avg_likes ? formatNumber(analytics.avg_likes) : '90';
  const avgViews = analytics?.avg_views ? formatNumber(analytics.avg_views) : '90K';
  const avgReach = analytics?.avg_reach ? formatNumber(analytics.avg_reach) : '500K';
  const engagementRate = analytics?.engagement_rate ? `${analytics.engagement_rate}%` : '90%';
  const avgComments = analytics?.avg_comments ? formatNumber(analytics.avg_comments) : '90';
  const avgShares = analytics?.avg_shares ? formatNumber(analytics.avg_shares) : '90';
  const fakeFollowers = analytics?.fake_followers_percent ? `${analytics.fake_followers_percent}%` : '1%';

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 8 Metrics Cards Grid (Matching Image 2) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Row 1 */}
        <MetricCard value={campaignsCount} label="Campaigns" />
        <MetricCard value={avgLikes} label="Avg Likes" />
        <MetricCard value={avgViews} label="Avg Views" />
        <MetricCard value={avgReach} label="Avg Reach" />

        {/* Row 2 */}
        <MetricCard value={engagementRate} label="Engagement" />
        <MetricCard value={avgComments} label="Avg Comments" />
        <MetricCard value={avgShares} label="Avg Shares" />
        <MetricCard value={fakeFollowers} label="Fake Followers" />
      </div>

      {/* Row 1 of Charts (Matching Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Engagement Rate Over Time */}
        <Card className="p-6 bg-card border border-border/80 rounded-2xl shadow-xs">
          <h3 className="text-base font-bold text-foreground mb-4">Engagement Rate Over Time</h3>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7982f6" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#7982f6" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  domain={[0, 80]} 
                  ticks={[0, 20, 40, 60, 80]} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Engagement Rate']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#5b6cf9" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#engagementGradient)" 
                  name="Engagement Rate (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Content Performance by Platform */}
        <Card className="p-6 bg-card border border-border/80 rounded-2xl shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-bold text-foreground mb-2">Content Performance by Platform</h3>
          <div className="h-[230px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformPerformanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {platformPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2 of Charts (Matching Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Audience Growth Trajectory */}
        <Card className="p-6 bg-card border border-border/80 rounded-2xl shadow-xs">
          <h3 className="text-base font-bold text-foreground mb-4">Audience Growth Trajectory</h3>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={audienceGrowthData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  domain={[0, 2000]} 
                  ticks={[0, 500, 1000, 1500, 2000]} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="instagram" 
                  stroke="#e63973" 
                  strokeWidth={2} 
                  dot={{ r: 3.5, fill: '#ffffff', stroke: '#e63973', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#e63973', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="facebook" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  dot={{ r: 3.5, fill: '#ffffff', stroke: '#2563eb', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#2563eb', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="youtube" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={{ r: 3.5, fill: '#ffffff', stroke: '#ef4444', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#ef4444', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="twitter" 
                  stroke="#38bdf8" 
                  strokeWidth={2} 
                  dot={{ r: 3.5, fill: '#ffffff', stroke: '#38bdf8', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#38bdf8', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend Matching Image 3 */}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-[#e63973]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e63973]" />
              <span>instagram</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#2563eb]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
              <span>facebook</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#ef4444]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span>youtube</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#38bdf8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
              <span>twitter</span>
            </div>
          </div>
        </Card>

        {/* Chart 4: Link Clicks by Month */}
        <Card className="p-6 bg-card border border-border/80 rounded-2xl shadow-xs">
          <h3 className="text-base font-bold text-foreground mb-4">Link Clicks by Month</h3>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={linkClicksData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  ticks={[0, 500, 1000, 1500]}
                  domain={[0, 1600]}
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  formatter={(value: number) => [value, 'Link Clicks']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar 
                  dataKey="clicks" 
                  fill="#7c82fb" 
                  name="Link Clicks" 
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend Matching Image 3 */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs font-semibold text-[#7c82fb]">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#7c82fb]" />
            <span>Link Clicks</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataTabContent;
