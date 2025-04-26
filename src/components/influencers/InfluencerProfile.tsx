import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import PricesTabContent from '@/components/influencers/PricesTabContent';
import DataTabContent from '@/components/influencers/DataTabContent';
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
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar className="h-24 w-24 mb-4">
          <img 
            src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
            alt={influencer.name} 
            className="h-full w-full object-cover"
          />
        </Avatar>
        <h2 className="text-2xl font-semibold text-foreground mb-2">{influencer.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {influencer.username || '@' + influencer.name.toLowerCase().replace(/\s+/g, '')}
        </p>
        <p className="text-sm text-foreground max-w-md mb-8">{influencer.bio || 'No bio available'}</p>
        
        {/* Social Media Stats */}
        <div className="flex justify-center items-center gap-12 mb-8">
          {influencer.followers_instagram > 0 && (
            <div className="flex flex-col items-center">
              <Instagram className="h-6 w-6 text-social-instagram mb-2" />
              <span className="font-medium text-foreground">{formatNumber(influencer.followers_instagram)}</span>
            </div>
          )}
          {influencer.followers_facebook > 0 && (
            <div className="flex flex-col items-center">
              <Facebook className="h-6 w-6 text-social-facebook mb-2" />
              <span className="font-medium text-foreground">{formatNumber(influencer.followers_facebook)}</span>
            </div>
          )}
          {influencer.followers_youtube > 0 && (
            <div className="flex flex-col items-center">
              <Youtube className="h-6 w-6 text-social-youtube mb-2" />
              <span className="font-medium text-foreground">{formatNumber(influencer.followers_youtube)}</span>
            </div>
          )}
          {influencer.followers_twitter > 0 && (
            <div className="flex flex-col items-center">
              <Twitter className="h-6 w-6 text-social-twitter mb-2" />
              <span className="font-medium text-foreground">{formatNumber(influencer.followers_twitter)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {influencer.niche && (
            <span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 text-xs px-3 py-1 rounded-full">
              {influencer.niche.name}
            </span>
          )}
          {influencer.state && (
            <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs px-3 py-1 rounded-full">
              {influencer.state.name}
            </span>
          )}
          {influencer.city && (
            <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs px-3 py-1 rounded-full">
              {influencer.city.name}
            </span>
          )}
        </div>
      </div>

      {/* Centered Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex justify-center">
          <button 
            className={`px-6 py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'services' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button 
            className={`px-6 py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'prices' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('prices')}
          >
            Prices
          </button>
          <button 
            className={`px-6 py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'data' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'services' && (
          <div className="grid grid-cols-2 gap-6">
            <ContentCard platform="instagram" type="post" />
            <ContentCard platform="instagram" type="story" />
            <ContentCard platform="instagram" type="reel" />
            <ContentCard platform="youtube" type="video" />
          </div>
        )}
        
        {activeTab === 'prices' && (
          <PricesTabContent 
            influencerId={influencer.id}
            influencerName={influencer.name}
          />
        )}
        
        {activeTab === 'data' && (
          <DataTabContent influencerId={influencer.id} />
        )}
      </div>
    </div>
  );
};

const ContentCard = ({ platform, type }: { platform: string; type: string }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-border bg-card">
      <div className="aspect-video bg-muted">
        <img 
          src={`https://picsum.photos/id/${Math.floor(Math.random() * 100)}/300/200`} 
          alt="Content" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-foreground capitalize">{type}</span>
          <span className="text-xs text-muted-foreground">{platform}</span>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <span className="text-red-500">❤</span>
            <span className="text-xs text-foreground">200K</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-500">👁️</span>
            <span className="text-xs text-foreground">500K</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-foreground">💬</span>
            <span className="text-xs text-foreground">10K</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
