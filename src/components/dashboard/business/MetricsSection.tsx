import React from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import CampaignImpactCard from '@/components/dashboard/CampaignImpactCard';
import { FileText, BarChart2, Users } from 'lucide-react';

interface MetricsSectionProps {
  isLoading: boolean;
  totalSpent: number;
  totalOrders: number;
  activeRequests: number;
  completedCampaigns: number;
  connectedInfluencers: number;
  impactScore: number;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  isLoading,
  totalSpent,
  totalOrders,
  activeRequests,
  completedCampaigns,
  connectedInfluencers,
  impactScore
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CampaignImpactCard 
        score={impactScore}
        isLoading={isLoading}
      />
      
      <MetricCard 
        title="Total Orders" 
        value={isLoading ? "..." : totalOrders} 
        className="bg-card text-card-foreground border border-border"
        valueClassName="text-2xl font-bold"
      >
        <FileText className="h-6 w-6 text-primary" />
      </MetricCard>
      
      <MetricCard 
        title="Active/Total Campaigns" 
        value={isLoading ? "..." : `${activeRequests}/${completedCampaigns + activeRequests}`} 
        className="bg-card text-card-foreground border border-border"
        valueClassName="text-2xl font-bold"
      >
        <BarChart2 className="h-6 w-6 text-primary" />
      </MetricCard>
      
      <MetricCard 
        title="Connected Influencers" 
        value={isLoading ? "..." : connectedInfluencers} 
        className="bg-card text-card-foreground border border-border"
        valueClassName="text-2xl font-bold"
      >
        <Users className="h-6 w-6 text-primary" />
      </MetricCard>
    </div>
  );
};

export default MetricsSection;
