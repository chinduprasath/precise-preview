
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

interface SocialStats {
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  count: number;
}

interface InfluencerCardProps {
  id?: string;
  name: string;
  avatar: string;
  location?: {
    state?: string;
    city?: string;
  };
  socialStats: SocialStats[];
  onClick?: () => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const SocialIcon: React.FC<{ platform: string; count: number }> = ({ platform, count }) => {
  const getIconDetails = () => {
    switch (platform) {
      case 'instagram':
        return { icon: <Instagram className="h-4 w-4" />, color: 'text-social-instagram' };
      case 'facebook':
        return { icon: <Facebook className="h-4 w-4" />, color: 'text-social-facebook' };
      case 'twitter':
        return { icon: <Twitter className="h-4 w-4" />, color: 'text-social-twitter' };
      case 'youtube':
        return { icon: <Youtube className="h-4 w-4" />, color: 'text-social-youtube' };
      default:
        return { icon: null, color: 'text-gray-400' };
    }
  };

  const { icon, color } = getIconDetails();
  const bgColor = platform === 'instagram' ? 'bg-social-instagram' : 
                  platform === 'facebook' ? 'bg-social-facebook' : 
                  platform === 'twitter' ? 'bg-social-twitter' : 
                  platform === 'youtube' ? 'bg-social-youtube' : 'bg-gray-400';

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center justify-center w-5 h-5 rounded-full ${color}`}>
        {icon}
      </div>
      <span className="text-xs font-medium">{formatNumber(count)}</span>
    </div>
  );
};

const InfluencerCard: React.FC<InfluencerCardProps> = ({
  id,
  name,
  avatar,
  location,
  socialStats,
  onClick,
}) => {
  return (
    <div 
      className="p-3 border rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer bg-white" 
      onClick={onClick}
      data-influencer-id={id}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border">
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          {location && location.city && location.state && (
            <div className="text-xs text-gray-500 mt-0.5">
              {location.city}, {location.state}
            </div>
          )}
          <div className="flex items-center gap-3 mt-1">
            {socialStats.map((stat, index) => (
              <SocialIcon key={index} platform={stat.platform} count={stat.count} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCard;
