
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';
import { PendingCheckoutCard } from '@/components/orders/PendingCheckoutCard';
import { PostedOrderCard } from '@/components/orders/PostedOrderCard';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';

const OrdersPage = () => {
  const { toast } = useToast();
  
  const { data: orders, isLoading } = useQuery({
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

  const pendingCheckoutOrders = orders?.filter(order => order.status === 'pending_checkout') || [];
  const postedOrders = orders?.filter(order => order.status === 'completed') || [];

  const handleCheckout = (order: Order) => {
    toast({
      title: "Checkout",
      description: `Processing checkout for order #${order.orderNumber}`,
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

  const handleNewOrder = () => {
    toast({
      title: "New Order",
      description: "Creating new order",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6">Pending Checkout Orders</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-[200px] bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : pendingCheckoutOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingCheckoutOrders.map((order) => (
                    <PendingCheckoutCard
                      key={order.id}
                      order={order}
                      onCheckout={handleCheckout}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No pending checkout orders</p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Posted Orders</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-[200px] bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : postedOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {postedOrders.map((order) => (
                    <PostedOrderCard
                      key={order.id}
                      order={order}
                      onUpdate={handleUpdate}
                      onNewOrder={handleNewOrder}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No posted orders</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
