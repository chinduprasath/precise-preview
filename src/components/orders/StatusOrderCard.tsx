
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';

interface StatusOrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export const StatusOrderCard: React.FC<StatusOrderCardProps> = ({
  order,
  onViewDetails,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="w-full bg-gray-50 hover:shadow-md transition-shadow">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Username:</p>
              <p className="font-medium">{order.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ord Date/Time:</p>
              <p className="font-medium">{order.orderDate}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
              {order.status}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(order)}
            >
              See more details >>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
