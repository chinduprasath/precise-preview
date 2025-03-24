
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Eye, MessageSquare, Share2 } from 'lucide-react';

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
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
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

const ProfileContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');

  // Mock data
  const serviceContent: ContentItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 500, shares: 10 }
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 500, shares: 10 }
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 500, shares: 10 }
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 500, shares: 10 }
    },
  ];

  const pricesContent: ContentItem[] = [
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 500, shares: 10 }
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 500, shares: 10 }
    },
  ];

  const dataContent: ContentItem[] = [
    {
      id: '7',
      image: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 500, shares: 10 }
    },
    {
      id: '8',
      image: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 500, shares: 10 }
    },
  ];

  return (
    <Tabs defaultValue="services" className="w-full mt-6" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="services" className="text-sm">Services</TabsTrigger>
        <TabsTrigger value="prices" className="text-sm">Prices</TabsTrigger>
        <TabsTrigger value="data" className="text-sm">Data</TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="services" className="mt-0 grid grid-cols-2 gap-4">
          {serviceContent.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </TabsContent>
        <TabsContent value="prices" className="mt-0 grid grid-cols-2 gap-4">
          {pricesContent.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </TabsContent>
        <TabsContent value="data" className="mt-0 grid grid-cols-2 gap-4">
          {dataContent.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProfileContent;
