
import React from 'react';
import { Share2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileStats from './ProfileStats';
import ProfileContent from './ProfileContent';

// Enhanced with profile metrics for influencers
const metrics = [
  {
    title: 'Total Campaigns',
    value: '90',
  },
  {
    title: 'Avg Likes',
    value: '90',
  },
  {
    title: 'Engagement',
    value: '90',
  },
  {
    title: 'Avg Comments',
    value: '90',
  },
  {
    title: 'Avg Shares',
    value: '90',
  },
  {
    title: 'Fake Followers',
    value: '90',
  },
];

const stats = [
  { platform: 'instagram', count: 1000000 },
  { platform: 'facebook', count: 235000 },
  { platform: 'youtube', count: 98000 },
  { platform: 'twitter', count: 2000000 },
];

const ConnectionMetrics = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-100 rounded-md p-4 text-center">
          <p className="text-xl font-bold">{metric.value}</p>
          <p className="text-sm text-gray-500">{metric.title}</p>
        </div>
      ))}
    </div>
  );
};

const NetworkStats = () => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Network Performance</h3>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 18c-4.557 0-8.25-3.693-8.25-8.25S7.443 3.75 12 3.75s8.25 3.693 8.25 8.25-3.693 8.25-8.25 8.25z" />
                <path d="M15.348 8.043a1.5 1.5 0 0 0-2.098.303l-3.925 5.373L7.51 12.32a1.5 1.5 0 0 0-2.122 2.122l2.5 2.5a1.5 1.5 0 0 0 2.156-.066l4.5-5.5a1.5 1.5 0 0 0-.196-2.332z" />
              </svg>
              Upload
            </span>
            <span className="text-sm font-bold">5.03 mbps</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '70%'}}></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 18c-4.557 0-8.25-3.693-8.25-8.25S7.443 3.75 12 3.75s8.25 3.693 8.25 8.25-3.693 8.25-8.25 8.25z" />
                <path d="M15.348 8.043a1.5 1.5 0 0 0-2.098.303l-3.925 5.373L7.51 12.32a1.5 1.5 0 0 0-2.122 2.122l2.5 2.5a1.5 1.5 0 0 0 2.156-.066l4.5-5.5a1.5 1.5 0 0 0-.196-2.332z" />
              </svg>
              Download
            </span>
            <span className="text-sm font-bold">14.34 mbps</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '85%'}}></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 18c-4.557 0-8.25-3.693-8.25-8.25S7.443 3.75 12 3.75s8.25 3.693 8.25 8.25-3.693 8.25-8.25 8.25z" />
                <path d="M15.348 8.043a1.5 1.5 0 0 0-2.098.303l-3.925 5.373L7.51 12.32a1.5 1.5 0 0 0-2.122 2.122l2.5 2.5a1.5 1.5 0 0 0 2.156-.066l4.5-5.5a1.5 1.5 0 0 0-.196-2.332z" />
              </svg>
              Ping
            </span>
            <span className="text-sm font-bold">10 ms</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{width: '95%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfluencerProfile: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <img 
                  src="https://picsum.photos/id/1025/200/200" 
                  alt="Profile" 
                  className="object-cover"
                />
              </Avatar>
              <h1 className="text-2xl font-bold">Username</h1>
              <p className="text-gray-500 mb-4">Username@gmail.com</p>
              
              <div className="flex gap-4 mb-6">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
              
              <ProfileStats stats={stats} />
              
              <ConnectionMetrics />
              
              <NetworkStats />
            </div>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="prices">Prices</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="mt-6">
              <ProfileContent />
            </TabsContent>
            <TabsContent value="prices" className="mt-6">
              <ProfileContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
