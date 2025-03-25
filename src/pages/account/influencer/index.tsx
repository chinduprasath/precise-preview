
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import ProfileContent from '@/components/profile/ProfileContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

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

              {/* Social Stats */}
              <div className="mt-6 flex flex-wrap gap-8">
                <div className="flex flex-col items-center">
                  <div className="bg-pink-500 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <span className="mt-2 font-bold">1M</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </div>
                  <span className="mt-2 font-bold">235K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-red-600 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </div>
                  <span className="mt-2 font-bold">98K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-blue-400 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </div>
                  <span className="mt-2 font-bold">2M</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm text-gray-500">Total Campaigns</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm text-gray-500">Avg Likes</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm text-gray-500">Engagement</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm text-gray-500">Avg Comments</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm text-gray-500">Avg Shares</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm text-gray-500">Fake Followers</div>
                  </div>
                </Card>
              </div>

              {/* Network Stats */}
              <div className="mt-8">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUp className="text-blue-500" />
                    <span className="font-medium">Upload</span>
                    <span className="ml-auto text-gray-700 font-medium">5,03 mbps</span>
                  </div>
                  <div className="h-16 bg-gradient-to-b from-blue-50 to-white rounded-lg mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 25">
                        <path d="M0,15 Q10,10 20,15 T40,10 T60,20 T80,5 T100,15" fill="none" stroke="#3b82f6" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDown className="text-blue-300" />
                    <span className="font-medium">Download</span>
                    <span className="ml-auto text-gray-700 font-medium">14,34 mbps</span>
                  </div>
                  <div className="h-16 bg-gradient-to-b from-blue-50 to-white rounded-lg mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 25">
                        <path d="M0,10 Q10,20 20,5 T40,15 T60,5 T80,20 T100,10" fill="none" stroke="#93c5fd" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="text-green-500" />
                    <span className="font-medium">Ping</span>
                    <span className="ml-auto text-gray-700 font-medium">10 ms</span>
                  </div>
                  <div className="h-16 bg-gradient-to-b from-green-50 to-white rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 25">
                        <path d="M0,15 Q10,10 20,15 T40,10 T60,15 T80,5 T100,10" fill="none" stroke="#22c55e" strokeWidth="2"></path>
                        <path d="M0,15 Q10,10 20,15 T40,10 T60,15 T80,5 T100,10" fill="rgb(240, 253, 244, 0.5)"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="mt-8">
                <ProfileContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
