
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatNumber } from './utils/formatUtils';
import { Influencer } from '@/types/location';

interface InfluencerProfileProps {
  influencer?: Influencer | null;
}

const InfluencerProfile: React.FC<InfluencerProfileProps> = ({ influencer }) => {
  const [activeTab, setActiveTab] = useState('services');

  if (!influencer) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-muted-foreground mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-muted-foreground mb-1">No Profile Selected</h3>
        <p className="text-muted-foreground">Please select an influencer profile to display their data</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-border">
          <img 
            src={influencer.image_url || 'https://via.placeholder.com/96'} 
            alt={influencer.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground mb-1">{influencer.name}</h2>
          <p className="text-muted-foreground">{influencer.bio || `Professional influencer specializing in ${influencer.niche?.name || 'various niches'}`}</p>
          
          {/* Social Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <SocialStat platform="instagram" count={influencer.followers_instagram} />
            <SocialStat platform="facebook" count={influencer.followers_facebook} />
            <SocialStat platform="youtube" count={influencer.followers_youtube} />
            <SocialStat platform="twitter" count={influencer.followers_twitter} />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
          <TabsTrigger 
            value="services"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
          >
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="prices"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
          >
            Prices
          </TabsTrigger>
          <TabsTrigger 
            value="data"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
          >
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <ServiceCard 
              title="Instagram Post"
              image="https://via.placeholder.com/300x200"
              stats={{ likes: 15000, comments: 280, shares: 120 }}
            />
            <ServiceCard 
              title="Story Highlight"
              image="https://via.placeholder.com/300x200"
              stats={{ likes: 12000, comments: 180, shares: 90 }}
            />
            <ServiceCard 
              title="Reel"
              image="https://via.placeholder.com/300x200"
              stats={{ likes: 25000, comments: 450, shares: 300 }}
            />
            <ServiceCard 
              title="IGTV"
              image="https://via.placeholder.com/300x200"
              stats={{ likes: 18000, comments: 320, shares: 150 }}
            />
          </div>
        </TabsContent>

        <TabsContent value="prices" className="mt-6">
          <div className="space-y-8">
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-4">Platform Based Pricing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-[#E4405F]" />
                    <span>Post Image/Video</span>
                  </div>
                  <span className="font-medium">499₹</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-[#E4405F]" />
                    <span>Reel</span>
                  </div>
                  <span className="font-medium">499₹</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-[#E4405F]" />
                    <span>Story (Image/Video)</span>
                  </div>
                  <span className="font-medium">499₹</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-[#FF0000]" />
                    <span>Short Video (&lt;10m)</span>
                  </div>
                  <span className="font-medium">499₹</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-[#FF0000]" />
                    <span>Video (&gt;10m)</span>
                  </div>
                  <span className="font-medium">499₹</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-4">Combo Packages</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <div className="font-medium">Packagename-1</div>
                    <div className="text-sm text-muted-foreground">Insta/FB/Youtube</div>
                  </div>
                  <span className="font-medium">499₹</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <div className="font-medium">Packagename-2</div>
                    <div className="text-sm text-muted-foreground">Insta/FB/Youtube</div>
                  </div>
                  <span className="font-medium">499₹</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">Packagename-3</div>
                    <div className="text-sm text-muted-foreground">Insta/FB/Youtube</div>
                  </div>
                  <span className="font-medium">499₹</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button className="px-8">Book Now</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-secondary p-4 rounded-md text-center">
                <div className="text-2xl font-bold">90</div>
                <div className="text-xs text-muted-foreground">Total Campaigns</div>
              </div>
              <div className="bg-secondary p-4 rounded-md text-center">
                <div className="text-2xl font-bold">90</div>
                <div className="text-xs text-muted-foreground">Avg Likes</div>
              </div>
              <div className="bg-secondary p-4 rounded-md text-center">
                <div className="text-2xl font-bold">90</div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
              <div className="bg-secondary p-4 rounded-md text-center">
                <div className="text-2xl font-bold">90</div>
                <div className="text-xs text-muted-foreground">Avg Comments</div>
              </div>
              <div className="bg-secondary p-4 rounded-md text-center">
                <div className="text-2xl font-bold">90</div>
                <div className="text-xs text-muted-foreground">Avg Shares</div>
              </div>
              <div className="bg-secondary p-4 rounded-md text-center">
                <div className="text-2xl font-bold">90</div>
                <div className="text-xs text-muted-foreground">Fake Followers</div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-4">Network Stats</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Upload</span>
                    <span className="text-sm font-medium">5.03 mbps</span>
                  </div>
                  <div className="h-12 bg-secondary/50 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 25">
                        <path d="M0,15 Q10,10 20,15 T40,10 T60,20 T80,5 T100,15" fill="none" stroke="rgb(99, 102, 241)" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Download</span>
                    <span className="text-sm font-medium">14.34 mbps</span>
                  </div>
                  <div className="h-12 bg-secondary/50 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 25">
                        <path d="M0,10 Q10,20 20,5 T40,15 T60,5 T80,20 T100,10" fill="none" stroke="rgb(59, 130, 246)" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Ping</span>
                    <span className="text-sm font-medium">10 ms</span>
                  </div>
                  <div className="h-12 bg-secondary/50 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 25">
                        <path d="M0,15 Q10,10 20,15 T40,10 T60,15 T80,5 T100,10" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SocialStat = ({ platform, count }) => {
  const icons = {
    instagram: { icon: Instagram, color: 'text-[#E4405F]' },
    facebook: { icon: Facebook, color: 'text-[#1877F2]' },
    youtube: { icon: Youtube, color: 'text-[#FF0000]' },
    twitter: { icon: Twitter, color: 'text-[#1DA1F2]' },
  };

  const Icon = icons[platform].icon;

  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-full p-2 bg-secondary ${icons[platform].color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="font-semibold">{formatNumber(count)}</div>
        <div className="text-xs text-muted-foreground capitalize">{platform}</div>
      </div>
    </div>
  );
};

const ServiceCard = ({ title, image, stats }) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-2">{title}</h3>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>❤️ {formatNumber(stats.likes)}</span>
          <span>💬 {formatNumber(stats.comments)}</span>
          <span>🔄 {formatNumber(stats.shares)}</span>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerProfile;
