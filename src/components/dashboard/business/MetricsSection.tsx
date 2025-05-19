
import React from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import { BadgeIndianRupee, FileText, BarChart2, Users } from 'lucide-react';

interface MetricsSectionProps {
  isLoading: boolean;
  totalSpent: number;
  totalOrders: number;
  activeRequests: number;
  completedCampaigns: number;
  connectedInfluencers: number;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  isLoading,
  totalSpent,
  totalOrders,
  activeRequests,
  completedCampaigns,
  connectedInfluencers
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <MetricCard 
        title="Amount Spent (INR)" 
        value={isLoading ? "..." : `₹${totalSpent.toLocaleString('en-IN')}`} 
        className="bg-card text-card-foreground border border-border"
      >
        <BadgeIndianRupee className="h-6 w-6 text-primary" />
      </MetricCard>
      
      <MetricCard 
        title="Total Orders" 
        value={isLoading ? "..." : totalOrders} 
        className="bg-card text-card-foreground border border-border"
      >
        <FileText className="h-6 w-6 text-primary" />
      </MetricCard>
      
      <MetricCard 
        title="Active/Total Campaigns" 
        value={isLoading ? "..." : `${activeRequests}/${completedCampaigns + activeRequests}`} 
        className="bg-card text-card-foreground border border-border"
      >
        <BarChart2 className="h-6 w-6 text-primary" />
      </MetricCard>
      
      <MetricCard 
        title="Connected Influencers" 
        value={isLoading ? "..." : connectedInfluencers} 
        className="bg-card text-card-foreground border border-border"
      >
        <Users className="h-6 w-6 text-primary" />
      </MetricCard>
    </div>
  );
};

export default MetricsSection;
