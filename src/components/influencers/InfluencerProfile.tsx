
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Eye, MessageSquare, Share2, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { ServiceType, SocialPlatform, RequestPrice } from '@/types/request';

interface InfluencerProfileProps {
  id: string;
  name: string;
  category: string;
  bio: string;
  followers: number;
  engagementRate: number;
  profileImage: string;
  coverImage: string;
  onRequestService: (serviceData: {
    influencerId: string;
    influencerName: string;
    serviceType: ServiceType;
    platform: SocialPlatform;
    description: string;
    price: number;
  }) => void;
}

// Sample pricing data (in a real app, this would come from the backend)
const samplePricing: RequestPrice[] = [
  { serviceType: 'post', platform: 'instagram', price: 500 },
  { serviceType: 'story', platform: 'instagram', price: 300 },
  { serviceType: 'reel', platform: 'instagram', price: 800 },
  { serviceType: 'post', platform: 'facebook', price: 400 },
  { serviceType: 'video', platform: 'youtube', price: 1500 },
  { serviceType: 'short', platform: 'youtube', price: 700 },
  { serviceType: 'post', platform: 'twitter', price: 250 },
];

// Platform-based services for the prices tab
const platformServices = [
  { id: 'post', name: 'Post Image/Video', price: '499₹' },
  { id: 'reel', name: 'Reel', price: '499₹' },
  { id: 'story', name: 'Story (Image/Video)', price: '499₹' },
  { id: 'short', name: 'Short Video (<10m)', price: '499₹' },
  { id: 'video', name: 'Video (>10m)', price: '499₹' },
  { id: 'polls', name: 'Polls', price: '499₹' },
];

// Combo packages
const comboPackages = [
  { 
    id: 'package1', 
    name: 'Packagename-1', 
    platforms: 'Insta/FB/Youtube',
    price: '499₹'
  },
  { 
    id: 'package2', 
    name: 'Packagename-2', 
    platforms: 'Insta/FB/Youtube',
    price: '499₹'
  },
  { 
    id: 'package3', 
    name: 'Packagename-3', 
    platforms: 'Insta/FB/Youtube',
    price: '499₹'
  },
];

