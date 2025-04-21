import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Eye, MessageSquare, Share2, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

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
  price?: number;
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

const PriceContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={item.image} 
          alt="Content" 
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-2">
        <div className="flex justify-between mb-2">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm">{formatNumber(item.stats.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{formatNumber(item.stats.comments)}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span className="text-sm">${item.price}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <path d="M13 8H7"/>
              <path d="M13 12H7"/>
            </svg>
            <span className="text-sm">{formatNumber(10)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ProfileContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [platform, setPlatform] = useState('instagram');
  const [selectedPackage, setSelectedPackage] = useState('platform');
  const navigate = useNavigate();

  const serviceContent: ContentItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 50, shares: 10 }
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 50, shares: 10 }
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 50, shares: 10 }
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      stats: { likes: 200, views: 500, comments: 50, shares: 10 }
    },
  ];
  
  const platformServices = [
    { id: 'post', name: 'Post Image', price: '499₹' },
    { id: 'reel', name: 'Reel', price: '499₹' },
    { id: 'story', name: 'Story (Image/Video)', price: '499₹' },
    { id: 'shorts', name: 'Shorts', price: '499₹' },
    { id: 'videos', name: 'Videos (>10m)', price: '499₹' },
    { id: 'polls', name: 'Polls', price: '499₹' },
  ];
  
  const comboPackages = [
    { 
      id: 'package1', 
      name: 'Packagename-1', 
      platforms: 'Insta/FB/Youtube',
      price: '499₹',
      rating: 5
    },
    { 
      id: 'package2', 
      name: 'Packagename-2', 
      platforms: 'Insta/FB/Youtube',
      price: '499₹',
      rating: 0
    },
    { 
      id: 'package3', 
      name: 'Packagename-3', 
      platforms: 'Insta/FB/Youtube',
      price: '499₹',
      rating: 0
    },
  ];

  const handleBook = () => {
    console.log('Booking service for package:', selectedPackage);
    navigate('/orders/place');
  };

  return (
    <Tabs defaultValue="services" className="w-full mt-6" onValueChange={setActiveTab}>
      <div className="flex justify-center mb-6">
        <TabsList className="grid grid-cols-3 w-2/3">
          <TabsTrigger value="services" className="text-sm">Services</TabsTrigger>
          <TabsTrigger value="prices" className="text-sm">Prices</TabsTrigger>
          <TabsTrigger value="data" className="text-sm">Data</TabsTrigger>
        </TabsList>
      </div>
      <div className="mt-2">
        <TabsContent value="services" className="mt-0 grid grid-cols-2 gap-4">
          {serviceContent.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </TabsContent>
        
        <TabsContent value="prices" className="mt-0">
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <Tabs defaultValue="platform" className="w-full" onValueChange={setSelectedPackage}>
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                  <TabsTrigger value="platform" className="text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        1
                      </div>
                      Platform Based
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="combo" className="text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        2
                      </div>
                      Combo Package
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-4">
                  <TabsContent value="platform" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-medium text-sm">Select Platform</div>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        {platformServices.map((service) => (
                          <div key={service.id} className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-2">
                              <Checkbox id={service.id} />
                              <label htmlFor={service.id} className="text-sm font-medium">
                                {service.name}
                              </label>
                            </div>
                            <div className="text-sm font-semibold">{service.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="combo" className="mt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        {comboPackages.map((pkg) => (
                          <div key={pkg.id} className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-2">
                              <Checkbox id={pkg.id} />
                              <div>
                                <label htmlFor={pkg.id} className="text-sm font-medium block">
                                  {pkg.name}
                                </label>
                                <span className="text-xs text-gray-500">{pkg.platforms}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-sm font-semibold">{pkg.price}</div>
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>
                                    {i < pkg.rating ? "★" : ""}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            
            <div className="flex justify-center">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-10"
                onClick={handleBook}
              >
                Book
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-0">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <div className="text-3xl font-bold">90</div>
                <div className="text-xs text-gray-500">Total Campaigns</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <div className="text-3xl font-bold">90</div>
                <div className="text-xs text-gray-500">Avg Likes</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <div className="text-3xl font-bold">90</div>
                <div className="text-xs text-gray-500">Engagement</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <div className="text-3xl font-bold">90</div>
                <div className="text-xs text-gray-500">Avg Comments</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <div className="text-3xl font-bold">90</div>
                <div className="text-xs text-gray-500">Avg Shares</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <div className="text-3xl font-bold">90</div>
                <div className="text-xs text-gray-500">Fake Followers</div>
              </div>
            </div>
            
            <div className="mt-8 space-y-1">
              <h3 className="font-medium text-lg">Price Range</h3>
              <div className="flex items-center gap-1">
                <div className="text-sm font-semibold">$2000</div>
                <div className="flex-1 h-12 flex items-end gap-0.5">
                  {[3, 5, 8, 12, 16, 20, 22, 18, 14, 10, 7, 4, 2].map((height, i) => (
                    <div 
                      key={i} 
                      className="bg-blue-500 w-full rounded-sm"
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>
                <div className="text-sm font-semibold">$3500</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="h-40 flex items-end">
                <div className="w-full h-full bg-gray-100 rounded-md flex justify-around items-end p-4">
                  <div className="h-28 w-10 bg-blue-500 rounded-t-md"></div>
                  <div className="h-20 w-10 bg-gray-300 rounded-t-md"></div>
                  <div className="h-24 w-10 bg-gray-300 rounded-t-md"></div>
                  <div className="h-16 w-10 bg-gray-300 rounded-t-md"></div>
                  <div className="h-12 w-10 bg-gray-300 rounded-t-md"></div>
                </div>
              </div>
              
              <div className="h-40">
                <div className="w-full h-full bg-gray-100 rounded-md p-4 flex items-end">
                  <svg viewBox="0 0 400 100" className="w-full">
                    <path 
                      d="M 0,90 C 40,80 60,40 100,40 C 140,30 180,35 220,20 C 260,15 300,10 400,5" 
                      fill="none" 
                      stroke="rgb(59, 130, 246)" 
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="40" r="3" fill="rgb(59, 130, 246)" />
                    <circle cx="220" cy="20" r="3" fill="rgb(59, 130, 246)" />
                    <circle cx="400" cy="5" r="3" fill="rgb(59, 130, 246)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProfileContent;
