
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from '@/components/ui/tabs';
import DateTimePicker from '@/components/reach/DateTimePicker';
import { InfluencerRequest, RequestStatus, ServiceType } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Check, X, ChevronDown, Filter } from 'lucide-react';
import FilterDropdown from '@/components/filters/FilterDropdown';
import { format } from 'date-fns';

const RequestsPage = () => {
  // State
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<InfluencerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<InfluencerRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  
  // Filters
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<ServiceType | 'all'>('all');
  
  // UI state
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isOrderTypeFilterOpen, setIsOrderTypeFilterOpen] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is an influencer
    const userType = localStorage.getItem('userType');
    if (userType !== 'influencer') {
      toast({
        title: "Access Denied",
        description: "Only influencers can access the requests page.",
        variant: "destructive",
      });
      navigate('/dashboard/business');
      return;
    }
    
    // In a real app, this would be an API call to get the requests
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
        dateRequested: '2023-03-01T06:25:23.000Z',
        createdAt: '2023-03-01T06:25:23.000Z',
        updatedAt: '2023-03-01T06:25:23.000Z'
      },
      {
        id: '2',
        businessId: 'b2',
        businessName: 'Username#2',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'reel',
        platform: 'instagram',
        description: 'ECommerce Products',
        price: 950,
        status: 'pending',
        dateRequested: '2023-03-02T10:15:00.000Z',
        createdAt: '2023-03-02T10:15:00.000Z',
        updatedAt: '2023-03-02T10:15:00.000Z'
      },
      {
        id: '3',
        businessId: 'b3',
        businessName: 'Username#3',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'story',
        platform: 'instagram',
        description: 'Tech Product Review',
        price: 600,
        status: 'pending',
        dateRequested: '2023-03-03T12:30:00.000Z',
        createdAt: '2023-03-03T12:30:00.000Z',
        updatedAt: '2023-03-03T12:30:00.000Z'
      },
      {
        id: '4',
        businessId: 'b4',
        businessName: 'Username#4',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'video',
        platform: 'youtube',
        description: 'New Smartphone Unboxing',
        price: 1200,
        status: 'approved',
        dateRequested: '2023-03-04T14:45:00.000Z',
        createdAt: '2023-03-04T14:45:00.000Z',
        updatedAt: '2023-03-04T14:45:00.000Z'
      },
      {
        id: '5',
        businessId: 'b5',
        businessName: 'Username#5',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Travel Content',
        price: 850,
        status: 'approved',
        dateRequested: '2023-03-05T09:20:00.000Z',
        createdAt: '2023-03-05T09:20:00.000Z',
        updatedAt: '2023-03-05T09:20:00.000Z'
      },
      {
        id: '6',
        businessId: 'b6',
        businessName: 'Username#6',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'short',
        platform: 'tiktok',
        description: 'Dance Challenge',
        price: 500,
        status: 'approved',
        dateRequested: '2023-03-06T16:10:00.000Z',
        createdAt: '2023-03-06T16:10:00.000Z',
        updatedAt: '2023-03-06T16:10:00.000Z'
      },
      {
        id: '7',
        businessId: 'b7',
        businessName: 'Username#7',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'post',
        platform: 'instagram',
        description: 'Restaurant Promotion',
        price: 750,
        status: 'rejected',
        dateRequested: '2023-03-07T11:05:00.000Z',
        createdAt: '2023-03-07T11:05:00.000Z',
        updatedAt: '2023-03-07T11:05:00.000Z'
      },
      {
        id: '8',
        businessId: 'b8',
        businessName: 'Username#8',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'reel',
        platform: 'instagram',
        description: 'Food Delivery Ad',
        price: 900,
        status: 'rejected',
        dateRequested: '2023-03-08T13:40:00.000Z',
        createdAt: '2023-03-08T13:40:00.000Z',
        updatedAt: '2023-03-08T13:40:00.000Z'
      }
    ];
    
    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, [navigate, toast]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    let filtered = [...requests];
    
    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.createdAt);
        return requestDate >= startDate;
      });
    }
    
    if (endDate) {
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.createdAt);
        return requestDate <= endDate;
      });
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Filter by order type
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(request => request.serviceType === orderTypeFilter);
    }
    
    setFilteredRequests(filtered);
  }, [requests, startDate, endDate, statusFilter, orderTypeFilter]);

  const handleAcceptRequest = (requestId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'approved' as RequestStatus, updatedAt: new Date().toISOString() } 
        : request
    );
    
    setRequests(updatedRequests);
    
    toast({
      title: "Request Accepted",
      description: "You have accepted the request.",
      variant: "default",
    });
  };

  const handleRejectRequest = (requestId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'rejected' as RequestStatus, updatedAt: new Date().toISOString() } 
        : request
    );
    
    setRequests(updatedRequests);
    
    toast({
      title: "Request Rejected",
      description: "You have rejected the request.",
      variant: "destructive",
    });
  };
  
  const handleRowClick = (request: InfluencerRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };
  
  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatusFilter('all');
    setOrderTypeFilter('all');
  };
  
  // Filtered requests based on active tab
  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const acceptedRequests = filteredRequests.filter(req => req.status === 'approved');
  const rejectedRequests = filteredRequests.filter(req => req.status === 'rejected');

  const formatRequestDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd/yyyy hh:mm a');
  };
  
  const getServiceTypeLabel = (type: ServiceType) => {
    switch (type) {
      case 'post': return 'Post';
      case 'story': return 'Story';
      case 'reel': return 'Reel';
      case 'video': return 'Long Video';
      case 'short': return 'Short Video';
      default: return type;
    }
  };
  
  const getStatusBadge = (status: RequestStatus) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Paid</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Service Requests</h1>
              <p className="text-gray-500">Manage your service requests from businesses</p>
            </div>
            
            {/* Filters Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <DateTimePicker 
                  label="From Date" 
                  value={startDate} 
                  onChange={setStartDate} 
                  placeholder="Select start date"
                />
                
                <DateTimePicker 
                  label="To Date" 
                  value={endDate} 
                  onChange={setEndDate} 
                  placeholder="Select end date"
                />
                
                <div>
                  <FilterDropdown
                    label="Status"
                    value={statusFilter !== 'all' ? statusFilter : undefined}
                    placeholder="All Statuses"
                    onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                    isOpen={isStatusFilterOpen}
                    onClear={() => setStatusFilter('all')}
                  />
                  {isStatusFilterOpen && (
                    <div className="absolute mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setStatusFilter('all');
                          setIsStatusFilterOpen(false);
                        }}
                      >
                        All
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setStatusFilter('pending');
                          setIsStatusFilterOpen(false);
                        }}
                      >
                        Pending
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setStatusFilter('approved');
                          setIsStatusFilterOpen(false);
                        }}
                      >
                        Approved
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setStatusFilter('rejected');
                          setIsStatusFilterOpen(false);
                        }}
                      >
                        Rejected
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <FilterDropdown
                    label="Order Type"
                    value={orderTypeFilter !== 'all' ? getServiceTypeLabel(orderTypeFilter as ServiceType) : undefined}
                    placeholder="All Types"
                    onClick={() => setIsOrderTypeFilterOpen(!isOrderTypeFilterOpen)}
                    isOpen={isOrderTypeFilterOpen}
                    onClear={() => setOrderTypeFilter('all')}
                  />
                  {isOrderTypeFilterOpen && (
                    <div className="absolute mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setOrderTypeFilter('all');
                          setIsOrderTypeFilterOpen(false);
                        }}
                      >
                        All Types
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setOrderTypeFilter('post');
                          setIsOrderTypeFilterOpen(false);
                        }}
                      >
                        Post
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setOrderTypeFilter('story');
                          setIsOrderTypeFilterOpen(false);
                        }}
                      >
                        Story
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setOrderTypeFilter('reel');
                          setIsOrderTypeFilterOpen(false);
                        }}
                      >
                        Reel
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setOrderTypeFilter('video');
                          setIsOrderTypeFilterOpen(false);
                        }}
                      >
                        Long Video
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setOrderTypeFilter('short');
                          setIsOrderTypeFilterOpen(false);
                        }}
                      >
                        Short Video
                      </div>
                    </div>
                  )}
                </div>
                
                <Button variant="outline" onClick={resetFilters} className="self-end">
                  <Filter className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Tabs Section */}
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="pending" className="text-center">
                  Pending Requests <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="accepted" className="text-center">
                  Accepted <Badge variant="secondary" className="ml-2">{acceptedRequests.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-center">
                  Rejected <Badge variant="secondary" className="ml-2">{rejectedRequests.length}</Badge>
                </TabsTrigger>
              </TabsList>

              {/* Pending Requests Tab */}
              <TabsContent value="pending">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Number</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Order Date/Time</TableHead>
                          <TableHead>Scheduled Date</TableHead>
                          <TableHead>Order Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Business</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRequests.length > 0 ? (
                          pendingRequests.map((request) => (
                            <TableRow 
                              key={request.id}
                              onClick={() => handleRowClick(request)}
                              className="cursor-pointer hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">{request.id.substring(0, 8)}</TableCell>
                              <TableCell>{request.businessName}</TableCell>
                              <TableCell>{formatRequestDate(request.createdAt)}</TableCell>
                              <TableCell>{request.dateRequested ? formatRequestDate(request.dateRequested) : 'Not scheduled'}</TableCell>
                              <TableCell>{getServiceTypeLabel(request.serviceType)}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{request.description}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-blue-50 text-blue-600">Verified</Badge>
                              </TableCell>
                              <TableCell>₹{request.price}</TableCell>
                              <TableCell className="space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={(e) => handleRejectRequest(request.id, e)}
                                >
                                  <X className="w-4 h-4 mr-1" /> Reject
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={(e) => handleAcceptRequest(request.id, e)}
                                >
                                  <Check className="w-4 h-4 mr-1" /> Accept
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center">
                              No pending requests found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Accepted Requests Tab */}
              <TabsContent value="accepted">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Number</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Order Date/Time</TableHead>
                          <TableHead>Order Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {acceptedRequests.length > 0 ? (
                          acceptedRequests.map((request) => (
                            <TableRow 
                              key={request.id}
                              onClick={() => handleRowClick(request)}
                              className="cursor-pointer hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">{request.id.substring(0, 8)}</TableCell>
                              <TableCell>{request.businessName}</TableCell>
                              <TableCell>{formatRequestDate(request.createdAt)}</TableCell>
                              <TableCell>{getServiceTypeLabel(request.serviceType)}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{request.description}</TableCell>
                              <TableCell>₹{request.price}</TableCell>
                              <TableCell>{getStatusBadge(request.status)}</TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(request);
                                  }}
                                >
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              No accepted requests found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Rejected Requests Tab */}
              <TabsContent value="rejected">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Number</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Order Date/Time</TableHead>
                          <TableHead>Order Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedRequests.length > 0 ? (
                          rejectedRequests.map((request) => (
                            <TableRow 
                              key={request.id}
                              onClick={() => handleRowClick(request)}
                              className="cursor-pointer hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">{request.id.substring(0, 8)}</TableCell>
                              <TableCell>{request.businessName}</TableCell>
                              <TableCell>{formatRequestDate(request.createdAt)}</TableCell>
                              <TableCell>{getServiceTypeLabel(request.serviceType)}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{request.description}</TableCell>
                              <TableCell>₹{request.price}</TableCell>
                              <TableCell>{getStatusBadge(request.status)}</TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(request);
                                  }}
                                >
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              No rejected requests found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Order Detail Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Order Request Details</DialogTitle>
                  <DialogDescription>
                    Complete information about this service request
                  </DialogDescription>
                </DialogHeader>
                
                {selectedRequest && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Order ID:</span>
                          <span>{selectedRequest.id.substring(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Created:</span>
                          <span>{formatRequestDate(selectedRequest.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Scheduled:</span>
                          <span>{selectedRequest.dateRequested ? formatRequestDate(selectedRequest.dateRequested) : 'Not scheduled'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Status:</span>
                          <span>{getStatusBadge(selectedRequest.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Service Type:</span>
                          <span>{getServiceTypeLabel(selectedRequest.serviceType)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Platform:</span>
                          <span className="capitalize">{selectedRequest.platform}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Amount:</span>
                          <span className="font-semibold">₹{selectedRequest.price}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-2">Description</h3>
                      <p className="text-gray-700">{selectedRequest.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Business Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Username:</span>
                          <span>{selectedRequest.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Business ID:</span>
                          <span>{selectedRequest.businessId.substring(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Status:</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-600">Verified</Badge>
                        </div>
                      </div>
                      
                      {selectedRequest.status === 'pending' && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4">Actions</h3>
                          <div className="flex space-x-4">
                            <Button 
                              variant="outline" 
                              className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                              onClick={() => {
                                handleRejectRequest(selectedRequest.id);
                                setIsDetailsOpen(false);
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject Request
                            </Button>
                            <Button 
                              className="flex-1"
                              onClick={() => {
                                handleAcceptRequest(selectedRequest.id);
                                setIsDetailsOpen(false);
                              }}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Accept Request
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestsPage;
