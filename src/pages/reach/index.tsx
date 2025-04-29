
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { ArrowUp, ArrowDown } from 'lucide-react';
import OrderSelector from '@/components/reach/OrderSelector';
import PlatformMetricCard from '@/components/reach/PlatformMetricCard';
import CampaignMetrics from '@/components/reach/CampaignMetrics';
import EngagementChart from '@/components/reach/EngagementChart';
import ReachChart from '@/components/reach/ReachChart';
import PerformanceMetrics from '@/components/reach/PerformanceMetrics';
import DemographicChart from '@/components/reach/DemographicChart';
import { 
  mockOrders, 
  platformEngagementData, 
  platformReachData, 
  conversionData, 
  demographicData, 
  performanceData,
  getOrderMetrics 
} from '@/data/reachData';
import { formatNumber } from '@/components/influencers/utils/formatUtils';

const ReachPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<string>("1");
  const currentOrder = mockOrders.find(order => order.id === selectedOrder) || mockOrders[0];
  
  const orderMetrics = getOrderMetrics(selectedOrder);
  const currentEngagementData = platformEngagementData[selectedOrder as keyof typeof platformEngagementData] || platformEngagementData['1'];
  const currentReachData = platformReachData[selectedOrder as keyof typeof platformReachData] || platformReachData['1'];
  const currentConversionData = conversionData[selectedOrder as keyof typeof conversionData] || conversionData['1'];
  const currentDemographicData = demographicData[selectedOrder as keyof typeof demographicData] || demographicData['1'];
  const currentPerformanceData = performanceData[selectedOrder as keyof typeof performanceData] || performanceData['1'];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-6">
              <OrderSelector 
                orders={mockOrders} 
                selectedOrderId={selectedOrder} 
                onOrderSelect={setSelectedOrder} 
              />
            </div>
            
            <CampaignMetrics 
              campaignValue={currentOrder.value} 
              campaignGoal={200000} 
              metrics={orderMetrics}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <PlatformMetricCard 
                platform="instagram" 
                title="Instagram Engagement" 
                value={formatNumber(12500)} 
                change={{ value: 15.2, isPositive: true }} 
              />
              <PlatformMetricCard 
                platform="facebook" 
                title="Facebook Reach" 
                value={formatNumber(15800)} 
                change={{ value: 8.5, isPositive: true }} 
              />
              <PlatformMetricCard 
                platform="twitter" 
                title="Twitter Impressions" 
                value={formatNumber(7200)} 
                change={{ value: 4.2, isPositive: true }} 
              />
              <PlatformMetricCard 
                platform="youtube" 
                title="YouTube Views" 
                value={formatNumber(4500)} 
                change={{ value: 12.8, isPositive: true }} 
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EngagementChart 
                data={currentConversionData}
                title="Clicks & Conversions"
                dataKeys={[
                  { key: 'clicks', name: 'Clicks' },
                  { key: 'conversions', name: 'Conversions' }
                ]}
              />
              <DemographicChart data={currentDemographicData} />
              <PerformanceMetrics metrics={currentPerformanceData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReachPage;
