
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { InfluencerRequest, RequestStatus } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';

const RequestsPage = () => {
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would be an API call to get the requests
    // For now, we'll use mock data
    const mockRequests: InfluencerRequest[] = [
      {
        id: '1',
        businessId: 'b1',
        businessName: 'Username#1',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Fashion Service',
        price: 800,
        status: 'pending',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      },
      {
        id: '2',
        businessId: 'b2',
        businessName: 'Username#1',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'ECommerce Products',
        price: 800,
        status: 'pending',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      },
      {
        id: '3',
        businessId: 'b3',
        businessName: 'Username#1',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Fashion Service',
        price: 800,
        status: 'pending',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      },
      {
        id: '4',
        businessId: 'b4',
        businessName: 'Username#1',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Fashion Service',
        price: 800,
        status: 'approved',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      },
      {
        id: '5',
        businessId: 'b5',
        businessName: 'Username#1',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Travel Content',
        price: 800,
        status: 'approved',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      },
      {
        id: '6',
        businessId: 'b6',
        businessName: 'Username#1',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Tech Product Review',
        price: 800,
        status: 'approved',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      },
      {
        id: '7',
        businessId: 'b7',
        businessName: 'Username#1',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Restaurant Promotion',
        price: 800,
        status: 'rejected',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      },
      {
        id: '8',
        businessId: 'b8',
        businessName: 'Username#1',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Food Delivery Ad',
        price: 800,
        status: 'rejected',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      }
    ];
    
    setRequests(mockRequests);
    // In a real app we could store this in localStorage like the other components do
  }, []);

  const handleAcceptRequest = (requestId: string) => {
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'approved' as RequestStatus, updatedAt: new Date().toISOString() } 
        : request
    );
    
    setRequests(updatedRequests);
    // In a real app, this would be an API call to update the request status
    
    toast({
      title: "Request Accepted",
      description: "You have accepted the request.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'rejected' as RequestStatus, updatedAt: new Date().toISOString() } 
        : request
    );
    
    setRequests(updatedRequests);
    // In a real app, this would be an API call to update the request status
    
    toast({
      title: "Request Rejected",
      description: "You have rejected the request.",
    });
  };

  // Filter requests by status
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const acceptedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Pending Requests Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Pending Requests</h2>
                <Button variant="link" size="sm" className="text-blue-600">
                  See More &gt;&gt;
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingRequests.map(request => (
                  <div key={request.id} className="bg-gray-100 rounded-lg p-4 shadow-sm">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Username:</div>
                        <div className="text-blue-600">{request.businessName}</div>
                        
                        <div>Ord Date/Time:</div>
                        <div className="text-blue-600">
                          {new Date(request.createdAt).toLocaleString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </div>
                        
                        <div>Scheduled Date:</div>
                        <div className="text-blue-600">Mon, 03/04/2025</div>
                        
                        <div>Scheduled Time:</div>
                        <div className="text-blue-600">03:35:00 AM</div>
                        
                        <div>Category:</div>
                        <div className="text-blue-600">Fashion</div>
                        
                        <div>Product/Service:</div>
                        <div className="text-blue-600">{request.description}</div>
                        
                        <div>Business:</div>
                        <div className="text-blue-600">Verified</div>
                        
                        <div>Amount:</div>
                        <div className="text-blue-600">${request.price}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </div>
                          Reject
                        </div>
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Accepted Requests Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Accepted</h2>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">May 19, 2025</span>
                  <ChevronRight className="h-5 w-5" />
                  <Button variant="link" size="sm" className="text-blue-600">
                    See More &gt;&gt;
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {acceptedRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="space-y-1">
                      <div className="grid grid-cols-2 gap-1">
                        <div>Username:</div>
                        <div className="text-blue-600">{request.businessName}</div>
                        
                        <div>Ord Date/Time:</div>
                        <div className="text-blue-600">
                          {new Date(request.createdAt).toLocaleString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right mt-2">
                      <Button variant="link" size="sm" className="text-xs text-blue-600">
                        See more details &gt;&gt;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rejected Requests Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Rejected</h2>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">May 19, 2025</span>
                  <ChevronRight className="h-5 w-5" />
                  <Button variant="link" size="sm" className="text-blue-600">
                    See More &gt;&gt;
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="space-y-1">
                      <div className="grid grid-cols-2 gap-1">
                        <div>Username:</div>
                        <div className="text-blue-600">{request.businessName}</div>
                        
                        <div>Ord Date/Time:</div>
                        <div className="text-blue-600">
                          {new Date(request.createdAt).toLocaleString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right mt-2">
                      <Button variant="link" size="sm" className="text-xs text-blue-600">
                        See more details &gt;&gt;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestsPage;
