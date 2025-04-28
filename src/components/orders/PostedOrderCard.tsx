
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Order } from '@/types/order';
import { Edit, Plus } from 'lucide-react';

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
    <Card className="w-full transition-all hover:shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Order # <span className="text-primary">{order.orderNumber}</span>
            </div>
            <div className="text-sm text-muted-foreground">{order.date}</div>
          </div>
          {order.url && (
            <div className="text-sm">
              Order URL: <a href={order.url} className="text-primary hover:underline truncate">{order.url}</a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          className="w-full group hover:bg-accent"
          onClick={() => onUpdate(order)}
        >
          <Edit className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
          Update Order
        </Button>
        <Button 
          className="w-full group"
          onClick={onNewOrder}
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
          New Order
        </Button>
      </CardFooter>
    </Card>
  );
};
