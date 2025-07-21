import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format, parse, isAfter, isBefore, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus, OrderContentType } from '@/types/order';
import { orderData } from '@/data/orders';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Filter, RefreshCw, Calendar, Clock, FileText, Download, Upload, BarChart, MapPin, Edit, X, ShoppingCart } from 'lucide-react';
import DateTimePicker from '@/components/reach/DateTimePicker';
import FilterDropdown from '@/components/filters/FilterDropdown';

// Define order types
const ORDER_TYPES = [
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
  { value: 'short_video', label: 'Short Video' },
  { value: 'long_video', label: 'Long Video' },
  { value: 'polls', label: 'Polls' },
  { value: 'combo_package', label: 'Combo Package' }
];

// Define status options
const STATUS_OPTIONS = [
  { value: 'pending_checkout', label: 'Pending' },
  { value: 'completed', label: 'Completed' }
];

const OrdersPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [modifyPrice, setModifyPrice] = useState('');
  const [modifyDate, setModifyDate] = useState('');
  
  // Filter states
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: apiOrders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedData: Order[] = data.map((item: any) => ({
        id: item.id,
        orderNumber: item.order_number,
        date: item.date,
        url: item.url,
        status: item.status as OrderStatus,
        scheduledDate: item.scheduled_date,
        scheduledTime: item.scheduled_time,
        category: item.category,
        productService: item.product_service,
        orderType: item.order_type || 'post',
        businessVerified: item.business_verified,
        username: item.username,
        amount: item.amount,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      return transformedData;
    },
    refetchOnWindowFocus: false
  });

  const orders = (apiOrders && apiOrders.length > 0) ? apiOrders : orderData;

  const filteredOrders = React.useMemo(() => {
    let filtered = [...orders];

    if (activeTab === 'pending') {
      filtered = filtered.filter(order => order.status === 'pending_checkout');
    } else {
      filtered = filtered.filter(order => order.status === 'completed');
    }

    if (startDate) {
      filtered = filtered.filter(order => {
        const orderDate = parseISO(order.createdAt);
        return isAfter(orderDate, startDate) || orderDate.getTime() === startDate.getTime();
      });
    }

    if (endDate) {
      filtered = filtered.filter(order => {
        const orderDate = parseISO(order.createdAt);
        return isBefore(orderDate, endDate) || orderDate.getTime() === endDate.getTime();
      });
    }

    if (statusFilter && ((statusFilter === 'pending_checkout' && activeTab !== 'pending') || 
        (statusFilter === 'completed' && activeTab !== 'completed'))) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (orderTypeFilter) {
      filtered = filtered.filter(order => order.orderType === orderTypeFilter);
    }

    return filtered;
  }, [orders, activeTab, startDate, endDate, statusFilter, orderTypeFilter]);

  const handleCheckout = (order: Order) => {
    navigate('/checkout', { 
      state: { order }
    });
  };

  const handleReject = (order: Order) => {
    toast({
      title: "Reject Order",
      description: `Rejecting order #${order.orderNumber}`,
      variant: "destructive",
    });
  };

  const handleUpdate = (order: Order) => {
    toast({
      title: "Update Order",
      description: `Updating order #${order.orderNumber}`,
    });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatusFilter('');
    setOrderTypeFilter('');
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy, HH:mm');
    } catch (e) {
      return dateStr || 'N/A';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending_checkout':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Helper functions for content type display
  const getContentTypeIcon = (type: OrderContentType) => {
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

  const getContentTypeLabel = (type: OrderContentType) => {
    switch(type) {
      case 'upload_files':
        return 'Uploaded Files';
      case 'provided_content':
        return 'Provided Content';
      case 'polls':
        return 'Poll Details';
      case 'visit_promote':
        return 'Visit & Promote Details';
      default:
        return 'Content';
    }
  };

  // Generate dummy content for testing
  const getDummyContent = (order: Order) => {
    const orderIdNum = parseInt(order.id) || 1;
    const contentTypes: OrderContentType[] = ['upload_files', 'provided_content', 'polls', 'visit_promote'];
    const selectedType = contentTypes[orderIdNum % contentTypes.length];

    switch(selectedType) {
      case 'upload_files':
        return {
          type: 'upload_files' as OrderContentType,
          files: [
            { id: '1', name: 'brand-logo.jpg', type: 'image/jpeg', size: '2.4 MB', url: '#' },
            { id: '2', name: 'product-catalog.pdf', type: 'application/pdf', size: '5.1 MB', url: '#' },
            { id: '3', name: 'content-brief.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '456 KB', url: '#' }
          ]
        };
      case 'provided_content':
        return {
          type: 'provided_content' as OrderContentType,
          description: 'Create engaging content showcasing our new summer collection. Focus on lifestyle shots with natural lighting. Include call-to-action for our seasonal sale (20% off). Target audience: young professionals aged 25-35. Brand tone: trendy, approachable, and sustainable.'
        };
      case 'polls':
        return {
          type: 'polls' as OrderContentType,
          polls: [
            {
              id: '1',
              question: 'What\'s your favorite season for fashion?',
              options: ['Spring', 'Summer', 'Fall', 'Winter']
            },
            {
              id: '2',
              question: 'Which style do you prefer?',
              options: ['Casual', 'Formal', 'Streetwear', 'Bohemian']
            }
          ]
        };
      case 'visit_promote':
        return {
          type: 'visit_promote' as OrderContentType,
          visitDetails: {
            preferredDates: ['2024-03-15', '2024-03-16', '2024-03-17'],
            timeSlot: '10:00 AM - 2:00 PM',
            location: 'Flagship Store, Mumbai - Bandra West, Plot 123, Linking Road',
            offers: {
              food: true,
              travel: true,
              stay: false,
              other: ['Free merchandise worth ₹2000', 'VIP store tour', 'Meet with brand ambassador']
            }
          }
        };
      default:
        return undefined;
    }
  };

  // Mock attached files for demonstration
  const getAttachedFiles = (order: Order) => {
    // In a real app, this would come from the order data
    // For now, we'll simulate some files based on order type
    const mockFiles = [
      { id: '1', name: 'product-image.jpg', type: 'image/jpeg', size: '2.4 MB' },
      { id: '2', name: 'brand-guidelines.pdf', type: 'application/pdf', size: '1.2 MB' },
      { id: '3', name: 'content-brief.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '456 KB' }
    ];
    
    // Return a subset based on order ID to simulate variety
    const orderIdNum = parseInt(order.id) || 1;
    return mockFiles.slice(0, (orderIdNum % 3) + 1);
  };

  const handleModify = () => {
    setIsModifyMode(true);
    if (selectedOrder) {
      setModifyPrice(selectedOrder.amount?.toString() || '');
      setModifyDate(selectedOrder.scheduledDate || '');
    }
  };

  const handleSaveModification = () => {
    toast({
      title: "Order Modified",
      description: "Order details have been updated successfully.",
    });
    setIsModifyMode(false);
    setIsDetailOpen(false);
  };

  const handleCancelModification = () => {
    setIsModifyMode(false);
    setModifyPrice('');
    setModifyDate('');
  };

  const isInfluencer = localStorage.getItem('userType') === 'influencer';

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <h1 className="text-2xl font-bold">Orders</h1>
              
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(startDate || endDate || statusFilter || orderTypeFilter) && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {isFilterOpen && (
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <DateTimePicker 
                    value={startDate} 
                    onChange={setStartDate} 
                    label="From Date"
                    placeholder="Select start date"
                  />
                  
                  <DateTimePicker 
                    value={endDate} 
                    onChange={setEndDate} 
                    label="To Date"
                    placeholder="Select end date"
                  />
                  
                  <div>
                    <FilterDropdown
                      label="Status"
                      placeholder="Select status"
                      value={STATUS_OPTIONS.find(s => s.value === statusFilter)?.label || ''}
                      onClick={() => {
                        const nextStatus = statusFilter === 'pending_checkout' 
                          ? 'completed' 
                          : statusFilter === 'completed' 
                            ? '' 
                            : 'pending_checkout';
                        setStatusFilter(nextStatus);
                      }}
                      onClear={() => setStatusFilter('')}
                    />
                  </div>
                  
                  <div>
                    <FilterDropdown
                      label="Order Type"
                      placeholder="Select type"
                      value={ORDER_TYPES.find(t => t.value === orderTypeFilter)?.label || ''}
                      onClick={() => {
                        const types = ORDER_TYPES.map(t => t.value);
                        const currentIndex = types.indexOf(orderTypeFilter);
                        const nextIndex = currentIndex === types.length - 1 ? -1 : currentIndex + 1;
                        setOrderTypeFilter(nextIndex === -1 ? '' : types[nextIndex]);
                      }}
                      onClear={() => setOrderTypeFilter('')}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </Card>
            )}
            
            <Tabs 
              defaultValue="pending" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'pending' | 'completed')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                <TabsTrigger value="completed">Completed Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                {isLoading ? (
                  <div className="w-full h-72 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No pending orders found.</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Scheduled Date</TableHead>
                            <TableHead>Scheduled Time</TableHead>
                            <TableHead>Order Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Product/Service</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow 
                              key={order.id} 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleViewDetails(order)}
                            >
                              <TableCell>{order.username}</TableCell>
                              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                              <TableCell>{order.scheduledDate || 'N/A'}</TableCell>
                              <TableCell>{order.scheduledTime || 'N/A'}</TableCell>
                              <TableCell>{order.orderType || 'Post'}</TableCell>
                              <TableCell>{order.category || 'N/A'}</TableCell>
                              <TableCell>{order.productService || 'N/A'}</TableCell>
                              <TableCell>₹{order.amount || 0}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                  {order.status === 'pending_checkout' ? 'Pending' : 'Completed'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReject(order);
                                    }}
                                  >
                                    Reject
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCheckout(order);
                                    }}
                                  >
                                    Checkout
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {isLoading ? (
                  <div className="w-full h-72 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No completed orders found.</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Scheduled Date</TableHead>
                            <TableHead>Scheduled Time</TableHead>
                            <TableHead>Order Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Product/Service</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow 
                              key={order.id} 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleViewDetails(order)}
                            >
                              <TableCell>{order.username}</TableCell>
                              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                              <TableCell>{order.scheduledDate || 'N/A'}</TableCell>
                              <TableCell>{order.scheduledTime || 'N/A'}</TableCell>
                              <TableCell>{order.orderType || 'Post'}</TableCell>
                              <TableCell>{order.category || 'N/A'}</TableCell>
                              <TableCell>{order.productService || 'N/A'}</TableCell>
                              <TableCell>₹{order.amount || 0}</TableCell>
                              <TableCell>
                                <Badge variant="success">Completed</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdate(order);
                                  }}
                                >
                                  Update
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Enhanced Order Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={(open) => {
        setIsDetailOpen(open);
        if (!open) {
          setIsModifyMode(false);
          setModifyPrice('');
          setModifyDate('');
        }
      }}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Order ID:</span>
                      <span>{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                        {selectedOrder.status === 'pending_checkout' ? 'Pending' : 'Completed'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Username:</span>
                      <span>{selectedOrder.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Type:</span>
                      <span className="capitalize">{selectedOrder.orderType || 'Post'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span>{formatDateTime(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Amount:</span>
                      {isModifyMode ? (
                        <div className="flex items-center gap-2">
                          <span>₹</span>
                          <Input
                            type="number"
                            value={modifyPrice}
                            onChange={(e) => setModifyPrice(e.target.value)}
                            className="w-20 h-8"
                            min="0"
                          />
                        </div>
                      ) : (
                        <span className="font-semibold text-lg">₹{selectedOrder.amount || 0}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Schedule & Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Scheduled Date:</span>
                      {isModifyMode ? (
                        <Input
                          type="date"
                          value={modifyDate}
                          onChange={(e) => setModifyDate(e.target.value)}
                          className="w-32 h-8"
                        />
                      ) : (
                        <span>{selectedOrder.scheduledDate || 'Not scheduled'}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Scheduled Time:</span>
                      <span>{selectedOrder.scheduledTime || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Category:</span>
                      <span>{selectedOrder.category || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Product/Service:</span>
                      <p className="text-sm mt-1 text-muted-foreground">{selectedOrder.productService || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dynamic Content Type Display */}
              {(() => {
                const dummyContent = getDummyContent(selectedOrder);
                const contentType = dummyContent?.type;
                
                if (!dummyContent || !contentType) return null;

                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getContentTypeIcon(contentType)}
                        {getContentTypeLabel(contentType)}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {contentType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Upload Files Content */}
                      {contentType === 'upload_files' && dummyContent.files && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Uploaded Files</p>
                            <Button variant="outline" size="sm" className="ml-auto text-xs">
                              UPLOAD FILES
                            </Button>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-3">
                            Uploaded Media & Documents:
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {dummyContent.files.map((file) => (
                              <div key={file.id} className="relative bg-accent/30 rounded-lg p-4 border border-border hover:bg-accent/50 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      {file.type.startsWith('image/') ? (
                                        <Upload className="h-6 w-6 text-primary" />
                                      ) : file.name.toLowerCase().includes('.pdf') ? (
                                        <FileText className="h-6 w-6 text-red-500" />
                                      ) : (
                                        <FileText className="h-6 w-6 text-blue-500" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-sm truncate">{file.name}</p>
                                      <p className="text-xs text-muted-foreground">{file.size}</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Provided Content */}
                      {contentType === 'provided_content' && dummyContent.description && (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">Content Brief:</p>
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm leading-relaxed">{dummyContent.description}</p>
                          </div>
                        </div>
                      )}

                      {/* Polls Content */}
                      {contentType === 'polls' && dummyContent.polls && (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">Poll Questions for Twitter:</p>
                          {dummyContent.polls.map((poll, index) => (
                            <div key={poll.id} className="p-4 bg-muted rounded-lg space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">Poll {index + 1}</Badge>
                                <p className="font-medium">{poll.question}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {poll.options.map((option, optIndex) => (
                                  <div key={optIndex} className="flex items-center gap-2 p-2 bg-background rounded border">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span className="text-sm">{option}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Visit & Promote Content */}
                      {contentType === 'visit_promote' && dummyContent.visitDetails && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dummyContent.visitDetails.preferredDates && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Preferred Dates:</p>
                                <div className="space-y-1">
                                  {dummyContent.visitDetails.preferredDates.map((date, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span>{format(new Date(date), 'MMM dd, yyyy')}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {dummyContent.visitDetails.timeSlot && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Time Slot:</p>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{dummyContent.visitDetails.timeSlot}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {dummyContent.visitDetails.location && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Location:</p>
                              <div className="flex items-start gap-2 p-3 bg-background rounded border">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span className="text-sm">{dummyContent.visitDetails.location}</span>
                              </div>
                            </div>
                          )}

                          {dummyContent.visitDetails.offers && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Offers Included:</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                {dummyContent.visitDetails.offers.food && (
                                  <Badge variant="outline" className="justify-center">🍽️ Food</Badge>
                                )}
                                {dummyContent.visitDetails.offers.travel && (
                                  <Badge variant="outline" className="justify-center">✈️ Travel</Badge>
                                )}
                                {dummyContent.visitDetails.offers.stay && (
                                  <Badge variant="outline" className="justify-center">🏨 Stay</Badge>
                                )}
                              </div>
                              {dummyContent.visitDetails.offers.other && dummyContent.visitDetails.offers.other.length > 0 && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Additional Offers:</p>
                                  <div className="space-y-1">
                                    {dummyContent.visitDetails.offers.other.map((offer, index) => (
                                      <div key={index} className="text-sm p-2 bg-background rounded border">
                                        • {offer}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  {selectedOrder.status === 'pending_checkout' ? (
                    <div className="flex justify-end gap-3">
                      {isModifyMode ? (
                        <>
                          <Button variant="outline" onClick={handleCancelModification}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveModification}>
                            <Edit className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="destructive" 
                            onClick={() => {
                              handleReject(selectedOrder);
                              setIsDetailOpen(false);
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleModify}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modify
                          </Button>
                          <Button 
                            onClick={() => {
                              handleCheckout(selectedOrder);
                              setIsDetailOpen(false);
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Checkout
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button onClick={() => handleUpdate(selectedOrder)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Order
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
