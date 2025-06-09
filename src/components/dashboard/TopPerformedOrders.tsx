import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Instagram, Facebook, Youtube, Twitter, BarChart2 } from 'lucide-react';

interface OrderPerformance {
  id: string;
  title: string;
  platforms: string[];
  serviceTypes: string[];
  performanceScore: number;
  engagement: number;
  reach: number;
}

interface TopPerformedOrdersProps {
  orders: OrderPerformance[];
  isLoading?: boolean;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram key="instagram" className="h-4 w-4 text-pink-500" />;
    case 'facebook':
      return <Facebook key="facebook" className="h-4 w-4 text-blue-600" />;
    case 'youtube':
      return <Youtube key="youtube" className="h-4 w-4 text-red-600" />;
    case 'twitter':
      return <Twitter key="twitter" className="h-4 w-4 text-blue-400" />;
    default:
      return null;
  }
};

const getServiceTypeBadge = (type: string) => {
  const typeLower = type.toLowerCase();
  let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
  let className = "capitalize";

  switch (typeLower) {
    case 'video':
    case 'reel':
    case 'short':
      className = "bg-blue-100 text-blue-700 hover:bg-blue-100";
      break;
    case 'post':
      className = "bg-purple-100 text-purple-700 hover:bg-purple-100";
      break;
    case 'story':
      className = "bg-orange-100 text-orange-700 hover:bg-orange-100";
      break;
    default:
      className = "bg-gray-100 text-gray-700 hover:bg-gray-100";
      break;
  }

  return (
    <Badge key={type} variant={variant} className={className}>
      {type}
    </Badge>
  );
};

const TopPerformedOrders: React.FC<TopPerformedOrdersProps> = ({ orders, isLoading = false }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-primary" />
          Top Performed Orders
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
                <TableHead>Order</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.platforms.map(platform => getPlatformIcon(platform))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.serviceTypes.map(type => getServiceTypeBadge(type))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`font-medium ${order.performanceScore > 70 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {order.performanceScore}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <BarChart2 className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-sm font-medium text-foreground">No order data yet</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Complete orders to see performance metrics
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPerformedOrders;
