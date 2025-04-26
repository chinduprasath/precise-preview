
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import OrderCard from '@/components/orders/OrderCard';
import { orderData } from '@/data/orders';

const OrdersPage = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Orders</h1>
              <div className="flex gap-4 items-center">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  <p className="text-sm text-primary cursor-pointer">See More&gt;&gt;</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orderData.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
