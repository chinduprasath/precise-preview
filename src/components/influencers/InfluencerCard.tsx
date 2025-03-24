
import React from 'react';
import { Avatar } from '@/components/ui/avatar';

interface SocialStats {
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  count: number;
}

interface InfluencerCardProps {
  name: string;
  avatar: string;
  socialStats: SocialStats[];
  onClick?: () => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

const SocialIcon: React.FC<{ platform: string; count: number }> = ({ platform, count }) => {
  const getIconClass = () => {
    switch (platform) {
      case 'instagram':
        return 'bg-social-instagram';
      case 'facebook':
        return 'bg-social-facebook';
      case 'twitter':
        return 'bg-social-twitter';
      case 'youtube':
        return 'bg-social-youtube';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`w-4 h-4 rounded-full ${getIconClass()}`}></div>
      <span className="text-xs font-medium">{formatNumber(count)}</span>
    </div>
  );
};

const InfluencerCard: React.FC<InfluencerCardProps> = ({
  name,
  avatar,
  socialStats,
  onClick,
}) => {
  return (
    <div 
      className="p-3 border rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer bg-white" 
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border">
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
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
