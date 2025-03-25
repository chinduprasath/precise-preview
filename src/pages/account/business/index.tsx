import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare } from 'lucide-react';
import ProfileContent from '@/components/profile/ProfileContent';
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
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
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

            {/* Profile Info */}
            <div className="pt-16 px-6 pb-6">
              <h1 className="text-2xl font-bold">{user?.email?.split('@')[0] || 'Username'}</h1>
              <p className="text-gray-600">{user?.email || 'username@gmail.com'}</p>

              {/* Business Info */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Business Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-gray-600 mb-1">Business Name</p>
                    <p className="font-medium">ABC company</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Category</p>
                    <p className="font-medium">XYZ Products</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Service Type</p>
                    <p className="font-medium">Online & Offline</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Visit our site</p>
                    <p className="font-medium">www.xyz.com</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Location</p>
                    <p className="font-medium">[Address]</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Account Management</p>
                    <div className="flex items-center gap-2">
                      <select className="border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm">
                        <option>Select</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Your Activity</h2>
                  <select className="border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="h-48 bg-gradient-to-b from-blue-50 to-white rounded-lg relative">
                    {/* Simple chart visualization */}
                    <div className="absolute inset-0 flex items-end">
                      <div className="flex items-end h-full w-full px-4">
                        {[20, 40, 30, 60, 35, 55, 85].map((height, index) => <div key={index} className="flex-1 mx-1">
                            <div className="bg-blue-400 rounded-t-sm" style={{
                          height: `${height}%`
                        }}></div>
                          </div>)}
                      </div>
                    </div>
                    <div className="absolute bottom-0 w-full flex justify-between px-6 text-xs text-gray-500 py-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(item => <Card key={item} className="overflow-hidden">
                      <CardContent className="p-0">
                        <img src={`https://images.unsplash.com/photo-${1560000000000 + item * 100000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} alt={`Business image ${item}`} className="w-full h-32 object-cover" />
                      </CardContent>
                    </Card>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BusinessProfile;