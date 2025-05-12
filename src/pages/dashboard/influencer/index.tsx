
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bell, BarChart2, Users, DollarSign, 
  FileText, Video, Film, PieChart, Eye 
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import RequestsList from '@/components/dashboard/RequestsList';
import { InfluencerRequest, RequestStatus } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import MetricCard from '@/components/dashboard/MetricCard';
import TopPerformedOrders from '@/components/dashboard/TopPerformedOrders';
import TopUsers from '@/components/dashboard/TopUsers';
import PendingOrders from '@/components/dashboard/PendingOrders';

const InfluencerDashboard = () => {
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const { toast } = useToast();
  
  // Mock data for our new components
  const [topPerformedOrders, setTopPerformedOrders] = useState([
    {
      id: '1',
      title: 'Spring Collection',
      platform: 'Instagram',
      serviceType: 'reel',
      performanceScore: 92,
      engagement: 8.5,
      reach: 45000
    },
    {
      id: '2',
      title: 'Tech Review',
      platform: 'Youtube',
      serviceType: 'video',
      performanceScore: 87,
      engagement: 6.2,
      reach: 32000
    },
    {
      id: '3',
      title: 'Fashion Haul',
      platform: 'Instagram',
      serviceType: 'post',
      performanceScore: 78,
      engagement: 5.1,
      reach: 28000
    },
    {
      id: '4',
      title: 'Product Unboxing',
      platform: 'Facebook',
      serviceType: 'video',
      performanceScore: 65,
      engagement: 3.8,
      reach: 15000
    },
    {
      id: '5',
      title: 'Lifestyle Tips',
      platform: 'Twitter',
      serviceType: 'post',
      performanceScore: 73,
      engagement: 4.2,
      reach: 19500
    }
  ]);
  
  const [topBusinessUsers, setTopBusinessUsers] = useState([
    {
      id: '1',
      name: 'Trendy Fashions',
      username: 'trendyfashions',
      profileImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=200',
      ordersCount: 18
    },
    {
      id: '2',
      name: 'Tech Gizmos',
      username: 'techgizmos',
      profileImage: 'https://images.unsplash.com/photo-1572059002053-8cc5ad2f4a38?q=80&w=200',
      ordersCount: 12
    },
    {
      id: '3',
      name: 'Beauty Brand',
      username: 'beautybrand',
      profileImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200',
      ordersCount: 9
    },
    {
      id: '4',
      name: 'Healthy Eats',
      username: 'healthyeats',
      profileImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=200',
      ordersCount: 7
    },
    {
      id: '5',
      name: 'Fitness Pro',
      username: 'fitnesspro',
      profileImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200',
      ordersCount: 5
    }
  ]);
  
  const [topInfluencers, setTopInfluencers] = useState([
    {
      id: '1',
      name: 'Priya Sharma',
      username: 'priyasharma',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      ordersCount: 24
    },
    {
      id: '2',
      name: 'Raj Malhotra',
      username: 'rajmalhotra',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      ordersCount: 21
    },
    {
      id: '3',
      name: 'Aisha Khan',
      username: 'aishakhan',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      ordersCount: 18
    },
    {
      id: '4',
      name: 'Vikram Patel',
      username: 'vikrampatel',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      ordersCount: 15
    },
    {
      id: '5',
      name: 'Neha Singh',
      username: 'nehasingh',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200',
      ordersCount: 13
    }
  ]);
  
  const [pendingOrders, setPendingOrders] = useState([
    {
      id: '1',
      brandName: 'Trendy Fashions',
      influencerName: 'Alex',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: '2',
      brandName: 'Tech Gizmos',
      influencerName: 'Alex',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
      id: '3',
      brandName: 'Beauty Brand',
      influencerName: 'Alex',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
    },
    {
      id: '4',
      brandName: 'Healthy Eats',
      influencerName: 'Alex',
      status: 'awaiting',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
  ]);
  
  useEffect(() => {
    // In a real app, we would fetch this from an API
    // For now, we'll use localStorage
    const storedRequests = JSON.parse(localStorage.getItem('influencerRequests') || '[]');

    // Type cast the status from string to RequestStatus
    const typedRequests = storedRequests.map((req: any) => ({
      ...req,
      status: req.status as RequestStatus
    }));
    setRequests(typedRequests);
  }, []);
  
  const handleApproveRequest = (requestId: string) => {
    const updatedRequests = requests.map(request => request.id === requestId ? {
      ...request,
      status: 'approved' as RequestStatus,
      updatedAt: new Date().toISOString()
    } : request);
    setRequests(updatedRequests);
    localStorage.setItem('influencerRequests', JSON.stringify(updatedRequests));
    toast({
      title: "Request Approved",
      description: "The business has been notified of your approval."
    });
  };
  
  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = requests.map(request => request.id === requestId ? {
      ...request,
      status: 'rejected' as RequestStatus,
      updatedAt: new Date().toISOString()
    } : request);
    setRequests(updatedRequests);
    localStorage.setItem('influencerRequests', JSON.stringify(updatedRequests));
    toast({
      title: "Request Rejected",
      description: "The business has been notified of your decision."
    });
  };
  
  const handleViewOrder = (orderId: string) => {
    toast({
      title: "Order Details",
      description: `Viewing details for order ${orderId}`
    });
    // In a real app, navigate to order details page or show a modal
  };

  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Influencer Dashboard</h1>
              <p className="text-gray-500">Welcome back, Alex! Here's what's happening with your account.</p>
            </div>
            
            {/* First row of metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <MetricCard title="Earnings (INR)" value="₹48,900" className="bg-white" valueClassName="text-primary">
                <DollarSign className="h-5 w-5 text-primary" />
              </MetricCard>
              
              <MetricCard title="Total Orders" value="24" className="bg-white" valueClassName="text-primary">
                <FileText className="h-5 w-5 text-primary" />
              </MetricCard>
              
              <MetricCard title="Active Campaigns" value="5/12" className="bg-white" valueClassName="text-primary">
                <BarChart2 className="h-5 w-5 text-primary" />
              </MetricCard>
              
              <MetricCard title="Connected Businesses" value="8" className="bg-white" valueClassName="text-primary">
                <Users className="h-5 w-5 text-primary" />
              </MetricCard>
            </div>
            
            {/* Second row of metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <MetricCard title="Total Posts" value="42" className="bg-white" valueClassName="text-primary">
                <FileText className="h-5 w-5 text-primary" />
              </MetricCard>
              
              <MetricCard title="Reels" value="18" className="bg-white" valueClassName="text-primary">
                <Film className="h-5 w-5 text-primary" />
              </MetricCard>
              
              <MetricCard title="Videos" value="14" className="bg-white" valueClassName="text-primary">
                <Video className="h-5 w-5 text-primary" />
              </MetricCard>
              
              <MetricCard title="Polls" value="10" className="bg-white" valueClassName="text-primary">
                <PieChart className="h-5 w-5 text-primary" />
              </MetricCard>
            </div>
            
            {/* Row 1 of our new design */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <TopPerformedOrders orders={topPerformedOrders} />
              </div>
              
              <div>
                <TopUsers 
                  users={topBusinessUsers} 
                  title="Top Business Users" 
                  userType="business"
                />
              </div>
            </div>
            
            {/* Row 2 of our new design */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <PendingOrders 
                  orders={pendingOrders} 
                  onViewOrder={handleViewOrder} 
                />
              </div>
              
              <div>
                <TopUsers 
                  users={topInfluencers} 
                  title="Top Influencers" 
                  userType="influencer"
                />
              </div>
            </div>
            
            {/* Service Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Service Requests</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/requests">View All</Link>
                  </Button>
                </div>
                
                <RequestsList requests={requests} onApprove={handleApproveRequest} onReject={handleRejectRequest} />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Campaign Calendar</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-medium text-primary">
                          {['10', '15', '22', '28'][i - 1]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{i === 1 ? 'Beauty Product Review' : i === 2 ? 'Fashion Haul Video' : i === 3 ? 'Sponsored Story' : 'Product Unboxing'}</p>
                        <p className="text-xs text-gray-500">Due: May {['10', '15', '22', '28'][i - 1]}, 2023</p>
                      </div>
                    </div>)}
                </div>
                
                <Button variant="outline" className="w-full mt-6">
                  View Full Calendar
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>;
};

export default InfluencerDashboard;
