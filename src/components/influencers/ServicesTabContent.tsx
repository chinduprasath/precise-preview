
import React from 'react';
import { Heart, Eye, MessageSquare, Share2 } from 'lucide-react';
import { useServiceContent } from '@/hooks/useServiceContent';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { ServiceContentItem } from './utils/serviceContentUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface ServicesTabContentProps {
  influencerId?: string;
  influencerName?: string;
}

const ContentCard = ({ item }: { item: ServiceContentItem }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="relative">
        <img 
          src={item.media_url} 
          alt={item.title || "Content"} 
          className="w-full h-40 object-cover" 
        />
      </div>
      <div className="px-3 py-3 bg-slate-100 flex flex-wrap justify-between">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium">{formatNumber(item.metrics?.likes || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-medium">{formatNumber(item.metrics?.views || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-medium">{formatNumber(item.metrics?.comments || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span className="text-xs font-medium">{formatNumber(item.metrics?.shares || 0)}</span>
        </div>
      </div>
    </div>
  );
};

const LoadingContentCard = () => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm">
      <Skeleton className="w-full h-40" />
      <div className="px-3 py-3 bg-slate-100 flex flex-wrap justify-between">
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
  
  // Sample content items for demo if data is not available
  const demoContentItems: ServiceContentItem[] = [
    {
      id: '1',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2050&auto=format&fit=crop',
      media_type: 'image',
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
    {
      id: '2',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1561664089-8cc4201eba91?q=80&w=2070&auto=format&fit=crop',
      media_type: 'image',
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
    {
      id: '3',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1672262277543-322fa9898d0a?q=80&w=2070&auto=format&fit=crop',
      media_type: 'image',
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
    {
      id: '4',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1560463315-6b0914461698?q=80&w=2066&auto=format&fit=crop',
      media_type: 'image',
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
    {
      id: '5',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1974&auto=format&fit=crop',
      media_type: 'image',
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
    {
      id: '6',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=2076&auto=format&fit=crop',
      media_type: 'image', 
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
    {
      id: '7',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1513384312027-9fa69a360337?q=80&w=2071&auto=format&fit=crop',
      media_type: 'image',
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
    {
      id: '8',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080&auto=format&fit=crop', 
      media_type: 'image',
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
    {
      id: '9',
      influencer_id: influencerId || '',
      media_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1980&auto=format&fit=crop',
      media_type: 'image',
      metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
    },
  ];

  const displayItems = contentItems.length > 0 ? contentItems : demoContentItems;

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error loading content: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {loading
        ? Array(9).fill(0).map((_, index) => <LoadingContentCard key={`loading-${index}`} />)
        : displayItems.map(item => <ContentCard key={item.id} item={item} />)
      }
    </div>
  );
};

export default ServicesTabContent;
