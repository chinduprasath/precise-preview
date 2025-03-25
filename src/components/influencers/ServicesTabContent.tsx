
import React from 'react';
import { Heart, Eye, MessageSquare, Share2 } from 'lucide-react';
import { formatNumber } from '@/components/influencers/utils/formatUtils';

interface ContentItem {
  id: string;
  image: string;
  stats: {
    likes: number;
    views: number;
    comments: number;
    shares: number;
  };
}

interface ServicesTabContentProps {
  serviceContent: ContentItem[];
}

const ContentCard = ({ item }: { item: ContentItem }) => {
  return (
    <div className="overflow-hidden rounded-md group transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img 
          src={item.image} 
          alt="Content" 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-3 w-full">
            <div className="flex justify-between text-white">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs">{formatNumber(item.stats.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs">{formatNumber(item.stats.views)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 flex justify-between text-sm text-gray-500 bg-white">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-xs">{formatNumber(item.stats.likes)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span className="text-xs">{formatNumber(item.stats.views)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs">{formatNumber(item.stats.comments)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span className="text-xs">{formatNumber(item.stats.shares)}</span>
        </div>
      </div>
    </div>
  );
};

const ServicesTabContent: React.FC<ServicesTabContentProps> = ({ serviceContent }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {serviceContent.map(item => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ServicesTabContent;
