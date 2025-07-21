import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare, ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BusinessDetails from '@/components/profile/BusinessDetails';
import BusinessServicesTab from '@/components/profile/BusinessServicesTab';
import BusinessDataTab from '@/components/profile/BusinessDataTab';

const UserProfile = () => {
  const { userType, userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  // Mock user data - in real app, fetch based on userId
  const userData = {
    id: userId,
    name: userType === 'business' ? 'ABC Company' : 'John Doe',
    email: userType === 'business' ? 'contact@abccompany.com' : 'john.doe@example.com',
    username: userType === 'business' ? 'abccompany' : 'johndoe',
    profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  const businessData = {
    businessName: "ABC Company",
    category: "XYZ Products", 
    website: "www.abccompany.com",
    isRegistered: true,
    serviceType: "Online & Offline",
    location: "Mumbai, India",
    priceRange: "₹5,000 - ₹50,000",
    accountManagement: "Premium",
  };

  const handleBack = () => {
    navigate(-1);
  };

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
          {/* Back button */}
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-primary/60 to-primary"></div>
              <div className="absolute left-6 -bottom-12">
                <div className="rounded-full border-4 border-background overflow-hidden h-24 w-24 bg-background">
                  <img 
                    src={userData.profileImage}
                    alt={userData.name}
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
              <h1 className="text-2xl font-bold text-foreground">{userData.name}</h1>
              <p className="text-muted-foreground">{userData.email}</p>
              <p className="text-sm text-muted-foreground">@{userData.username}</p>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                {userType === 'business' ? (
                  <>
                    <div className="md:w-1/3 flex-shrink-0">
                      <BusinessDetails 
                        businessName={businessData.businessName}
                        category={businessData.category}
                        serviceType={businessData.serviceType}
                        website={businessData.website}
                        location={businessData.location}
                        isRegistered={businessData.isRegistered}
                        // No onEdit prop means read-only mode
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
                  </>
                ) : (
                  // Influencer profile content
                  <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="bg-accent/30 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4">About {userData.name}</h3>
                          <p className="text-muted-foreground">
                            Passionate content creator and influencer with a focus on lifestyle and technology. 
                            Creating engaging content for audiences across multiple platforms.
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="bg-accent/30 rounded-lg p-4">
                          <h4 className="font-medium mb-3">Statistics</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Followers</span>
                              <span className="text-sm font-medium">125K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Engagement</span>
                              <span className="text-sm font-medium">4.8%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Orders</span>
                              <span className="text-sm font-medium">42</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;