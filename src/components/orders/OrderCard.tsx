
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusStyles = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-600',
          buttonText: 'Pending'
        };
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          buttonText: 'Completed'
        };
      case 'new':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-600',
          buttonText: 'New Order'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          buttonText: 'Unknown'
        };
    }
  };

  const statusStyles = getStatusStyles(order.status);

  return (
    <Card className="border border-gray-200 overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Order # <span className="text-blue-600">{order.orderNumber}</span></div>
          </div>
          <div className="text-sm text-gray-500">{order.date}</div>
          <div className="text-sm">
            Order URL: <a href={order.url} className="text-blue-600 hover:underline truncate">{order.url}</a>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">Update Order</Button>
        <Button 
          className={`${statusStyles.bg} ${statusStyles.text} border-none hover:bg-gray-100`}
          variant="outline" 
          size="sm"
        >
          {statusStyles.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
