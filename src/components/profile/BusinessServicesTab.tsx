import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Eye, MessageSquare, Share2, Instagram, Youtube, Facebook } from 'lucide-react';

interface ContentStat {
  likes: number;
  views: number;
  comments: number;
  shares: number;
}

interface ContentItem {
  id: string;
  image: string;
  stats: ContentStat;
  platforms: string[];
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

// Helper function to get platform icon component
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="w-4 h-4 text-white" />;
    case 'youtube':
      return <Youtube className="w-4 h-4 text-white" />;
    case 'facebook':
      return <Facebook className="w-4 h-4 text-white" />;
    default:
      return null;
  }
};

const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img 
          src={item.image} 
          alt="Content" 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {item.platforms.map((platform) => (
            <div key={platform} className="bg-black/50 p-1 rounded-full">
              {getPlatformIcon(platform)}
            </div>
          ))}
        </div>
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
      <div className="p-3 flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span>{formatNumber(item.stats.likes)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>{formatNumber(item.stats.comments)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span>{formatNumber(item.stats.shares)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{formatNumber(item.stats.views)}</span>
        </div>
      </div>
    </Card>
  );
};

const BusinessServicesTab: React.FC = () => {
  // Sample services data
  const services: ContentItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 50, shares: 10 },
      platforms: ['instagram', 'facebook']
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 350, views: 900, comments: 70, shares: 30 },
      platforms: ['youtube']
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 180, views: 450, comments: 40, shares: 15 },
      platforms: ['instagram']
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 220, views: 600, comments: 55, shares: 20 },
      platforms: ['facebook', 'youtube']
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 280, views: 700, comments: 60, shares: 25 },
      platforms: ['instagram', 'youtube']
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 320, views: 800, comments: 75, shares: 35 },
      platforms: ['facebook']
    },
    {
      id: '7',
      image: 'https://images.unsplash.com/photo-1526723038265-2aa70b0c0681?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 190, views: 480, comments: 45, shares: 18 },
      platforms: ['instagram']
    },
    {
      id: '8',
      image: 'https://images.unsplash.com/photo-1522201949034-507737bce479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 240, views: 650, comments: 58, shares: 22 },
      platforms: ['youtube', 'instagram']
    },
    {
      id: '9',
      image: 'https://images.unsplash.com/photo-1520390376-c0a76d70d395?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 260, views: 680, comments: 62, shares: 28 },
      platforms: ['facebook', 'instagram']
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(item => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default BusinessServicesTab;
