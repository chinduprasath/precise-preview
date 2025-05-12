
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PendingOrder {
  id: string;
  brandName: string;
  influencerName: string;
  status: string;
  timestamp: string;
}

interface PendingOrdersProps {
  orders: PendingOrder[];
  onViewOrder: (orderId: string) => void;
  isLoading?: boolean;
}

const PendingOrders: React.FC<PendingOrdersProps> = ({ orders, onViewOrder, isLoading = false }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Pending Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/60 rounded animate-pulse" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Influencer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.brandName}</TableCell>
                  <TableCell>{order.influencerName}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'outline'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewOrder(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-sm font-medium text-foreground">No pending orders</h3>
            <p className="text-xs text-muted-foreground mt-1">
              All your orders are being processed
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingOrders;
