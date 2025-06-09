import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import MetricsSection from './MetricsSection';
import ContentMetricsSection from './ContentMetricsSection';
import TopPerformanceSection from './TopPerformanceSection';
import { useBusinessDashboardData } from '@/hooks/useBusinessDashboardData';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    dashboardData, 
    topPerformedOrders, 
    topInfluencers, 
    topBusinessUsers, 
    pendingOrders,
    handlePayRequest,
    handleViewOrder 
  } = useBusinessDashboardData();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ConditionalHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <DashboardHeader />
            
            {/* Main metrics */}
            <MetricsSection 
              isLoading={isLoading} 
              totalSpent={dashboardData.totalSpent}
              totalOrders={dashboardData.totalOrders}
              activeRequests={dashboardData.activeRequests}
              completedCampaigns={dashboardData.completedCampaigns}
              connectedInfluencers={dashboardData.connectedInfluencers}
              impactScore={dashboardData.impactScore}
            />
            
            {/* Content metrics */}
            <ContentMetricsSection 
              isLoading={isLoading}
              postStats={dashboardData.postStats}
            />
            
            {/* Performance sections */}
            <TopPerformanceSection 
              isLoading={isLoading}
              topPerformedOrders={topPerformedOrders}
              topInfluencers={topInfluencers}
              topBusinessUsers={topBusinessUsers}
              pendingOrders={pendingOrders}
              onViewOrder={handleViewOrder}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessDashboard;
