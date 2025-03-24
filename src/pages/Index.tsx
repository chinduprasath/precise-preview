
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import FilterDropdown from '@/components/filters/FilterDropdown';
import RangeSlider from '@/components/filters/RangeSlider';
import HashtagInput from '@/components/filters/HashtagInput';
import InfluencerCard from '@/components/influencers/InfluencerCard';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileContent from '@/components/profile/ProfileContent';
import { Share2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  socialStats: Array<{
    platform: 'instagram' | 'facebook' | 'twitter' | 'youtube';
    count: number;
  }>;
}

const Index = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [engagementRange, setEngagementRange] = useState<[number, number]>([2, 10]);
  const [followerRange, setFollowerRange] = useState<[number, number]>([0, 52.5]);

  // Mock data for influencers
  const influencers: Influencer[] = [
    {
      id: '1',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=1',
      email: 'Username@gmail.com',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '2',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=2',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '3',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=3',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '4',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=4',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '5',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=5',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '6',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=6',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
  ];

  const handleInfluencerClick = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 animate-fade-in">
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Basic Filter</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Location</h3>
                        <div className="flex space-x-2">
                          <FilterDropdown
                            label=""
                            placeholder="Select Country"
                            className="flex-1"
                          />
                          <FilterDropdown
                            label=""
                            placeholder="Select State"
                            className="flex-1"
                          />
                          <FilterDropdown
                            label=""
                            placeholder="Select City"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Engagement Rate</h3>
                        <RangeSlider
                          label=""
                          min={0}
                          max={20}
                          value={engagementRange}
                          onChange={setEngagementRange}
                          formatValue={(v) => `${v}%`}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Content Type</h3>
                        <FilterDropdown
                          label=""
                          placeholder="Select Type"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Hashtags</h3>
                        <HashtagInput
                          label=""
                          tags={hashtags}
                          onChange={setHashtags}
                          placeholder="Enter Hashtags"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h2 className="text-lg font-medium mb-4">Audience Demographics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="grid grid-cols-3 gap-2">
                          <FilterDropdown
                            label="Niche"
                            placeholder="Select Niche"
                            className="col-span-1"
                          />
                          <div className="col-span-2">
                            <h3 className="text-sm font-medium mb-2">Follower Count</h3>
                            <RangeSlider
                              label=""
                              min={0}
                              max={100}
                              step={0.5}
                              value={followerRange}
                              onChange={setFollowerRange}
                              formatValue={(v) => v === 0 ? '0' : v === 100 ? '100M+' : `${v}K`}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Platform</h3>
                        <FilterDropdown
                          label=""
                          placeholder="Select Platform"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Price Range</h3>
                        <div className="flex space-x-2">
                          <FilterDropdown
                            label=""
                            placeholder="Min"
                            className="flex-1"
                          />
                          <FilterDropdown
                            label=""
                            placeholder="Max"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Location</h3>
                        <div className="flex space-x-2">
                          <FilterDropdown
                            label=""
                            placeholder="Select Country"
                            className="flex-1"
                          />
                          <FilterDropdown
                            label=""
                            placeholder="Select State"
                            className="flex-1"
                          />
                          <FilterDropdown
                            label=""
                            placeholder="Select City"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <FilterDropdown
                        label="Age"
                        placeholder="Select Age"
                      />
                      <FilterDropdown
                        label="Gender"
                        placeholder="Select Gender"
                      />
                      <FilterDropdown
                        label="Interests"
                        placeholder="Select Interests"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-4">
                      <h2 className="text-lg font-medium mb-4">Influencers</h2>
                      <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-3">
                          {influencers.map((influencer) => (
                            <InfluencerCard
                              key={influencer.id}
                              name={influencer.name}
                              avatar={influencer.avatar}
                              socialStats={influencer.socialStats}
                              onClick={() => handleInfluencerClick(influencer)}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="shadow-sm border-gray-200 h-full">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-medium mb-4">Profile</h2>
                      
                      {selectedInfluencer ? (
                        <div className="animate-scale-in">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16 border">
                                <img 
                                  src={selectedInfluencer.avatar} 
                                  alt={selectedInfluencer.name} 
                                  className="h-full w-full object-cover"
                                />
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">{selectedInfluencer.name}</h3>
                                <p className="text-gray-500 text-sm">{selectedInfluencer.email || `${selectedInfluencer.name.toLowerCase()}@gmail.com`}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Share2 className="h-4 w-4" />
                                Share
                              </Button>
                              <Button size="sm">Contact</Button>
                            </div>
                          </div>
                          
                          <ProfileStats stats={selectedInfluencer.socialStats} />
                          <ProfileContent />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[600px] text-gray-400">
                          <p>Select an influencer to view their profile</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
