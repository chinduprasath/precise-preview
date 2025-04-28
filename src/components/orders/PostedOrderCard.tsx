
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';
import { Plus } from 'lucide-react';

interface PostedOrderCardProps {
  order: Order;
  onNewOrder: () => void;
  onUpdate?: (order: Order) => void; // Make this prop optional
  userType?: 'business' | 'influencer';
}

export const PostedOrderCard: React.FC<PostedOrderCardProps> = ({
  order,
  onNewOrder,
  onUpdate,
  userType = 'business'
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(order);
    }
  };

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
        <Badge 
          variant={getStatusBadgeVariant(order.status)}
          className="w-full py-2 flex justify-center text-sm"
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
        {userType === 'influencer' && (
          <Button 
            className="w-full group"
            onClick={onNewOrder}
          >
            <Plus className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            New Order
          </Button>
        )}
        {onUpdate && (
          <Button 
            className="w-full group"
            onClick={handleUpdate}
            variant="outline"
          >
            Update
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
