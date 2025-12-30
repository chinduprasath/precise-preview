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
    <div className="flex items-center gap-4 bg-card border border-border rounded-lg px-4 py-3">
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-foreground truncate">{name}</span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{category}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        {platforms.map(({ key, icon: Icon, color, count }) => (
          <div key={key} className="flex items-center gap-1">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-sm font-medium text-foreground">
              {formatFollowers(count!)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerInfoCard;
