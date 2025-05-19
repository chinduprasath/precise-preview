
import React from 'react';
import TopPerformedOrders from '@/components/dashboard/TopPerformedOrders';
import TopUsers from '@/components/dashboard/TopUsers';
import PendingOrders from '@/components/dashboard/PendingOrders';

interface TopPerformanceSectionProps {
  isLoading: boolean;
  topPerformedOrders: any[];
  topInfluencers: any[];
  topBusinessUsers: any[];
  pendingOrders: any[];
  onViewOrder: (orderId: string) => void;
}

const TopPerformanceSection: React.FC<TopPerformanceSectionProps> = ({
  isLoading,
  topPerformedOrders,
  topInfluencers,
  topBusinessUsers,
  pendingOrders,
  onViewOrder
}) => {
  return (
    <>
      {/* Row 1 of our performance section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TopPerformedOrders orders={topPerformedOrders} isLoading={isLoading} />
        </div>
        
        <div>
          <TopUsers users={topInfluencers} title="Top Influencers" userType="influencer" isLoading={isLoading} />
        </div>
      </div>
      
      {/* Row 2 of our performance section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PendingOrders orders={pendingOrders} onViewOrder={onViewOrder} isLoading={isLoading} />
        </div>
        
        <div>
          <TopUsers users={topBusinessUsers} title="Top Business Users" userType="business" isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

export default TopPerformanceSection;
