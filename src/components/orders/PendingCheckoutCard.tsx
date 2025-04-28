
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Order } from '@/types/order';
import { BadgeCheck, BadgeX, Calendar, Clock } from 'lucide-react';

interface PendingCheckoutCardProps {
  order: Order;
  onCheckout: (order: Order) => void;
  onReject: (order: Order) => void;
}

export const PendingCheckoutCard: React.FC<PendingCheckoutCardProps> = ({
  order,
  onCheckout,
  onReject,
}) => {
  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{order.username}</span>
              {order.businessVerified ? (
                <BadgeCheck className="w-4 h-4 text-primary" />
              ) : (
                <BadgeX className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDate(order.date)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Scheduled Date:</span>
              <span className="text-foreground">{formatDate(order.scheduledDate || '')}</span>
            </div>
            {order.scheduledTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Scheduled Time:</span>
                <span className="text-foreground">{order.scheduledTime}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Category:</span>
              <span>{order.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Product/Service:</span>
              <span>{order.productService}</span>
            </div>
            {order.amount && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">₹{order.amount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button 
          variant="destructive" 
          className="w-full transition-colors hover:bg-destructive/90"
          onClick={() => onReject(order)}
        >
          Reject
        </Button>
        <Button 
          className="w-full transition-colors hover:bg-primary/90"
          onClick={() => onCheckout(order)}
        >
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};
