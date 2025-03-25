
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { serviceContentData, platformServicesData, comboPackagesData } from '@/components/influencers/utils/constants';
import InfluencerDetails from '@/components/influencers/InfluencerDetails';
import ServicesTabContent from '@/components/influencers/ServicesTabContent';
import PricesTabContent from '@/components/influencers/PricesTabContent';

const InfluencerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/signin');
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <div className="absolute left-6 -bottom-12">
                <div className="rounded-full border-4 border-white overflow-hidden h-24 w-24 bg-white">
                  <img 
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute right-6 bottom-6 flex gap-2">
                <Button variant="outline" className="bg-white">
                  <MessageSquare className="mr-2 h-4 w-4" /> Message
                </Button>
                <Button variant="outline" className="bg-white">
                  <Share className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 px-6 pb-6">
              <h1 className="text-2xl font-bold">{user?.email?.split('@')[0] || 'Username'}</h1>
              <p className="text-gray-600">{user?.email || 'username@gmail.com'}</p>

              {/* Two Column Layout: Influencer Details and Tabs */}
              <div className="mt-6 flex flex-col md:flex-row gap-6">
                {/* Left Column - Influencer Details */}
                <div className="md:w-1/3 flex-shrink-0">
                  <InfluencerDetails 
                    id="user123"
                    name={user?.email?.split('@')[0] || 'Username'}
                    profileImage="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    followers={{
                      instagram: 1000000,
                      facebook: 235000,
                      twitter: 98000,
                      youtube: 2000000
                    }}
                  />
                </div>

                {/* Right Column - Tabs */}
                <div className="md:w-2/3 flex-grow">
                  <Tabs defaultValue="services" className="w-full">
                    <div className="border-b mb-6">
                      <TabsList className="w-full flex justify-between bg-transparent p-0">
                        <TabsTrigger 
                          value="services" 
                          className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                        >
                          Services
                        </TabsTrigger>
                        <TabsTrigger 
                          value="prices" 
                          className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                        >
                          Prices
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="services" className="mt-0">
                      <ServicesTabContent serviceContent={serviceContentData} />
                    </TabsContent>
                    
                    <TabsContent value="prices" className="mt-0">
                      <PricesTabContent 
                        platformServices={platformServicesData} 
                        comboPackages={comboPackagesData}
                        influencerName={user?.email?.split('@')[0] || 'Username'}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
