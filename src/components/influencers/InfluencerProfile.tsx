import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { LineChart } from '@/components/ui/line-chart';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const InfluencerProfile = () => {
  const [user, setUser] = React.useState<any>(null);
  const [selectedPricing, setSelectedPricing] = React.useState('platform');

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    getUser();
  }, []);

  const socialStats = [
    { platform: 'Instagram', icon: <Instagram className="h-5 w-5" />, followers: '1M', color: 'text-pink-500' },
    { platform: 'Facebook', icon: <Facebook className="h-5 w-5" />, followers: '235K', color: 'text-blue-600' },
    { platform: 'Youtube', icon: <Youtube className="h-5 w-5" />, followers: '98K', color: 'text-red-600' },
    { platform: 'Twitter', icon: <Twitter className="h-5 w-5" />, followers: '2M', color: 'text-blue-400' },
  ];

  const performanceStats = [
    { label: 'Total Campaigns', value: '90' },
    { label: 'Avg Likes', value: '90' },
    { label: 'Engagement', value: '90' },
    { label: 'Avg Comments', value: '90' },
    { label: 'Fake Followers', value: '90' },
  ];

  const networkStats = [
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

  const contentCards = Array(6).fill({
    thumbnail: 'https://source.unsplash.com/random/300x200',
    likes: '200K',
    views: '500K',
    shares: '10K',
  });

  const platformServices = [
    { name: 'Post Image/Video', price: '499₹' },
    { name: 'Reel', price: '499₹' },
    { name: 'Story (Image/Video)', price: '499₹' },
    { name: 'Short Video (<10m)', price: '499₹' },
    { name: 'Video (>10m)', price: '499₹' },
    { name: 'Polls', price: '499₹' },
  ];

  const comboPackages = [
    {
      name: 'Packagename-1',
      platforms: 'Insta/FB/Youtube',
      price: '499₹'
    },
    {
      name: 'Packagename-2',
      platforms: 'Insta/FB/Youtube',
      price: '499₹'
    },
    {
      name: 'Packagename-3',
      platforms: 'Insta/FB/Youtube',
      price: '499₹'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="col-span-3">
            <Card className="p-6 space-y-6 bg-gray-100">
              {/* Profile Section */}
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <img
                    src={user?.user_metadata?.avatar_url || 'https://via.placeholder.com/64'}
                    alt="Profile"
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Username'}</h2>
                <p className="text-sm text-gray-500">{user?.email || 'Username@gmail.com'}</p>
                <button className="mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Social Media Stats */}
              <div className="grid grid-cols-4 gap-2">
                {socialStats.map((stat) => (
                  <div key={stat.platform} className="text-center">
                    <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                    <div className="text-sm font-medium">{stat.followers}</div>
                  </div>
                ))}
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4">
                {performanceStats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-lg p-3 text-center">
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
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="prices">Prices</TabsTrigger>
                  </TabsList>

                <TabsContent value="services" className="mt-6">
                  <div className="grid grid-cols-3 gap-4">
                    {contentCards.map((card, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-sm border">
                        <img src={card.thumbnail} alt="" className="w-full h-40 object-cover" />
                        <div className="p-3 bg-white">
                          <div className="flex justify-between text-sm">
                            <span>❤️ {card.likes}</span>
                            <span>👁️ {card.views}</span>
                            <span>↗️ {card.shares}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                </TabsContent>
                
                <TabsContent value="prices" className="mt-6">
                  <div className="space-y-8">
                    <RadioGroup value={selectedPricing} onValueChange={setSelectedPricing}>
                      {/* Platform Based Pricing */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="platform" id="platform" />
                          <Label htmlFor="platform" className="text-lg font-semibold">Platform Based</Label>
                          <select className="ml-2 px-3 py-1 border rounded-md">
                            <option>Select Platform</option>
                            <option>Instagram</option>
                            <option>Facebook</option>
                            <option>Youtube</option>
                          </select>
                          <Button variant="outline" className="ml-auto">Edit</Button>
                        </div>
                        
                        <div className="space-y-3 pl-6">
                          {platformServices.map((service, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                <span>{service.name}</span>
                              </div>
                              <span className="font-medium">{service.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Combo Package */}
                      <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="combo" id="combo" />
                          <Label htmlFor="combo" className="text-lg font-semibold">Combo Package</Label>
                        </div>
                        
                        <div className="space-y-3 pl-6">
                          {comboPackages.map((pkg, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span>{pkg.name}</span>
                                <span className="text-sm text-gray-500">{pkg.platforms}</span>
                              </div>
                              <span className="font-medium">{pkg.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </RadioGroup>
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
