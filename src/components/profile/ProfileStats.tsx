
import React from 'react';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

interface StatProps {
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  count: number;
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

const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
  const getIconDetails = () => {
    switch (platform) {
      case 'instagram':
        return { icon: <Instagram className="h-5 w-5" />, color: 'text-social-instagram' };
      case 'facebook':
        return { icon: <Facebook className="h-5 w-5" />, color: 'text-social-facebook' };
      case 'twitter':
        return { icon: <Twitter className="h-5 w-5" />, color: 'text-social-twitter' };
      case 'youtube':
        return { icon: <Youtube className="h-5 w-5" />, color: 'text-social-youtube' };
      default:
        return { icon: null, color: 'text-gray-400' };
    }
  };

  const { icon, color } = getIconDetails();

  return (
    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${color} bg-white shadow-sm border`}>
      {icon || <span className="text-2xl font-bold">{platform.charAt(0).toUpperCase()}</span>}
    </div>
  );
};

const ProfileStats: React.FC<{ stats: StatProps[] }> = ({ stats }) => {
  return (
    <div className="flex gap-6 mt-6">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center">
          <PlatformIcon platform={stat.platform} />
          <div className="mt-2 text-center">
            <p className="text-xl font-bold">{formatNumber(stat.count)}</p>
            <p className="text-sm text-gray-500 capitalize">{stat.platform}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
