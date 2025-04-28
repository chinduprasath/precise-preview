
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';

interface PendingRequestCardProps {
  order: Order;
  onAccept: (order: Order) => void;
  onReject: (order: Order) => void;
}

export const PendingRequestCard: React.FC<PendingRequestCardProps> = ({
  order,
  onAccept,
  onReject,
}) => {
  return (
    <Card className="w-full bg-gray-50 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Username:</p>
              <p className="font-medium">{order.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ord Date/Time:</p>
              <p className="font-medium">{order.orderDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Scheduled Date:</p>
              <p className="font-medium">{order.scheduledDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Scheduled Time:</p>
              <p className="font-medium">{order.scheduledTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category:</p>
              <p className="font-medium">{order.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Product/Service:</p>
              <p className="font-medium">{order.productService}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Business:</p>
              <Badge variant={order.businessVerified ? "success" : "secondary"}>
                {order.businessVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount:</p>
              <p className="font-medium">₹{order.amount}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button 
          variant="destructive" 
          onClick={() => onReject(order)}
        >
          Reject
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => onAccept(order)}
        >
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};
