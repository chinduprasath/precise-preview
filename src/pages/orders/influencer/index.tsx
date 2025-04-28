
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';
import { PendingCheckoutCard } from '@/components/orders/PendingCheckoutCard';
import { PostedOrderCard } from '@/components/orders/PostedOrderCard';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { orderData } from '@/data/orders';

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

  const pendingCheckoutOrders = orders.filter(order => order.status === 'pending') || [];
  const postedOrders = orders.filter(order => order.status !== 'pending') || [];

  const handleNewOrder = () => {
    toast({
      title: "New Order",
      description: "Creating new order",
    });
  };

  const handleUpdate = (order: Order) => {
    toast({
      title: "Update Order",
      description: `Updating order #${order.orderNumber}`,
    });
  };

  return (
    <Layout>
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
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
                    onNewOrder={handleNewOrder}
                    userType="influencer"
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No posted orders</p>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default InfluencerOrdersPage;
