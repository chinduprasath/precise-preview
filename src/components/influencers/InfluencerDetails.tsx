
import React from 'react';
import { Card } from '@/components/ui/card';
import { Share2, MessageSquare } from 'lucide-react';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { formatNumber } from '@/components/influencers/utils/formatUtils';

interface InfluencerDetailsProps {
  id: string;
  name: string;
  profileImage: string;
  email?: string;
  followers: {
    instagram?: number;
    facebook?: number;
    youtube?: number;
    twitter?: number;
  };
}

const InfluencerDetails: React.FC<InfluencerDetailsProps> = ({
  id,
  name,
  profileImage,
  email,
  followers,
}) => {
  return (
    <div className="md:w-full">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-16 w-16 rounded-full overflow-hidden">
          <img 
            src={profileImage || "https://picsum.photos/200"} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold">{name}</h1>
          <p className="text-gray-500 text-sm">{email || `${name.toLowerCase()}@gmail.com`}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="text-gray-500">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="text-gray-500">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Social Platforms */}
      <div className="flex justify-between mb-6 mt-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
          <span className="text-sm font-semibold">{formatNumber(followers.instagram || 1000000)}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </div>
          <span className="text-sm font-semibold">{formatNumber(followers.facebook || 235000)}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
          </div>
          <span className="text-sm font-semibold">{formatNumber(followers.youtube || 98000)}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </div>
          <span className="text-sm font-semibold">{formatNumber(followers.twitter || 2000000)}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-xl font-bold">90</div>
          <div className="text-xs text-gray-500">Total Campaigns</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-xl font-bold">90</div>
          <div className="text-xs text-gray-500">Avg Likes</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-xl font-bold">90</div>
          <div className="text-xs text-gray-500">Engagement</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-xl font-bold">90</div>
          <div className="text-xs text-gray-500">Avg Comments</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-xl font-bold">90</div>
          <div className="text-xs text-gray-500">Avg Shares</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-xl font-bold">90</div>
          <div className="text-xs text-gray-500">Fake Followers</div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="mt-4">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="text-blue-500" />
              <span className="font-medium">Upload</span>
              <span className="ml-auto text-gray-700 font-medium">5,03 mbps</span>
            </div>
            <div className="h-16 bg-gray-50 rounded-lg mb-4 overflow-hidden relative">
              <div className="absolute inset-0 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 25">
                  <path d="M0,15 Q10,10 20,15 T40,10 T60,20 T80,5 T100,15" fill="none" stroke="#3b82f6" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowDown className="text-blue-300" />
              <span className="font-medium">Download</span>
              <span className="ml-auto text-gray-700 font-medium">14,34 mbps</span>
            </div>
            <div className="h-16 bg-gray-50 rounded-lg mb-4 overflow-hidden relative">
              <div className="absolute inset-0 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 25">
                  <path d="M0,10 Q10,20 20,5 T40,15 T60,5 T80,20 T100,10" fill="none" stroke="#93c5fd" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-green-500" />
              <span className="font-medium">Ping</span>
              <span className="ml-auto text-gray-700 font-medium">10 ms</span>
            </div>
            <div className="h-16 bg-gray-50 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 25">
                  <path d="M0,15 Q10,10 20,15 T40,10 T60,15 T80,5 T100,10" fill="none" stroke="#22c55e" strokeWidth="2"></path>
                  <path d="M0,15 Q10,10 20,15 T40,10 T60,15 T80,5 T100,10" fill="rgb(240, 253, 244, 0.5)"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDetails;
