
import React from 'react';
import { Heart, Eye, MessageSquare, Share2 } from 'lucide-react';
import { useServiceContent } from '@/hooks/useServiceContent';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { ServiceContentItem } from './utils/serviceContentUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface ServicesTabContentProps {
  influencerId?: string;
}

const ContentCard = ({ item }: { item: ServiceContentItem }) => {
  return (
    <div className="overflow-hidden rounded-md group transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img 
          src={item.media_url} 
          alt={item.title || "Content"} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>
      <div className="px-3 flex flex-wrap justify-between text-sm text-gray-800 py-[10px] bg-slate-100">
        <div className="flex items-center gap-1 mb-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-xs">{formatNumber(item.metrics?.likes || 0)}</span>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <Eye className="w-4 h-4" />
          <span className="text-xs">{formatNumber(item.metrics?.views || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs">{formatNumber(item.metrics?.comments || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span className="text-xs">{formatNumber(item.metrics?.shares || 0)}</span>
        </div>
      </div>
    </div>
  );
};

const LoadingContentCard = () => {
  return (
    <div className="overflow-hidden rounded-md">
      <Skeleton className="w-full h-48" />
      <div className="px-3 flex flex-wrap justify-between text-sm text-gray-800 py-[10px] bg-slate-100">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
};

const ServicesTabContent: React.FC<ServicesTabContentProps> = ({ influencerId }) => {
  const { contentItems, loading, error } = useServiceContent(influencerId);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error loading content: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {loading
        ? Array(6).fill(0).map((_, index) => <LoadingContentCard key={`loading-${index}`} />)
        : contentItems.map(item => <ContentCard key={item.id} item={item} />)
      }
    </div>
  );
};

export default ServicesTabContent;
