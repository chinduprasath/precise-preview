
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Eye, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [platform, setPlatform] = useState('instagram');

  // Mock data
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Based Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">•</div>
                <span className="font-medium">Platform Based</span>
                
                <div className="ml-auto">
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="h-8 text-xs min-w-[150px] bg-gray-100">
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2 ml-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="post" checked />
                    <label htmlFor="post" className="text-sm">Post Image</label>
                  </div>
                  <span className="font-semibold text-sm">499₹</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="reel" checked />
                    <label htmlFor="reel" className="text-sm">Reel</label>
                  </div>
                  <span className="font-semibold text-sm">499₹</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="story" checked />
                    <label htmlFor="story" className="text-sm">Story (Image/Video)</label>
                  </div>
                  <span className="font-semibold text-sm">499₹</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="shorts" checked />
                    <label htmlFor="shorts" className="text-sm">Shorts</label>
                  </div>
                  <span className="font-semibold text-sm">499₹</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="videos" checked />
                    <label htmlFor="videos" className="text-sm">Videos {'>'}10m</label>
                  </div>
                  <span className="font-semibold text-sm">499₹</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="polls" checked />
                    <label htmlFor="polls" className="text-sm">Polls</label>
                  </div>
                  <span className="font-semibold text-sm">499₹</span>
                </div>
              </div>
            </div>
            
            {/* Combo Package Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">•</div>
                <span className="font-medium">Combo Package</span>
              </div>
              
              <div className="space-y-2 ml-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="package1" checked />
                    <div>
                      <div className="text-sm">Packagename-1</div>
                      <div className="text-xs text-gray-500">Insta/FB/Youtube</div>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">*****</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="package2" checked />
                    <div>
                      <div className="text-sm">Packagename-2</div>
                      <div className="text-xs text-gray-500">Insta/FB/Youtube</div>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">499₹</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="package3" checked />
                    <div>
                      <div className="text-sm">Packagename-3</div>
                      <div className="text-xs text-gray-500">Insta/FB/Youtube</div>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">499₹</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button className="bg-blue-500 hover:bg-blue-600 w-48">Book</Button>
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
