
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { orderData } from '@/data/orders';
import { PendingRequestCard } from '@/components/orders/PendingRequestCard';
import { StatusOrderCard } from '@/components/orders/StatusOrderCard';

const InfluencerOrdersPage = () => {
  const { toast } = useToast();
  
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

      return data as Order[];
    }
  });

  // Use mock data if API data is empty
  const orders = (apiOrders && apiOrders.length > 0) ? apiOrders : orderData;

  const pendingOrders = orders.filter(order => order.status === 'pending') || [];
  const acceptedOrders = orders.filter(order => order.status === 'accepted') || [];
  const rejectedOrders = orders.filter(order => order.status === 'rejected') || [];

  const handleAccept = (order: Order) => {
    toast({
      title: "Order Accepted",
      description: `Order #${order.id} has been accepted`,
    });
  };

  const handleReject = (order: Order) => {
    toast({
      title: "Order Rejected",
      description: `Order #${order.id} has been rejected`,
      variant: "destructive",
    });
  };

  const handleViewDetails = (order: Order) => {
    toast({
      title: "View Details",
      description: `Viewing details for order #${order.id}`,
    });
  };

  return (
    <Layout>
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Pending Requests</h2>
              <button className="text-sm text-blue-600 hover:underline">
                See More>>
              </button>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-[200px] bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : pendingOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingOrders.map((order) => (
                  <PendingRequestCard
                    key={order.id}
                    order={order}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No pending requests</p>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Accepted</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">May 19, 2025</span>
                <button className="text-sm text-blue-600 hover:underline">
                  See More>>
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-[200px] bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : acceptedOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedOrders.map((order) => (
                  <StatusOrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No accepted orders</p>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Rejected</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">May 19, 2025</span>
                <button className="text-sm text-blue-600 hover:underline">
                  See More>>
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-[200px] bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : rejectedOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rejectedOrders.map((order) => (
                  <StatusOrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No rejected orders</p>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default InfluencerOrdersPage;
