import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format, parse, isAfter, isBefore, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus } from '@/types/order';
import { orderData } from '@/data/orders';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Filter, RefreshCw, Calendar, Clock, FileText, Download } from 'lucide-react';
import DateTimePicker from '@/components/reach/DateTimePicker';
import { Card } from '@/components/ui/card';
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
                              <TableCell className="text-right space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(order);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
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
                              <TableCell className="text-right space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(order);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
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
      
      {/* Order Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="mt-1">
                      {selectedOrder.status === 'pending_checkout' ? 'Pending' : 'Completed'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{selectedOrder.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">₹{selectedOrder.amount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Type</p>
                    <p className="font-medium">{selectedOrder.orderType || 'Post'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Scheduled Information</p>
                  <div className="bg-muted p-3 rounded-md space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOrder.scheduledDate || 'Not scheduled'}</span>
                    </div>
                    {selectedOrder.scheduledTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedOrder.scheduledTime}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Product/Service</p>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium">Category: {selectedOrder.category || 'N/A'}</p>
                    <p className="text-sm mt-1">{selectedOrder.productService || 'N/A'}</p>
                  </div>
                </div>

                {/* Attached Files Section */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Attached Files</p>
                  <div className="bg-muted p-3 rounded-md">
                    {getAttachedFiles(selectedOrder).length > 0 ? (
                      <div className="space-y-2">
                        {getAttachedFiles(selectedOrder).map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-background rounded border">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Download file">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No files attached to this order.</p>
                    )}
                  </div>
                </div>
                
                {selectedOrder.url && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Media Links</p>
                    <div className="bg-muted p-3 rounded-md">
                      <a href={selectedOrder.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">
                        {selectedOrder.url}
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  {selectedOrder.status === 'pending_checkout' ? (
                    <>
                      <Button variant="outline" onClick={() => handleReject(selectedOrder)}>Reject</Button>
                      <Button onClick={() => handleCheckout(selectedOrder)}>Checkout</Button>
                    </>
                  ) : (
                    <Button onClick={() => handleUpdate(selectedOrder)}>Update Order</Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
