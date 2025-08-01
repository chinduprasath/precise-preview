import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import BusinessDetails from '@/components/profile/BusinessDetails';
import BusinessServicesTab from '@/components/profile/BusinessServicesTab';
import BusinessDataTab from '@/components/profile/BusinessDataTab';
import BusinessEditModal from '@/components/profile/BusinessEditModal';

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isRegistered, setIsRegistered] = React.useState(true);
  const [businessData, setBusinessData] = React.useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData: any) => {
    if (!user?.id) return;

    setLoading(true);
    const { error } = await supabase
      .from('business_profiles')
      .update({
        company_name: updatedData.businessName,
        industry: [updatedData.category],
        website: updatedData.website,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating business profile:', error);
      // TODO: Show a toast notification for error
    } else {
      // Update the local state with the new data immediately for UI consistency
      setBusinessData(updatedData);
      setIsRegistered(updatedData.isRegistered);
      // The following fields are not directly supported by the current business_profiles schema.
      // To persist these, the Supabase table schema would need to be updated:
      // updatedData.serviceType
      // updatedData.location
      // updatedData.priceRange
      // updatedData.accountManagement
      // A full re-fetch might still be needed if other data dependencies exist
      // await fetchBusinessData(user.id); // Uncomment if a full re-fetch is desired
    }
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const fetchBusinessData = async (userId: string) => {
    const { data: businessProfile, error } = await supabase
      .from('business_profiles')
      .select('company_name, industry, website')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching business profile:', error);
      setIsRegistered(false);
    } else if (businessProfile) {
      setBusinessData({
        businessName: businessProfile.company_name || "",
        category: businessProfile.industry ? businessProfile.industry[0] : '',
        website: businessProfile.website || "",
        isRegistered: true,
        serviceType: "Online & Offline",
        location: "[Address]",
        priceRange: "₹5,000 - ₹50,000",
        accountManagement: "Select",
      });
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
      setBusinessData({
        businessName: "ABC company",
        category: "XYZ Products",
        website: "www.xyz.com",
        isRegistered: false,
        serviceType: "Online & Offline",
        location: "[Address]",
        priceRange: "₹5,000 - ₹50,000",
        accountManagement: "Select",
      });
    }
  };

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

      if (data.session.user?.id) {
        await fetchBusinessData(data.session.user.id);
      }

      setLoading(false);
    };

    checkUser();
  }, [navigate, user?.id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
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
              <h1 className="text-2xl font-bold text-foreground">{user?.email?.split('@')[0] || 'Username'}</h1>
              <p className="text-muted-foreground">{user?.email || 'username@gmail.com'}</p>
              
              <div className="flex gap-3 mt-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/10 hover:bg-pink-500/20 transition-colors cursor-pointer">
                  <Instagram className="h-5 w-5 text-pink-500" />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/10 hover:bg-blue-600/20 transition-colors cursor-pointer">
                  <Facebook className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/10 hover:bg-red-600/20 transition-colors cursor-pointer">
                  <Youtube className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400/10 hover:bg-blue-400/20 transition-colors cursor-pointer">
                  <Twitter className="h-5 w-5 text-blue-400" />
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3 flex-shrink-0">
                  <BusinessDetails 
                    businessName={businessData?.businessName || "ABC company"}
                    category={businessData?.category || "XYZ Products"}
                    serviceType={businessData?.serviceType || "Online & Offline"}
                    website={businessData?.website || "www.xyz.com"}
                    location={businessData?.location || "[Address]"}
                    isRegistered={businessData?.isRegistered ?? false}
                    onEdit={handleEdit}
                  />
                </div>

                <div className="md:w-2/3 flex-grow">
                  <Tabs defaultValue="services" className="w-full">
                    <div className="border-b border-border mb-6">
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
      {isEditing && businessData && (
        <BusinessEditModal 
          isOpen={isEditing}
          onClose={handleCancel}
          onSave={handleSave}
          initialData={businessData}
        />
      )}
    </div>
  );
};

export default BusinessProfile;
