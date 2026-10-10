import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus } from '@/types/order';
import { getStoredOrders } from '@/data/orders';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, RefreshCw, ShoppingCart } from 'lucide-react';
import DateTimePicker from '@/components/reach/DateTimePicker';
import FilterDropdown from '@/components/filters/FilterDropdown';

// Define order types for business
const ORDER_TYPES = [
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
  { value: 'short_video', label: 'Short Video' },
  { value: 'long_video', label: 'Long Video' },
  { value: 'polls', label: 'Polls' },
  { value: 'visit_promote', label: 'Visit & Promote' },
  { value: 'combo_package', label: 'Combo Package' },
  { value: 'service', label: 'Service' }
];

// Define status options
const STATUS_OPTIONS = [
  { value: 'pending_checkout', label: 'Pending' },
  { value: 'completed', label: 'Completed' }
];

const BusinessOrdersPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter states
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: apiOrders, isLoading } = useQuery({
    queryKey: ['orders', 'business'],
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

  const orders = (apiOrders && apiOrders.length > 0) ? apiOrders : getStoredOrders();

  const filteredOrders = React.useMemo(() => {
    let filtered = [...orders];

    if (startDate) {
      filtered = filtered.filter(order => {
        try {
          const orderDate = parseISO(order.createdAt);
          return orderDate >= startDate;
        } catch {
          return true;
        }
      });
    }

    if (endDate) {
      filtered = filtered.filter(order => {
        try {
          const orderDate = parseISO(order.createdAt);
          return orderDate <= endDate;
        } catch {
          return true;
        }
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (orderTypeFilter) {
      filtered = filtered.filter(order => {
        const type = (order.orderType || '').toLowerCase();
        const contentTypeName = (order.contentTypeName || '').toLowerCase();
        const target = orderTypeFilter.toLowerCase();
        return type.includes(target) || contentTypeName.includes(target);
      });
    }

    return filtered;
  }, [orders, startDate, endDate, statusFilter, orderTypeFilter]);

  const handleCheckout = (order: Order) => {
    navigate('/checkout', {
      state: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.amount,
        productService: order.productService,
        category: order.category,
        orderType: order.orderType,
        influencer: order.influencer
      }
    });
  };

  const handleViewDetails = (order: Order) => {
    navigate(`/orders/${order.id}`);
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
    } catch {
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <span>Business Orders</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and track all your orders placed with influencers
                </p>
              </div>
              
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
            
            {isLoading ? (
              <div className="w-full h-72 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <ShoppingCart className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground font-medium">No business orders found.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
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
                          <TableCell className="font-medium text-foreground">{order.username}</TableCell>
                          <TableCell className="text-xs sm:text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</TableCell>
                          <TableCell>{order.scheduledDate || 'N/A'}</TableCell>
                          <TableCell>{order.scheduledTime || 'N/A'}</TableCell>
                          <TableCell className="font-medium">
                            <Badge variant="outline" className="text-xs">
                              {order.orderType === 'Service' || order.orderType === 'Service Order' || order.contentTypeName === 'Service' || order.content?.type === 'service_request'
                                ? 'Service'
                                : (order.contentTypeName || order.orderType || 'Post')}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.category || 'N/A'}</TableCell>
                          <TableCell>{order.productService || 'N/A'}</TableCell>
                          <TableCell className="font-bold text-foreground">₹{order.amount || 0}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status === 'pending_checkout' ? 'Pending' : order.status === 'completed' ? 'Completed' : order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {order.status === 'pending_checkout' && (
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
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(order);
                                }}
                              >
                                View Details
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessOrdersPage;
