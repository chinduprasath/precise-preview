import React, { useState } from 'react';
import { Heart, Eye, MessageSquare, Share2, Youtube, Instagram, Facebook, Twitter, ChevronDown } from 'lucide-react';
import { useServiceContent } from '@/hooks/useServiceContent';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { ServiceContentItem } from './utils/serviceContentUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

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

  const renderPlatformIcons = (platforms: string[]) => {
    if (platforms.length === 0) return null;
    
    if (platforms.length === 1) {
      return (
        <div className="bg-white rounded-full p-1 shadow-sm">
          {getPlatformIcon(platforms[0])}
        </div>
      );
    }
    
    // Multiple platforms - create tablet shape
    return (
      <div className="bg-white rounded-full px-2 py-1 shadow-sm flex items-center gap-1">
        {platforms.map(platform => getPlatformIcon(platform))}
      </div>
    );
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="relative">
        {renderMedia()}
        <div className="absolute top-2 right-2">
          {renderPlatformIcons(item.platforms)}
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
  
  // Multi-select states
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  const platformOptions = [
    { id: 'all', name: 'All' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'twitter', name: 'Twitter' }
  ];

  const serviceOptions = [
    { id: 'post', name: 'Post Image/Video' },
    { id: 'reels', name: 'Reels/Shorts' },
    { id: 'story', name: 'Story (Image/Video)' },
    { id: 'in-video', name: 'In-Video Promotion (<10 min)' },
    { id: 'promotions', name: 'Promotions (>10 min)' },
    { id: 'polls', name: 'Polls' },
    { id: 'visit-promote', name: 'Visit & Promote' }
  ];
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error loading content: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Multi-select dropdowns */}
      <div className="flex justify-end gap-4">
        <div className="w-48">
          <Popover open={platformDropdownOpen} onOpenChange={setPlatformDropdownOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedPlatforms.length > 0 
                  ? `${selectedPlatforms.length} platform(s) selected`
                  : 'Select Platform'
                }
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                {platformOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 cursor-pointer"
                    onClick={() => {
                      if (option.id === 'all') {
                        setSelectedPlatforms(selectedPlatforms.length === platformOptions.length - 1 ? [] : platformOptions.slice(1).map(p => p.id));
                      } else {
                        if (selectedPlatforms.includes(option.id)) {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== option.id));
                        } else {
                          setSelectedPlatforms([...selectedPlatforms, option.id]);
                        }
                      }
                    }}
                  >
                    <Checkbox
                      checked={selectedPlatforms.includes(option.id)}
                      onChange={() => {}}
                    />
                    <span className="text-sm font-medium">{option.name}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="w-48">
          <Popover open={serviceDropdownOpen} onOpenChange={setServiceDropdownOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedServices.length > 0 
                  ? `${selectedServices.length} service(s) selected`
                  : 'Select Service'
                }
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                {serviceOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 cursor-pointer"
                    onClick={() => {
                      if (selectedServices.includes(option.id)) {
                        setSelectedServices(selectedServices.filter(s => s !== option.id));
                      } else {
                        setSelectedServices([...selectedServices, option.id]);
                      }
                    }}
                  >
                    <Checkbox
                      checked={selectedServices.includes(option.id)}
                      onChange={() => {}}
                    />
                    <span className="text-sm font-medium">{option.name}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading
          ? Array(9).fill(0).map((_, index) => <LoadingContentCard key={`loading-${index}`} />)
          : contentItems.map(item => <ContentCard key={item.id} item={item} />)
        }
      </div>
    </div>
  );
};

export default ServicesTabContent;
