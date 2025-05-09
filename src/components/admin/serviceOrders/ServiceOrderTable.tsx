
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, FileText, Calendar } from "lucide-react";
import { ServiceOrder } from '@/types/serviceOrder';
import { formatDistanceToNow } from 'date-fns';

interface ServiceOrderTableProps {
  orders: ServiceOrder[];
  onViewOrder: (order: ServiceOrder) => void;
  onEditOrder: (order: ServiceOrder) => void;
}

const ServiceOrderTable: React.FC<ServiceOrderTableProps> = ({
  orders,
  onViewOrder,
  onEditOrder
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'secondary';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No service orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/10">
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{order.serviceTypeDisplay}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{order.userName}</span>
                    <span className="text-xs text-muted-foreground">{order.userType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span title={order.orderDate}>
                      {formatDistanceToNow(new Date(order.orderDate), { addSuffix: true })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.assignedTeamMember ? order.assignedTeamMember.name : 'Unassigned'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewOrder(order)} title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEditOrder(order)} title="Edit Order">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {order.files && order.files.length > 0 && (
                      <Button variant="ghost" size="icon" title={`${order.files.length} file(s) attached`}>
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceOrderTable;
