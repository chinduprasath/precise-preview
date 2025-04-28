
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Order } from '@/types/order';

interface PostedOrderCardProps {
  order: Order;
  onUpdate: (order: Order) => void;
  onNewOrder: () => void;
}

export const PostedOrderCard: React.FC<PostedOrderCardProps> = ({
  order,
  onUpdate,
  onNewOrder,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Order # <span className="text-primary">{order.orderNumber}</span>
            </div>
            <div className="text-sm text-muted-foreground">{order.date}</div>
          </div>
          <div className="text-sm">
            Order URL: <a href={order.url} className="text-primary hover:underline truncate">{order.url}</a>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onUpdate(order)}
        >
          Update Order
        </Button>
        <Button 
          className="w-full"
          onClick={onNewOrder}
        >
          New Order
        </Button>
      </CardFooter>
    </Card>
  );
};
