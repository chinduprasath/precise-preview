
import React from 'react';

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
  const getIconClass = () => {
    switch (platform) {
      case 'instagram':
        return 'text-social-instagram';
      case 'facebook':
        return 'text-social-facebook';
      case 'twitter':
        return 'text-social-twitter';
      case 'youtube':
        return 'text-social-youtube';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getIconClass()} bg-white shadow-sm border`}>
      <span className="text-2xl font-bold">{platform.charAt(0).toUpperCase()}</span>
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
