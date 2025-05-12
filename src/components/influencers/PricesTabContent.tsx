
import React from 'react';
import PricingDashboard from './PricingDashboard';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
}

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  influencerId,
  influencerName,
}) => {
  return (
    <div className="space-y-8">
      <PricingDashboard influencerId={influencerId} />
    </div>
  );
};

export default PricesTabContent;
