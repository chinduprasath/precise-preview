import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BarChart2, Users, DollarSign, FileText, Video, Film, PieChart } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import RequestsList from '@/components/dashboard/RequestsList';
import { InfluencerRequest, RequestStatus } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import MetricCard from '@/components/dashboard/MetricCard';
const InfluencerDashboard = () => {
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const {
    toast
  } = useToast();
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