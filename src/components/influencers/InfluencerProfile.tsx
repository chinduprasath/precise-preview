
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Instagram, Facebook, Youtube, Twitter, Copy, Share2, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { formatCurrency } from '@/components/reach/utils/formatUtils';
import PricesTabContent from '@/components/influencers/PricesTabContent';
import DataTabContent from '@/components/influencers/DataTabContent';
import ServicesTabContent from '@/components/influencers/ServicesTabContent';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface InfluencerProfileProps {
  influencer?: any | null;
}

const InfluencerProfile: React.FC<InfluencerProfileProps> = ({ influencer }) => {
  const { toast } = useToast();

  const handleCopyEmail = () => {
    if (influencer?.email) {
      navigator.clipboard.writeText(influencer.email);
      toast({
        title: "Email Copied",
        description: "Email address copied to clipboard",
      });
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section (Left Column) */}
        <div className="bg-gray-50 rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <img 
                src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
                alt={influencer.name} 
                className="h-full w-full object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                {influencer.username || '@' + influencer.name.toLowerCase().replace(/\s+/g, '')}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {influencer.email}
                <button onClick={handleCopyEmail} className="text-gray-500 hover:text-gray-700">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 mt-1">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Social Media Followers */}
          <div className="flex justify-between mb-6">
            {influencer.followers_instagram > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white mb-1">
                  <Instagram size={20} />
                </div>
                <span className="text-sm font-medium">{formatNumber(influencer.followers_instagram)}</span>
              </div>
            )}
            {influencer.followers_facebook > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-1">
                  <Facebook size={20} />
                </div>
                <span className="text-sm font-medium">{formatNumber(influencer.followers_facebook)}</span>
              </div>
            )}
            {influencer.followers_youtube > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mb-1">
                  <Youtube size={20} />
                </div>
                <span className="text-sm font-medium">{formatNumber(influencer.followers_youtube)}</span>
              </div>
            )}
            {influencer.followers_twitter > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white mb-1">
                  <Twitter size={20} />
                </div>
                <span className="text-sm font-medium">{formatNumber(influencer.followers_twitter)}</span>
              </div>
            )}
          </div>

          {/* Stats Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-xl font-bold">90</div>
              <div className="text-xs text-gray-500">Total Campaigns</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-xl font-bold">90</div>
              <div className="text-xs text-gray-500">Avg Likes</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-xl font-bold">90</div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-xl font-bold">90</div>
              <div className="text-xs text-gray-500">Avg Comments</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-xl font-bold">90</div>
              <div className="text-xs text-gray-500">Avg Shares</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-xl font-bold">90</div>
              <div className="text-xs text-gray-500">Fake Followers</div>
            </div>
          </div>

          {/* Network Stats */}
          <div className="mt-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="text-blue-500" />
                <span className="font-medium">Upload</span>
                <span className="ml-auto text-gray-700 font-medium">5,03 mbps</span>
              </div>
              <div className="h-16 bg-blue-50 rounded-lg mb-4 overflow-hidden relative">
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
              <div className="h-16 bg-blue-50 rounded-lg mb-4 overflow-hidden relative">
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
              <div className="h-16 bg-green-50 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 25">
                    <path d="M0,15 Q10,10 20,15 T40,10 T60,15 T80,5 T100,10" fill="none" stroke="#22c55e" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section (Right Column) */}
        <div className="md:col-span-2">
          <Tabs defaultValue="services">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
              <TabsTrigger value="prices" className="flex-1">Prices</TabsTrigger>
              <TabsTrigger value="data" className="flex-1">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <ServicesTabContent influencerId={influencer.id} influencerName={influencer.name} />
            </TabsContent>

            <TabsContent value="prices">
              <PricesTabContent influencerId={influencer.id} influencerName={influencer.name} />
            </TabsContent>

            <TabsContent value="data">
              <DataTabContent influencerId={influencer.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
