
import React from 'react';

interface FollowerData {
  platform: string;
  icon: React.ReactNode;
  value: string;
}

interface InfluencerData {
  avatar: string;
  name: string;
  email: string;
  followers: FollowerData[];
}

interface InfluencerProfileCardProps {
  influencer: InfluencerData;
}

const InfluencerProfileCard: React.FC<InfluencerProfileCardProps> = ({ influencer }) => {
  return (
    <div className="rounded-xl overflow-hidden border-0 shadow-md bg-white dark:bg-card">
      <div className="p-0">
        <div className="bg-gradient-to-r from-[#9b87f5]/90 to-[#7E69AB]/90 p-5 flex items-center gap-4 text-white">
          <div className="relative">
            <img
              src={influencer.avatar}
              alt="Influencer Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{influencer.name}</h3>
            <p className="text-sm text-white/90">{influencer.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 divide-x divide-border border-t">
          {influencer.followers.map((item, idx) => (
            <div key={idx} className="p-3 text-center group transition-all hover:bg-accent cursor-default">
              <div className="flex justify-center mb-1 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="font-semibold text-sm">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.platform}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfileCard;
