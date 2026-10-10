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
  Tabs, TabsList, TabsTrigger, TabsContent 
} from '@/components/ui/tabs';
import DateTimePicker from '@/components/reach/DateTimePicker';
import { InfluencerRequest, RequestStatus } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, ArrowRight, Filter } from 'lucide-react';
import FilterDropdown from '@/components/filters/FilterDropdown';
import { format } from 'date-fns';
import { getStoredRequests, updateRequest } from '@/data/requests';

const ORDER_TYPES = [
  'Post Image/Video',
  'Reels/Shorts',
  'Story (Image/Video)',
  'In-Video Promotion (<10 min)',
  'Promotions (>10 min)',
  'Polls',
  'Visit & Promote'
];

const RequestsPage = () => {
  // State
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<InfluencerRequest[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  
  // Filters
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  
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
    
    const data = getStoredRequests();
    setRequests(data);
    setFilteredRequests(data);
  }, [navigate, toast]);

  const getOrderTypeDisplay = (request: InfluencerRequest) => {
    if (request.orderType) return request.orderType;
    if (request.content?.type === 'polls') return 'Polls';
    if (request.content?.type === 'visit_promote') return 'Visit & Promote';
    switch (request.serviceType) {
      case 'post': return 'Post Image/Video';
      case 'reel':
      case 'short': return 'Reels/Shorts';
      case 'story': return 'Story (Image/Video)';
      case 'video': return 'In-Video Promotion (<10 min)';
      default: return 'Post Image/Video';
    }
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    let filtered = [...requests];
    
    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(request => new Date(request.createdAt) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(request => new Date(request.createdAt) <= end);
    }
    
    // Filter by order type (matching Image 2 values or custom package name)
    if (orderTypeFilter !== 'all') {
      const target = orderTypeFilter.toLowerCase();
      filtered = filtered.filter(request => {
        const oType = getOrderTypeDisplay(request).toLowerCase();
        return oType === target || oType.includes(target);
      });
    }
    
    setFilteredRequests(filtered);
  }, [requests, startDate, endDate, orderTypeFilter]);

  const isRequestDeliveredFilled = (req: InfluencerRequest) => {
    if (req.deliveredService?.isFilled) return true;
    if (!req.deliveredService) return false;
    const { deliveryNotes, instagramUrl, youtubeUrl, facebookUrl, twitterUrl } = req.deliveredService;
    return Boolean(
      (deliveryNotes && deliveryNotes.trim().length > 0) ||
      (instagramUrl && instagramUrl.trim().length > 0) ||
      (youtubeUrl && youtubeUrl.trim().length > 0) ||
      (facebookUrl && facebookUrl.trim().length > 0) ||
      (twitterUrl && twitterUrl.trim().length > 0)
    );
  };

  const handleStatusFilterChange = (status: RequestStatus | 'all') => {
    setStatusFilter(status);
    setIsStatusFilterOpen(false);
    if (status === 'pending') {
      setActiveTab('pending');
    } else if (status === 'completed' || status === 'approved') {
      setActiveTab('completed');
    } else if (status === 'rejected') {
      setActiveTab('rejected');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'pending') {
      setStatusFilter('pending');
    } else if (tab === 'completed') {
      setStatusFilter('completed');
    } else if (tab === 'rejected') {
      setStatusFilter('rejected');
    }
  };

  const handleAcceptRequest = (requestId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    updateRequest(requestId, { status: 'approved' });
    const refreshed = getStoredRequests();
    setRequests(refreshed);
    
    toast({
      title: "Request Accepted",
      description: `Request #${requestId} accepted. You can now proceed to fulfill the order.`,
    });
  };

  const handleCompleteRequest = (requestId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const existingReq = requests.find(r => r.id === requestId);
    updateRequest(requestId, { 
      status: 'completed',
      deliveredService: {
        ...(existingReq?.deliveredService || {}),
        isFilled: true,
        completedAt: new Date().toISOString()
      }
    });
    const refreshed = getStoredRequests();
    setRequests(refreshed);
    
    toast({
      title: "Request Completed",
      description: `Request #${requestId} has been marked as completed and moved to Completed.`,
    });
  };
  
  const handleRowClick = (request: InfluencerRequest) => {
    navigate(`/requests/${request.id}`);
  };
  
  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatusFilter('all');
    setOrderTypeFilter('all');
    setIsStatusFilterOpen(false);
    setIsOrderTypeFilterOpen(false);
  };
  
  // Filtered requests based on active tab
  const pendingRequests = filteredRequests.filter(req => req.status === 'pending' || req.status === 'approved');
  const completedRequests = filteredRequests.filter(req => req.status === 'completed' || req.status === 'paid');
  const rejectedRequests = filteredRequests.filter(req => req.status === 'rejected');

  const formatRequestDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    try {
      return format(new Date(dateString), 'MM/dd/yyyy hh:mm a');
    } catch {
      return dateString;
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
            
            {/* Filters Section (Image 1) */}
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
                
                <div className="relative">
                  <FilterDropdown
                    label="Status"
                    value={statusFilter !== 'all' ? (statusFilter === 'approved' ? 'Accepted' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)) : undefined}
                    placeholder="All Statuses"
                    onClick={() => {
                      setIsStatusFilterOpen(!isStatusFilterOpen);
                      setIsOrderTypeFilterOpen(false);
                    }}
                    isOpen={isStatusFilterOpen}
                    onClear={() => handleStatusFilterChange('all')}
                  />
                  {isStatusFilterOpen && (
                    <div className="absolute mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-48 py-1">
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleStatusFilterChange('all')}
                      >
                        All Statuses
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleStatusFilterChange('pending')}
                      >
                        Pending
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleStatusFilterChange('approved')}
                      >
                        Accepted
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleStatusFilterChange('rejected')}
                      >
                        Rejected
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <FilterDropdown
                    label="Order Type"
                    value={orderTypeFilter !== 'all' ? orderTypeFilter : undefined}
                    placeholder="All Types"
                    onClick={() => {
                      setIsOrderTypeFilterOpen(!isOrderTypeFilterOpen);
                      setIsStatusFilterOpen(false);
                    }}
                    isOpen={isOrderTypeFilterOpen}
                    onClear={() => setOrderTypeFilter('all')}
                  />
                  {isOrderTypeFilterOpen && (
                    <div className="absolute mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-56 max-h-64 overflow-y-auto py-1">
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-xs text-muted-foreground uppercase border-b"
                        onClick={() => {
                          setOrderTypeFilter('all');
                          setIsOrderTypeFilterOpen(false);
                        }}
                      >
                        All Types
                      </div>
                      {ORDER_TYPES.map((type) => (
                        <div 
                          key={type}
                          className={`px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm ${
                            orderTypeFilter === type ? 'font-semibold text-primary bg-primary/5' : 'text-gray-700'
                          }`}
                          onClick={() => {
                            setOrderTypeFilter(type);
                            setIsOrderTypeFilterOpen(false);
                          }}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button variant="outline" onClick={resetFilters} className="self-end h-10">
                  <Filter className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Tabs Section */}
            <Tabs defaultValue="pending" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="pending" className="text-center font-medium">
                  Pending <Badge variant="secondary" className="ml-2 bg-muted/80">{pendingRequests.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-center font-medium">
                  Completed <Badge variant="secondary" className="ml-2 bg-muted/80">{completedRequests.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-center font-medium">
                  Rejected <Badge variant="secondary" className="ml-2 bg-muted/80">{rejectedRequests.length}</Badge>
                </TabsTrigger>
              </TabsList>

              {/* Pending Requests Tab */}
              <TabsContent value="pending">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/70 hover:bg-gray-50/70">
                          <TableHead className="font-semibold text-gray-700">Order Number</TableHead>
                          <TableHead className="font-semibold text-gray-700">Username</TableHead>
                          <TableHead className="font-semibold text-gray-700">Order Date/Time</TableHead>
                          <TableHead className="font-semibold text-gray-700">Scheduled Date</TableHead>
                          <TableHead className="font-semibold text-gray-700">Order Type</TableHead>
                          <TableHead className="font-semibold text-gray-700">Business name</TableHead>
                          <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                          <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRequests.length > 0 ? (
                          pendingRequests.map((request) => (
                            <TableRow 
                              key={request.id}
                              onClick={() => handleRowClick(request)}
                              className="cursor-pointer hover:bg-gray-50/80 transition-colors"
                            >
                              <TableCell className="font-medium text-foreground">#{request.id}</TableCell>
                              <TableCell className="font-medium text-gray-700">@{request.influencerName?.toLowerCase() || 'alex'}</TableCell>
                              <TableCell className="text-gray-600 text-xs sm:text-sm">{formatRequestDate(request.createdAt)}</TableCell>
                              <TableCell className="text-gray-600 text-xs sm:text-sm">{formatRequestDate(request.dateRequested)}</TableCell>
                              <TableCell className="font-semibold text-gray-900 text-xs sm:text-sm">{getOrderTypeDisplay(request)}</TableCell>
                              <TableCell className="font-medium text-gray-800">{request.businessName}</TableCell>
                              <TableCell className="font-bold text-gray-900">₹{request.price}</TableCell>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                {request.status === 'pending' ? (
                                  <Button 
                                    size="sm" 
                                    className="h-8 text-xs px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
                                    onClick={(e) => handleAcceptRequest(request.id, e)}
                                  >
                                    <Check className="w-3.5 h-3.5 mr-1" /> Accept
                                  </Button>
                                ) : isRequestDeliveredFilled(request) ? (
                                  <Button 
                                    size="sm" 
                                    className="h-8 text-xs px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
                                    onClick={(e) => handleCompleteRequest(request.id, e)}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 text-xs px-3 border-primary/40 text-primary hover:bg-primary/5 font-medium shadow-xs"
                                    onClick={() => navigate(`/requests/${request.id}`)}
                                  >
                                    Proceed <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                              No pending requests found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Completed Requests Tab */}
              <TabsContent value="completed">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/70 hover:bg-gray-50/70">
                          <TableHead className="font-semibold text-gray-700">Order Number</TableHead>
                          <TableHead className="font-semibold text-gray-700">Username</TableHead>
                          <TableHead className="font-semibold text-gray-700">Order Date/Time</TableHead>
                          <TableHead className="font-semibold text-gray-700">Scheduled Date</TableHead>
                          <TableHead className="font-semibold text-gray-700">Order Type</TableHead>
                          <TableHead className="font-semibold text-gray-700">Business name</TableHead>
                          <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                          <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedRequests.length > 0 ? (
                          completedRequests.map((request) => (
                            <TableRow 
                              key={request.id}
                              onClick={() => handleRowClick(request)}
                              className="cursor-pointer hover:bg-gray-50/80 transition-colors"
                            >
                              <TableCell className="font-medium text-foreground">#{request.id}</TableCell>
                              <TableCell className="font-medium text-gray-700">@{request.influencerName?.toLowerCase() || 'alex'}</TableCell>
                              <TableCell className="text-gray-600 text-xs sm:text-sm">{formatRequestDate(request.createdAt)}</TableCell>
                              <TableCell className="text-gray-600 text-xs sm:text-sm">{formatRequestDate(request.dateRequested)}</TableCell>
                              <TableCell className="font-semibold text-gray-900 text-xs sm:text-sm">{getOrderTypeDisplay(request)}</TableCell>
                              <TableCell className="font-medium text-gray-800">{request.businessName}</TableCell>
                              <TableCell className="font-bold text-gray-900">₹{request.price}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                                  Completed
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                              No completed requests found
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/70 hover:bg-gray-50/70">
                          <TableHead className="font-semibold text-gray-700">Order Number</TableHead>
                          <TableHead className="font-semibold text-gray-700">Username</TableHead>
                          <TableHead className="font-semibold text-gray-700">Order Date/Time</TableHead>
                          <TableHead className="font-semibold text-gray-700">Scheduled Date</TableHead>
                          <TableHead className="font-semibold text-gray-700">Order Type</TableHead>
                          <TableHead className="font-semibold text-gray-700">Business name</TableHead>
                          <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                          <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedRequests.length > 0 ? (
                          rejectedRequests.map((request) => (
                            <TableRow 
                              key={request.id}
                              onClick={() => handleRowClick(request)}
                              className="cursor-pointer hover:bg-gray-50/80 transition-colors"
                            >
                              <TableCell className="font-medium text-foreground">#{request.id}</TableCell>
                              <TableCell className="font-medium text-gray-700">@{request.influencerName?.toLowerCase() || 'alex'}</TableCell>
                              <TableCell className="text-gray-600 text-xs sm:text-sm">{formatRequestDate(request.createdAt)}</TableCell>
                              <TableCell className="text-gray-600 text-xs sm:text-sm">{formatRequestDate(request.dateRequested)}</TableCell>
                              <TableCell className="font-semibold text-gray-900 text-xs sm:text-sm">{getOrderTypeDisplay(request)}</TableCell>
                              <TableCell className="font-medium text-gray-800">{request.businessName}</TableCell>
                              <TableCell className="font-bold text-gray-900">₹{request.price}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-medium">
                                  Rejected
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestsPage;
