import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import BusinessDetails from '@/components/profile/BusinessDetails';
import BusinessServicesTab from '@/components/profile/BusinessServicesTab';
import BusinessDataTab from '@/components/profile/BusinessDataTab';

const BusinessProfile = () => {
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
      
      const currentUserType = localStorage.getItem('userType');
      if (!currentUserType || currentUserType !== 'business') {
        navigate(`/account/${currentUserType || 'influencer'}`);
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
            <div className="h-32 bg-muted rounded-lg w-full"></div>
            <div className="h-64 bg-muted rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-3 py-6">
          <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-primary/60 to-primary"></div>
              <div className="absolute left-6 -bottom-12">
                <div className="rounded-full border-4 border-background overflow-hidden h-24 w-24 bg-background">
                  <img 
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute right-6 bottom-6 flex gap-2">
                <Button variant="secondary">
                  <MessageSquare className="mr-2 h-4 w-4" /> Message
                </Button>
                <Button variant="secondary">
                  <Share className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>

            <div className="pt-16 px-4 pb-6">
              <h1 className="text-2xl font-bold">{user?.email?.split('@')[0] || 'Username'}</h1>
              <p className="text-gray-600">{user?.email || 'username@gmail.com'}</p>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3 flex-shrink-0">
                  <BusinessDetails 
                    businessName="ABC company"
                    category="XYZ Products"
                    serviceType="Online & Offline"
                    website="www.xyz.com"
                    location="[Address]"
                  />
                </div>

                <div className="md:w-2/3 flex-grow">
                  <Tabs defaultValue="services" className="w-full">
                    <div className="border-b mb-6">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="services" className="mt-0">
                      <BusinessServicesTab />
                    </TabsContent>
                    
                    <TabsContent value="data" className="mt-0">
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