// Content items for the services tab
const serviceContent = [
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
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stats: { likes: 200, views: 500, comments: 50, shares: 10 }
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stats: { likes: 200, views: 500, comments: 50, shares: 10 }
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stats: { likes: 200, views: 500, comments: 50, shares: 10 }
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    stats: { likes: 200, views: 500, comments: 50, shares: 10 }
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

const ContentCard = ({ item }: { item: any }) => {
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

const InfluencerProfile: React.FC<InfluencerProfileProps> = ({
  id,
  name,
  category,
  bio,
  followers,
  engagementRate,
  profileImage,
  coverImage,
  onRequestService
}) => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<ServiceType>('post');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [selectedPackage, setSelectedPackage] = useState('platform');
  const [description, setDescription] = useState('');

  const getPrice = (serviceType: ServiceType, platform: SocialPlatform): number => {
    const pricing = samplePricing.find(p => p.serviceType === serviceType && p.platform === platform);
    return pricing ? pricing.price : 0;
  };

  const handleBook = () => {
    toast({
      title: "Service booked",
      description: `Your service request has been sent to ${name}`,
    });
  };

  const handleEditPrices = () => {
    toast({
      title: "Edit mode",
      description: "Editing prices functionality would be implemented here",
    });
  };

  return (
    <div className="container mx-auto py-4">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Influencer Details */}
            <div className="md:w-1/3">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img 
                    src={profileImage || "https://picsum.photos/200"} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{name}</h1>
                  <p className="text-gray-500 text-sm">{name.toLowerCase()}@gmail.com</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  </button>
                  <button className="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
              </div>

              {/* Social Platforms */}
              <div className="flex justify-between mb-6 mt-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                  <span className="text-sm font-semibold">1M</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </div>
                  <span className="text-sm font-semibold">235K</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                  </div>
                  <span className="text-sm font-semibold">98K</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </div>
                  <span className="text-sm font-semibold">2M</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <div className="text-xl font-bold">90</div>
                  <div className="text-xs text-gray-500">Total Campaigns</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <div className="text-xl font-bold">90</div>
                  <div className="text-xs text-gray-500">Avg Likes</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <div className="text-xl font-bold">90</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <div className="text-xl font-bold">90</div>
                  <div className="text-xs text-gray-500">Avg Comments</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <div className="text-xl font-bold">90</div>
                  <div className="text-xs text-gray-500">Avg Shares</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <div className="text-xl font-bold">90</div>
                  <div className="text-xs text-gray-500">Fake Followers</div>
                </div>
              </div>

              {/* Network Stats */}
              <div className="mt-4">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUp className="text-blue-500" />
                      <span className="font-medium">Upload</span>
                      <span className="ml-auto text-gray-700 font-medium">5,03 mbps</span>
                    </div>
                    <div className="h-16 bg-gray-50 rounded-lg mb-4 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 25">
                          <path d="M0,15 Q10,10 20,15 T40,10 T60,20 T80,5 T100,15" fill="none" stroke="#3b82f6" strokeWidth="2"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDown className="text-blue-300" />
                      <span className="font-medium">Download</span>
                      <span className="ml-auto text-gray-700 font-medium">14,34 mbps</span>
                    </div>
                    <div className="h-16 bg-gray-50 rounded-lg mb-4 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 25">
                          <path d="M0,10 Q10,20 20,5 T40,15 T60,5 T80,20 T100,10" fill="none" stroke="#93c5fd" strokeWidth="2"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="text-green-500" />
                      <span className="font-medium">Ping</span>
                      <span className="ml-auto text-gray-700 font-medium">10 ms</span>
                    </div>
                    <div className="h-16 bg-gray-50 rounded-lg overflow-hidden relative">
                      <div className="absolute inset-0 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 25">
                          <path d="M0,15 Q10,10 20,15 T40,10 T60,15 T80,5 T100,10" fill="none" stroke="#22c55e" strokeWidth="2"></path>
                          <path d="M0,15 Q10,10 20,15 T40,10 T60,15 T80,5 T100,10" fill="rgb(240, 253, 244, 0.5)"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Tabs */}
            <div className="md:w-2/3">
              <Tabs defaultValue="services" className="w-full">
                <div className="border-b mb-6">
                  <TabsList className="w-full flex justify-between bg-transparent p-0">
                    <TabsTrigger 
                      value="services" 
                      className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                    >
                      Services
                    </TabsTrigger>
                    <TabsTrigger 
                      value="prices" 
                      className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                    >
                      Prices
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="services" className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {serviceContent.map(item => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="prices" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                        </div>
                        <span className="font-medium">Platform Based</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Select defaultValue="instagram">
                          <SelectTrigger className="w-[180px] h-9 text-sm">
                            <SelectValue placeholder="Select Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          onClick={handleEditPrices}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {platformServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between py-2 border-b">
                          <div className="flex items-center gap-2">
                            <Checkbox id={service.id} defaultChecked />
                            <label htmlFor={service.id} className="text-sm font-medium">
                              {service.name}
                            </label>
                          </div>
                          <div className="text-sm font-semibold">{service.price}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="py-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                        </div>
                        <span className="font-medium">Combo Package</span>
                      </div>
                      
                      <div className="space-y-4">
                        {comboPackages.map((pkg) => (
                          <div key={pkg.id} className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-2">
                              <Checkbox id={pkg.id} defaultChecked />
                              <div>
                                <label htmlFor={pkg.id} className="text-sm font-medium block">
                                  {pkg.name}
                                </label>
                                <span className="text-xs text-gray-500">{pkg.platforms}</span>
                              </div>
                            </div>
                            <div className="text-sm font-semibold">{pkg.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center pt-4">
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-12"
                        onClick={handleBook}
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;

