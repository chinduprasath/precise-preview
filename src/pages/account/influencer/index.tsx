
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LineChart } from '@/components/ui/line-chart';

interface SocialStats {
  platform: string;
  icon: React.ReactNode;
  followers: number;
  color: string;
}

interface NetworkStats {
  label: string;
  value: string;
  data: number[];
  color: string;
}

interface ContentCard {
  id: string;
  thumbnail: string;
  likes: number;
  views: number;
  shares: number;
  price?: number;
}

const InfluencerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [influencerId, setInfluencerId] = React.useState<string | undefined>(undefined);

  const socialStats: SocialStats[] = [
    { platform: 'Instagram', icon: <Instagram className="h-5 w-5" />, followers: 1000000, color: 'text-pink-500' },
    { platform: 'Facebook', icon: <Facebook className="h-5 w-5" />, followers: 235000, color: 'text-blue-600' },
    { platform: 'Youtube', icon: <Youtube className="h-5 w-5" />, followers: 98000, color: 'text-red-600' },
    { platform: 'Twitter', icon: <Twitter className="h-5 w-5" />, followers: 2000000, color: 'text-blue-400' },
  ];

  const performanceStats = [
    { label: 'Total Campaigns', value: '90' },
    { label: 'Avg Likes', value: '90' },
    { label: 'Engagement', value: '90' },
    { label: 'Avg Comments', value: '90' },
    { label: 'Fake Followers', value: '90' },
  ];

  const networkStats: NetworkStats[] = [
    { 
      label: 'Upload', 
      value: '5.03 mbps',
      data: [3, 4, 3.5, 5, 4.5, 5.2, 5.03],
      color: 'rgb(99, 102, 241)'
    },
    { 
      label: 'Download', 
      value: '14.34 mbps',
      data: [12, 13, 14, 13.5, 14.5, 14, 14.34],
      color: 'rgb(59, 130, 246)'
    },
    { 
      label: 'Ping', 
      value: '10 ms',
      data: [11, 10, 9, 11, 10, 10, 10],
      color: 'rgb(34, 197, 94)'
    },
  ];

  const contentCards: ContentCard[] = [
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      likes: 200000,
      views: 500000,
      shares: 15000,
      price: 5000
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      likes: 150000,
      views: 400000,
      shares: 12000,
      price: 4500
    },
    {
      id: '3',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      likes: 180000,
      views: 450000,
      shares: 13500,
      price: 4800
    },
    {
      id: '4',
      thumbnail: 'https://images.unsplash.com/photo-1503602642458-232111445657',
      likes: 160000,
      views: 420000,
      shares: 11000,
      price: 4200
    },
    {
      id: '5',
      thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
      likes: 190000,
      views: 480000,
      shares: 14000,
      price: 5200
    },
    {
      id: '6',
      thumbnail: 'https://images.unsplash.com/photo-1525904097878-94fb15835963',
      likes: 170000,
      views: 430000,
      shares: 12500,
      price: 4700
    }
  ];

  React.useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/signin');
        return;
      }
      const currentUserType = localStorage.getItem('userType');
      if (!currentUserType || currentUserType !== 'influencer') {
        navigate(`/account/${currentUserType || 'business'}`);
        return;
      }
      setUser(data.session.user);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-32 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="col-span-3">
            <Card className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={user?.user_metadata?.avatar_url || 'https://via.placeholder.com/96'}
                    alt="Profile"
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold">Username</h2>
                <p className="text-gray-500 text-sm">Username@gmail.com</p>
              </div>

              {/* Social Media Stats */}
              <div className="grid grid-cols-4 gap-2">
                {socialStats.map((stat) => (
                  <div key={stat.platform} className="text-center">
                    <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                    <div className="text-sm font-medium">{formatNumber(stat.followers)}</div>
                  </div>
                ))}
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4">
                {performanceStats.map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-semibold">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Network Stats */}
              <div className="space-y-4">
                {networkStats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{stat.label}</span>
                      <span className="text-sm font-medium">{stat.value}</span>
                    </div>
                    <div className="h-12">
                      <LineChart
                        data={stat.data}
                        color={stat.color}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Section */}
          <div className="col-span-9">
            <Card className="p-6">
              <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="prices">Prices</TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="mt-0">
                  <div className="grid grid-cols-3 gap-4">
                    {contentCards.map((card) => (
                      <div key={card.id} className="rounded-lg overflow-hidden shadow-sm border">
                        <img src={card.thumbnail} alt="" className="w-full h-40 object-cover" />
                        <div className="p-3 bg-white">
                          <div className="flex justify-between text-sm">
                            <span>❤️ {formatNumber(card.likes)}</span>
                            <span>👁️ {formatNumber(card.views)}</span>
                            <span>↗️ {formatNumber(card.shares)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="prices" className="mt-0">
                  <div className="grid grid-cols-3 gap-4">
                    {contentCards.map((card) => (
                      <div key={card.id} className="rounded-lg overflow-hidden shadow-sm border">
                        <div className="relative">
                          <img src={card.thumbnail} alt="" className="w-full h-40 object-cover" />
                          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium">
                            ₹{formatNumber(card.price || 0)}
                          </div>
                        </div>
                        <div className="p-3 bg-white">
                          <div className="flex justify-between text-sm">
                            <span>❤️ {formatNumber(card.likes)}</span>
                            <span>👁️ {formatNumber(card.views)}</span>
                            <span>↗️ {formatNumber(card.shares)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
