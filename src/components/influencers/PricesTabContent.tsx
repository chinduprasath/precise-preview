
import React from 'react';
import PricingDashboard from '@/components/pricing/PricingDashboard';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
}

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  influencerId,
  influencerName,
}) => {
  return (
    <div>
      <PricingDashboard influencerId={influencerId} />
    </div>
  );
};

export default PricesTabContent;
