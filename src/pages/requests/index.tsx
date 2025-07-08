
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from '@/components/ui/tabs';
import DateTimePicker from '@/components/reach/DateTimePicker';
import { InfluencerRequest, RequestStatus, ServiceType, ContentType } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Check, X, ChevronDown, Filter, FileText, Upload, BarChart, MapPin, Edit } from 'lucide-react';
import FilterDropdown from '@/components/filters/FilterDropdown';
import { format } from 'date-fns';

const RequestsPage = () => {
  // State
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<InfluencerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<InfluencerRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [customPrice, setCustomPrice] = useState<string>('');
  
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
        updatedAt: '2023-03-01T06:25:23.000Z',
        content: {
          type: 'upload_files',
          files: ['fashion-brief.pdf', 'brand-guidelines.jpg']
        }
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
        updatedAt: '2023-03-02T10:15:00.000Z',
        content: {
          type: 'provided_content',
          description: 'Create engaging reels showcasing our new product line with lifestyle shots and product features.'
        }
      },
      {
        id: '3',
        businessId: 'b3',
        businessName: 'Username#3',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'story',
        platform: 'twitter',
        description: 'Tech Product Review',
        price: 600,
        status: 'pending',
        dateRequested: '2023-03-03T12:30:00.000Z',
        createdAt: '2023-03-03T12:30:00.000Z',
        updatedAt: '2023-03-03T12:30:00.000Z',
        content: {
          type: 'polls',
          polls: [
            {
              id: '1',
              question: 'Which tech feature do you value most?',
              options: ['Battery Life', 'Camera Quality', 'Performance', 'Design']
            },
            {
              id: '2',
              question: "What's your budget range for smartphones?",
              options: ['Under $300', '$300-600', '$600-1000', 'Above $1000']
            }
          ]
        }
      },
      {
        id: '4',
        businessId: 'b4',
        businessName: 'Username#4',
        influencerId: 'i1',
        influencerName: 'Alex',
        serviceType: 'video',
        platform: ['instagram', 'youtube'],
        description: 'Visit our flagship store and create content showcasing the experience',
        price: 1200,
        status: 'approved',
        dateRequested: '2023-03-04T14:45:00.000Z',
        createdAt: '2023-03-04T14:45:00.000Z',
        updatedAt: '2023-03-04T14:45:00.000Z',
        content: {
          type: 'visit_promote',
          visitPromote: {
            venueName: 'TechHub Flagship Store',
            fullAddress: '123 Innovation Street, Tech District, Mumbai 400001',
            googleMapsLink: 'https://maps.google.com/tech-hub-store',
            affiliateLinks: [
              'https://techhub.com/ref/influencer123',
              'https://deals.techhub.com/special-offer'
            ]
          }
        }
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

  const formatPlatforms = (platform: string | string[]) => {
    if (Array.isArray(platform)) {
      return platform.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
    }
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch(type) {
      case 'upload_files':
        return <Upload className="w-4 h-4" />;
      case 'provided_content':
        return <FileText className="w-4 h-4" />;
      case 'polls':
        return <BarChart className="w-4 h-4" />;
      case 'visit_promote':
        return <MapPin className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getContentTypeLabel = (type: ContentType) => {
    switch(type) {
      case 'upload_files':
        return 'Upload Files';
      case 'provided_content':
        return 'Provided Content';
      case 'polls':
        return 'Polls';
      case 'visit_promote':
        return 'Visit & Promote';
      default:
        return 'Unknown';
    }
  };

  const handleModifyRequest = () => {
    toast({
      title: "Modification Request Sent",
      description: "Your modification request has been sent to the business.",
    });
    setIsDetailsOpen(false);
  };

  const handleAcceptWithCustomPrice = () => {
    if (!customPrice || parseInt(customPrice) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    if (selectedRequest) {
      const updatedRequests = requests.map(request => 
        request.id === selectedRequest.id 
          ? { 
              ...request, 
              status: 'approved' as RequestStatus, 
              price: parseInt(customPrice),
              updatedAt: new Date().toISOString() 
            } 
          : request
      );
      
      setRequests(updatedRequests);
      toast({
        title: "Request Accepted",
        description: `Request accepted with custom price ₹${customPrice}.`,
      });
      setIsDetailsOpen(false);
      setCustomPrice('');
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
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Order Request Details</DialogTitle>
                  <DialogDescription>
                    Complete information about this service request
                  </DialogDescription>
                </DialogHeader>
                
                {selectedRequest && (
                  <div className="space-y-6">
                    {/* Order Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                          <div className="space-y-3">
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
                              <span className="capitalize">{formatPlatforms(selectedRequest.platform)}</span>
                            </div>
                            {selectedRequest.content && (
                              <div className="flex justify-between">
                                <span className="font-medium">Content Type:</span>
                                <div className="flex items-center gap-2">
                                  {getContentTypeIcon(selectedRequest.content.type)}
                                  <span>{getContentTypeLabel(selectedRequest.content.type)}</span>
                                </div>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="font-medium">Amount:</span>
                              <span className="font-semibold text-lg">₹{selectedRequest.price}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                          <div className="space-y-3">
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
                        </CardContent>
                      </Card>
                    </div>

                    {/* Description */}
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                        <p className="text-gray-700">{selectedRequest.description}</p>
                      </CardContent>
                    </Card>

                    {/* Dynamic Content Based on Type */}
                    {selectedRequest.content && (
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            {getContentTypeIcon(selectedRequest.content.type)}
                            {getContentTypeLabel(selectedRequest.content.type)} Content
                          </h3>
                          
                          {/* Upload Files Content */}
                          {selectedRequest.content.type === 'upload_files' && selectedRequest.content.files && (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">Submitted Files:</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {selectedRequest.content.files.map((file, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    <Upload className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{file}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Provided Content */}
                          {selectedRequest.content.type === 'provided_content' && selectedRequest.content.description && (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">Content Details:</p>
                              <div className="p-3 bg-gray-50 rounded">
                                <p className="text-sm">{selectedRequest.content.description}</p>
                              </div>
                            </div>
                          )}

                          {/* Polls Content */}
                          {selectedRequest.content.type === 'polls' && selectedRequest.content.polls && (
                            <div className="space-y-4">
                              <p className="text-sm text-gray-600">Poll Questions:</p>
                              {selectedRequest.content.polls.map((poll, index) => (
                                <div key={poll.id} className="p-3 bg-gray-50 rounded">
                                  <p className="font-medium mb-2">Poll {index + 1}: {poll.question}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {poll.options.map((option, optIndex) => (
                                      <div key={optIndex} className="text-sm text-gray-600">
                                        • {option}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Visit & Promote Content */}
                          {selectedRequest.content.type === 'visit_promote' && selectedRequest.content.visitPromote && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedRequest.content.visitPromote.venueName && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Venue Name:</p>
                                    <p className="text-sm">{selectedRequest.content.visitPromote.venueName}</p>
                                  </div>
                                )}
                                {selectedRequest.content.visitPromote.fullAddress && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Address:</p>
                                    <p className="text-sm">{selectedRequest.content.visitPromote.fullAddress}</p>
                                  </div>
                                )}
                              </div>
                              {selectedRequest.content.visitPromote.googleMapsLink && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Google Maps Link:</p>
                                  <a 
                                    href={selectedRequest.content.visitPromote.googleMapsLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    {selectedRequest.content.visitPromote.googleMapsLink}
                                  </a>
                                </div>
                              )}
                              {selectedRequest.content.visitPromote.affiliateLinks && selectedRequest.content.visitPromote.affiliateLinks.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-2">Affiliate Links:</p>
                                  <div className="space-y-1">
                                    {selectedRequest.content.visitPromote.affiliateLinks.map((link, index) => (
                                      <a 
                                        key={index}
                                        href={link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block text-sm text-blue-600 hover:underline"
                                      >
                                        {link}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions Section */}
                    {selectedRequest.status === 'pending' && (
                      <Card>
                        <CardContent className="p-4">
                          {/* Upload Files & Polls - Simple Accept/Reject */}
                          {selectedRequest.content && (selectedRequest.content.type === 'upload_files' || selectedRequest.content.type === 'polls') && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Actions</h3>
                              <div className="flex gap-4">
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

                          {/* Provided Content & Visit Promote - Price Input + 3 Actions */}
                          {selectedRequest.content && (selectedRequest.content.type === 'provided_content' || selectedRequest.content.type === 'visit_promote') && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Actions</h3>
                              
                              {/* Custom Price Input */}
                              <div className="space-y-2">
                                <Label htmlFor="custom-price">Your Price (₹)</Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                  <Input
                                    id="custom-price"
                                    type="number"
                                    placeholder="Enter your price"
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(e.target.value)}
                                    className="pl-8"
                                    min="0"
                                  />
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                <Button 
                                  variant="outline" 
                                  className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 flex-1"
                                  onClick={handleModifyRequest}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Modify
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                                  onClick={() => {
                                    handleRejectRequest(selectedRequest.id);
                                    setIsDetailsOpen(false);
                                  }}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                                <Button 
                                  className="flex-1"
                                  onClick={customPrice ? handleAcceptWithCustomPrice : () => {
                                    handleAcceptRequest(selectedRequest.id);
                                    setIsDetailsOpen(false);
                                  }}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Accept
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Fallback for requests without content */}
                          {!selectedRequest.content && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Actions</h3>
                              <div className="flex gap-4">
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
                        </CardContent>
                      </Card>
                    )}
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
