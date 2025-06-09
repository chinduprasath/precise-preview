
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Instagram, Facebook, Twitter, Youtube, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Influencer } from '@/types/location';

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const InfluencerListItem = ({
  influencer,
  isSelected,
  onClick
}: {
  influencer: Influencer;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 py-3 hover:bg-secondary/50 rounded-lg px-2 transition-colors cursor-pointer ${isSelected ? 'bg-secondary/70' : ''}`}>
      <Avatar className="h-12 w-12">
        <img 
          src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
          alt={influencer.name} 
          className={`h-full w-full object-cover ${influencer.is_blurred ? 'blur-sm' : ''}`} 
        />
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">{influencer.username || influencer.name}</h3>
          {influencer.is_verified && (
            <Badge variant="default" className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              Verified
            </Badge>
          )}
          {influencer.is_trending && (
            <Badge variant="secondary" className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              Trending
            </Badge>
          )}
        </div>
        {influencer.niche && (
          <p className="text-xs text-muted-foreground">
            {influencer.niche.name}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 mt-1">
          {influencer.followers_instagram && influencer.followers_instagram > 0 && (
            <div className="flex items-center gap-1">
              <Instagram className="h-4 w-4 text-social-instagram" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_instagram)}</span>
            </div>
          )}
          {influencer.followers_facebook && influencer.followers_facebook > 0 && (
            <div className="flex items-center gap-1">
              <Facebook className="h-4 w-4 text-social-facebook" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_facebook)}</span>
            </div>
          )}
          {influencer.followers_twitter && influencer.followers_twitter > 0 && (
            <div className="flex items-center gap-1">
              <Twitter className="h-4 w-4 text-social-twitter" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_twitter)}</span>
            </div>
          )}
          {influencer.followers_youtube && influencer.followers_youtube > 0 && (
            <div className="flex items-center gap-1">
              <Youtube className="h-4 w-4 text-social-youtube" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_youtube)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfluencerListSkeleton = () => {
  return (
    <div className="space-y-3 px-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface InfluencerListProps {
  influencers: Influencer[];
  selectedInfluencer: Influencer | null;
  onInfluencerClick: (influencer: Influencer) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading: boolean;
  isInitialLoad: boolean;
}

const InfluencerList: React.FC<InfluencerListProps> = ({
  influencers,
  selectedInfluencer,
  onInfluencerClick,
  searchTerm,
  onSearchChange,
  loading,
  isInitialLoad
}) => {
  return (
    <div className="md:col-span-1 h-full flex flex-col">
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Influencers</h2>
          <div className="relative w-1/2">
            <Input placeholder="Search..." value={searchTerm} onChange={e => onSearchChange(e.target.value)} className="pl-9" />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {isInitialLoad ? <InfluencerListSkeleton /> : loading && !isInitialLoad ? (
            <div className="flex items-center justify-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
              <span className="ml-2 text-muted-foreground">Filtering...</span>
            </div>
          ) : influencers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="mb-2">
                <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No influencers found</h3>
              <p className="text-sm">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            influencers.map(influencer => (
              <div key={influencer.id}>
                <InfluencerListItem 
                  influencer={influencer} 
                  isSelected={selectedInfluencer && selectedInfluencer.id === influencer.id} 
                  onClick={() => onInfluencerClick(influencer)} 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerList;
