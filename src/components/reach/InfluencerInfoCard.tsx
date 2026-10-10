import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface InfluencerInfoCardProps {
  name: string;
  category: string;
  location: string;
  avatar?: string;
  followers: {
    instagram?: number;
    facebook?: number;
    twitter?: number;
    youtube?: number;
  };
}

const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

const InfluencerInfoCard: React.FC<InfluencerInfoCardProps> = ({
  name,
  category,
  location,
  avatar,
  followers
}) => {
  const platforms = [
    { key: 'instagram', icon: Instagram, color: 'text-pink-500', count: followers.instagram },
    { key: 'facebook', icon: Facebook, color: 'text-blue-600', count: followers.facebook },
    { key: 'twitter', icon: Twitter, color: 'text-sky-500', count: followers.twitter },
    { key: 'youtube', icon: Youtube, color: 'text-red-500', count: followers.youtube },
  ].filter(p => p.count && p.count > 0);

  return (
    <div className="flex items-center gap-3.5 bg-card border border-border/80 rounded-xl px-4 py-3 shadow-xs">
      <Avatar className="h-12 w-12 border border-border/60 shrink-0">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col min-w-0 space-y-1">
        {/* Row 1: Influencer Name */}
        <span className="font-bold text-foreground text-sm sm:text-base leading-tight truncate">
          {name}
        </span>
        
        {/* Row 2: Category & Location */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{category}</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>{location}</span>
          </span>
        </div>

        {/* Row 3: Social Media Icons and Counts (Below Category Row) */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {platforms.map(({ key, icon: Icon, color, count }) => (
            <div 
              key={key} 
              className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/30 border border-border/50 rounded-md px-2 py-0.5 text-xs font-medium"
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <span className="text-foreground font-semibold">
                {formatFollowers(count!)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfluencerInfoCard;
