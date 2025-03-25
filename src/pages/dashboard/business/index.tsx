
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, Search, Users, BarChart2, DollarSign, 
  TrendingUp, Filter, CalendarDays
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ServiceRequests from '@/components/dashboard/ServiceRequests';
import { InfluencerRequest, RequestStatus } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const BusinessDashboard = () => {
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handlePayRequest = (requestId: string) => {
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'paid' as RequestStatus, updatedAt: new Date().toISOString() } 
        : request
    );
    
    setRequests(updatedRequests);
    localStorage.setItem('influencerRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully. The influencer has been notified.",
    });
    
    setTimeout(() => {
      const completedRequests = updatedRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'completed' as RequestStatus, updatedAt: new Date().toISOString() } 
          : request
      );
      
      setRequests(completedRequests);
      localStorage.setItem('influencerRequests', JSON.stringify(completedRequests));
      
      toast({
        title: "Campaign Completed",
        description: "The influencer has published your content. View analytics in the Reach page.",
      });
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Business Dashboard</h1>
                <p className="text-gray-500">Manage your influencer marketing campaigns</p>
              </div>
              <Button className="md:w-auto w-full" onClick={() => navigate('/influencers')}>
                <Plus className="mr-2 h-4 w-4" /> Find Influencers
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Requests</p>
                    <p className="text-2xl font-bold">
                      {requests.filter(req => req.status === 'pending' || req.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <BarChart2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Campaigns</p>
                    <p className="text-2xl font-bold">
                      {requests.filter(req => req.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Reach</p>
                    <p className="text-2xl font-bold">1.2M</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">
                      ${requests
                        .filter(req => req.status === 'paid' || req.status === 'completed')
                        .reduce((total, req) => total + req.price, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Service Requests</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
                    View All Orders
                  </Button>
                </div>
                
                <ServiceRequests 
                  requests={requests}
                  onPayRequest={handlePayRequest}
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Campaign Calendar</h2>
                  <Button variant="ghost" size="sm">
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {requests
                    .filter(req => req.status === 'paid' || req.status === 'completed')
                    .slice(0, 4)
                    .map((request, index) => (
                    <div key={request.id} className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-medium text-primary">
                          {new Date(request.updatedAt).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)} with {request.influencerName}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Platform: {request.platform.charAt(0).toUpperCase() + request.platform.slice(1)}</span>
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {requests.filter(req => req.status === 'paid' || req.status === 'completed').length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No active campaigns yet
                    </div>
                  )}
                </div>
                
                <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/orders')}>
                  View All Orders
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Campaign Performance</h2>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{
                          i === 1 ? 'Spring Collection Campaign' : 'Product Launch'
                        }</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          i === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {i === 1 ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{
                        i === 1 
                          ? 'Campaign with 5 fashion influencers to promote spring collection.' 
                          : 'Product launch campaign with tech influencers.'
                      }</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Engagement</p>
                          <p className="font-semibold">{i === 1 ? '4.5%' : '3.8%'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Impressions</p>
                          <p className="font-semibold">{i === 1 ? '1.2M' : '780K'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Clicks</p>
                          <p className="font-semibold">{i === 1 ? '24K' : '15K'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Conversions</p>
                          <p className="font-semibold">{i === 1 ? '2.3K' : '1.1K'}</p>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline">View Full Report</Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Spring Collection Campaign</p>
                      <p className="text-sm font-medium">$5,000 / $5,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Product Launch</p>
                      <p className="text-sm font-medium">$7,200 / $10,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Summer Campaign (Planned)</p>
                      <p className="text-sm font-medium">$0 / $8,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">Total Budget</p>
                      <p className="font-medium">$23,000</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Used</p>
                      <p>$12,200 (53.0%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessDashboard;
