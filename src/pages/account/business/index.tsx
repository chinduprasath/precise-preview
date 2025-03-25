
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileContent from '@/components/profile/ProfileContent';
import BusinessDetails from '@/components/profile/BusinessDetails';
import BusinessDataTab from '@/components/profile/BusinessDataTab';
import { supabase } from '@/integrations/supabase/client';

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkUser = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/signin');
        return;
      }

      // Make sure we're setting the userType in localStorage
      const currentUserType = localStorage.getItem('userType');
      if (!currentUserType || currentUserType !== 'business') {
        localStorage.setItem('userType', 'business');
      }
      setUser(data.session.user);
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  if (loading) {
    return <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-32 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-[50px] py-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 mx-0 my-0 px-[30px]"></div>
              <div className="absolute left-6 -bottom-12">
                <div className="rounded-full border-4 border-white overflow-hidden h-24 w-24 bg-white">
                  <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="h-full w-full object-cover" />
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

            {/* Profile Content */}
            <div className="pt-16 px-6 pb-6">
              <h1 className="text-2xl font-bold">{user?.email?.split('@')[0] || 'Username'}</h1>
              <p className="text-gray-600">{user?.email || 'username@gmail.com'}</p>

              {/* Two Column Layout */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Business Info */}
                <div className="md:col-span-1">
                  <BusinessDetails 
                    businessName="ABC company"
                    category="XYZ Products"
                    serviceType="Online & Offline"
                    website="www.xyz.com"
                    location="[Address]"
                  />
                </div>

                {/* Right Column - Tabs */}
                <div className="md:col-span-2">
                  <Tabs defaultValue="services">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="data">Data</TabsTrigger>
                    </TabsList>
                    <TabsContent value="services" className="mt-4">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-4">Your Services</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(item => (
                              <Card key={item} className="overflow-hidden">
                                <CardContent className="p-0">
                                  <img src={`https://images.unsplash.com/photo-${1560000000000 + item * 100000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} alt={`Business image ${item}`} className="w-full h-32 object-cover" />
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="data" className="mt-4">
                      <BusinessDataTab />
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

export default BusinessProfile;
