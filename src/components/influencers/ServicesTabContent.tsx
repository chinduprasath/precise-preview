import React from 'react';
import { Heart, Eye, MessageSquare, Share2, Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import { useServiceContent } from '@/hooks/useServiceContent';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { ServiceContentItem } from './utils/serviceContentUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface ServicesTabContentProps {
  influencerId?: string;
  influencerName?: string;
}

const ContentCard = ({ item }: { item: ServiceContentItem }) => {
  const renderMedia = () => {
    if (item.media_type === 'video') {
      return (
        <div className="relative w-full h-40 bg-black flex items-center justify-center">
          <img
            src={item.media_url} // Assuming media_url can be a video thumbnail
            alt={item.title || "Video Content"}
            className="w-full h-full object-cover opacity-70"
          />
          <Youtube className="absolute h-12 w-12 text-red-500" />
        </div>
      );
    } else if (item.media_type === 'poll') {
      return (
        <div className="relative w-full h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          <span className="z-10">Poll</span>
          <img
            src={item.media_url} // Using media_url as a background for the poll
            alt={item.title || "Poll Content"}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>
      );
    } else {
      return (
        <img
          src={item.media_url}
          alt={item.title || "Content"}
          className="w-full h-40 object-cover"
        />
      );
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram key="instagram" className="h-4 w-4 text-social-instagram" />;
      case 'facebook': return <Facebook key="facebook" className="h-4 w-4 text-social-facebook" />;
      case 'youtube': return <Youtube key="youtube" className="h-4 w-4 text-social-youtube" />;
      case 'twitter': return <Twitter key="twitter" className="h-4 w-4 text-social-twitter" />;
      default: return null;
    }
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="relative">
        {renderMedia()}
        <div className="absolute top-2 right-2 flex gap-1">
          {item.platforms.map(platform => getPlatformIcon(platform))}
        </div>
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
        : contentItems.map(item => <ContentCard key={item.id} item={item} />)
      }
    </div>
  );
};

export default ServicesTabContent;
