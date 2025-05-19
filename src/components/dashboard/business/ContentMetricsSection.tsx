
import React from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import { FileText, Film, Video, PieChart } from 'lucide-react';

interface PostStats {
  total: number;
  reels: number;
  videos: number;
  shorts: number;
}

interface ContentMetricsSectionProps {
  isLoading: boolean;
  postStats: PostStats;
}

const ContentMetricsSection: React.FC<ContentMetricsSectionProps> = ({
  isLoading,
  postStats
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <MetricCard 
        title="Total Posts" 
        value={isLoading ? "..." : postStats.total} 
        className="bg-card text-card-foreground border border-border"
      >
        <FileText className="h-6 w-6 text-primary" />
      </MetricCard>
      
      <MetricCard 
        title="Reels" 
        value={isLoading ? "..." : postStats.reels} 
        className="bg-card text-card-foreground border border-border"
      >
        <Film className="h-6 w-6 text-primary" />
      </MetricCard>
      
      <MetricCard 
        title="Videos" 
        value={isLoading ? "..." : postStats.videos} 
        className="bg-card text-card-foreground border border-border"
      >
        <Video className="h-6 w-6 text-primary" />
      </MetricCard>
      
      <MetricCard 
        title="Shorts" 
        value={isLoading ? "..." : postStats.shorts} 
        className="bg-card text-card-foreground border border-border"
      >
        <PieChart className="h-6 w-6 text-primary" />
      </MetricCard>
    </div>
  );
};

export default ContentMetricsSection;
