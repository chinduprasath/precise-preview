import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Instagram, Facebook, Youtube, Twitter, MessageSquare, Share2 } from 'lucide-react';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import PricesTabContent from '@/components/influencers/PricesTabContent';
import DataTabContent from '@/components/influencers/DataTabContent';
import ServicesTabContent from '@/components/influencers/ServicesTabContent';
import { Influencer } from '@/types/location';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

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
      <div className="bg-[#F8F9FA] rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <img 
                src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
                alt={influencer.name} 
                className="h-full w-full object-cover"
              />
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground">{influencer.name}</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {influencer.username || '@' + influencer.name.toLowerCase().replace(/\s+/g, '')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            {influencer.followers_instagram > 0 && (
              <div className="flex flex-col items-center">
                <Instagram size={20} className="text-social-instagram mb-1" />
                <span className="text-sm font-medium">{formatNumber(influencer.followers_instagram)}</span>
              </div>
            )}
            {influencer.followers_facebook > 0 && (
              <div className="flex flex-col items-center">
                <Facebook size={20} className="text-social-facebook mb-1" />
                <span className="text-sm font-medium">{formatNumber(influencer.followers_facebook)}</span>
              </div>
            )}
            {influencer.followers_youtube > 0 && (
              <div className="flex flex-col items-center">
                <Youtube size={20} className="text-social-youtube mb-1" />
                <span className="text-sm font-medium">{formatNumber(influencer.followers_youtube)}</span>
              </div>
            )}
            {influencer.followers_twitter > 0 && (
              <div className="flex flex-col items-center">
                <Twitter size={20} className="text-social-twitter mb-1" />
                <span className="text-sm font-medium">{formatNumber(influencer.followers_twitter)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="flex justify-center">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="prices">Prices</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
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
  );
};

export default InfluencerProfile;
