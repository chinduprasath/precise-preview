import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import OrderSelector from '@/components/reach/OrderSelector';
import PlatformMetricCard from '@/components/reach/PlatformMetricCard';
import CampaignMetrics from '@/components/reach/CampaignMetrics';
import EngagementChart from '@/components/reach/EngagementChart';
import ReachChart from '@/components/reach/ReachChart';
import PerformanceMetrics from '@/components/reach/PerformanceMetrics';
import DemographicChart from '@/components/reach/DemographicChart';
import ReachViewsChart from '@/components/reach/ReachViewsChart';
import SegmentedDonutChart from '@/components/reach/SegmentedDonutChart';
import { 
  mockOrders, 
  platformEngagementData, 
  platformReachData, 
  conversionData, 
  demographicData, 
  performanceData,
  reachViewsData,
  analyticsData,
  getOrderMetrics 
} from '@/data/reachData';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock } from 'lucide-react';
import { addDays, subDays, subHours } from 'date-fns';

const ReachPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<string>("1");
  const [timeRange, setTimeRange] = useState<string>('last_24_hours');

  const calculateDates = (range: string) => {
    const now = new Date();
    let start = now;
    let end = now;

    switch (range) {
      case 'last_24_hours':
        start = subHours(now, 24);
        break;
      case 'last_7_days':
        start = subDays(now, 7);
        break;
      case 'last_30_days':
        start = subDays(now, 30);
        break;
      default:
        break;
    }
    return { startDate: start, endDate: end };
  };

  const { startDate, endDate } = calculateDates(timeRange);
  
  const currentOrder = mockOrders.find(order => order.id === selectedOrder) || mockOrders[0];
  
  const orderMetrics = getOrderMetrics(selectedOrder);
  const currentEngagementData = platformEngagementData[selectedOrder as keyof typeof platformEngagementData] || platformEngagementData['1'];
  const currentReachData = platformReachData[selectedOrder as keyof typeof platformReachData] || platformReachData['1'];
  const currentConversionData = conversionData[selectedOrder as keyof typeof conversionData] || conversionData['1'];
  const currentDemographicData = demographicData[selectedOrder as keyof typeof demographicData] || demographicData['1'];
  const currentPerformanceData = performanceData[selectedOrder as keyof typeof performanceData] || performanceData['1'];
  const currentReachViewsData = reachViewsData[selectedOrder as keyof typeof reachViewsData] || reachViewsData['1'];
  const currentAnalyticsData = analyticsData[selectedOrder as keyof typeof analyticsData] || analyticsData['1'];

  const timeRangeOptions = [
    { value: 'last_24_hours', label: 'Last 24 hours', disabled: false },
    { value: 'last_7_days', label: 'Last 7 days', disabled: false },
    { value: 'last_30_days', label: 'Last 30 days', disabled: false },
    { value: 'last_3_months', label: 'Last 3 months', disabled: true },
    { value: 'last_6_months', label: 'Last 6 months', disabled: true },
    { value: 'last_12_months', label: 'Last 12 months', disabled: true },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <OrderSelector 
                  orders={mockOrders} 
                  selectedOrderId={selectedOrder} 
                  onOrderSelect={setSelectedOrder} 
                  className="w-full"
                />
              </div>
              <div className="flex justify-end">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value} 
                        disabled={option.disabled}
                        className={option.disabled ? "text-gray-400 cursor-not-allowed flex items-center justify-between w-full" : "flex items-center justify-between w-full"}
                      >
                        <div className="flex items-center gap-1">
                          <span>{option.label}</span>
                          {option.disabled && <Lock className="h-4 w-4 flex-shrink-0" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* First row of metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <PlatformMetricCard 
                platform="instagram" 
                title="Total No of Posts" 
                value={formatNumber(orderMetrics.totalPosts)} 
                change={{ value: 15.2, isPositive: true }} // Placeholder change
              />
              <PlatformMetricCard 
                platform="instagram" 
                title="Total Views" 
                value={formatNumber(12500)} 
                change={{ value: 15.2, isPositive: true }} 
              />
              <PlatformMetricCard 
                platform="facebook" 
                title="Engagement Rate" 
                value={`${orderMetrics.engagementRate}%`} 
                change={{ value: 8.5, isPositive: true }} 
              />
              <PlatformMetricCard 
                platform="twitter" 
                title="Reach" 
                value={formatNumber(orderMetrics.reach)} 
                change={{ value: 0.1, isPositive: true }} 
              />
            </div>

            {/* Second row of metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <PlatformMetricCard 
                platform="youtube" 
                title="Impressions" 
                value={formatNumber(orderMetrics.impressions)} 
                change={{ value: 0.3, isPositive: true }} 
              />
              <PlatformMetricCard 
                platform="facebook" 
                title="Link Clicks" 
                value={formatNumber(15800)} 
                change={{ value: 8.5, isPositive: true }} 
              />
              <PlatformMetricCard 
                platform="cpe" 
                title="CPE" 
                value={formatNumber(currentPerformanceData.find(item => item.label === 'Cost per Acquisition')?.percentage || 0)} 
                change={{ value: 0.1, isPositive: true }} 
              />
              <PlatformMetricCard 
                platform="cpm" 
                title="CPM" 
                value={formatNumber(currentPerformanceData.find(item => item.label === 'CTR')?.percentage || 0)} 
                change={{ value: 0.3, isPositive: true }} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <EngagementChart 
                data={currentEngagementData}
                title="Platform Engagement Comparison"
                dataKeys={[
                  { key: 'instagram', name: 'Instagram' },
                  { key: 'facebook', name: 'Facebook' },
                  { key: 'twitter', name: 'Twitter' },
                  { key: 'youtube', name: 'YouTube' }
                ]}
              />
              <ReachChart 
                data={currentReachData}
                dataKeys={[
                  { key: 'instagram_reach', name: 'Instagram' },
                  { key: 'facebook_reach', name: 'Facebook' },
                  { key: 'twitter_reach', name: 'Twitter' },
                  { key: 'youtube_reach', name: 'YouTube' }
                ]}
              />
            </div>

            {/* Adjusted layout for Demographic and Analytics charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-1">
                <DemographicChart data={currentDemographicData} />
              </div>
              <div className="md:col-span-2">
                <SegmentedDonutChart 
                  data={currentAnalyticsData}
                  title="Paid vs Organic Analytics"
                />
              </div>
            </div>

            {/* Adjusted layout for Clicks, Performance, and Reach & Views charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReachViewsChart 
                data={currentReachViewsData}
                title="Reach vs Views Analysis"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EngagementChart 
                  data={currentConversionData}
                  title="Clicks"
                  dataKeys={[
                    { key: 'clicks', name: 'Clicks' }
                  ]}
                />
                <PerformanceMetrics metrics={{ 
                  cpe: currentPerformanceData.find(item => item.label === 'Cost per Acquisition')?.percentage || 0,
                  cpm: currentPerformanceData.find(item => item.label === 'CTR')?.percentage || 0
                }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReachPage;
