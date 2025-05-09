
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Edit, FileText, Download, DownloadCloud } from 'lucide-react';
import { ServiceOrder } from '@/types/serviceOrder';
import { format } from 'date-fns';

interface ServiceOrderDetailProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (order: ServiceOrder) => void;
}

const ServiceOrderDetail: React.FC<ServiceOrderDetailProps> = ({
  order,
  isOpen,
  onOpenChange,
  onEdit
}) => {
  if (!order) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'secondary';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number | undefined, currency: string | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Order Details - {order.orderId}</span>
            <Badge variant={getStatusBadgeVariant(order.status)} className="ml-2">
              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Type:</span>
                <span className="font-medium">{order.serviceTypeDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned To:</span>
                <span className="font-medium">{order.assignedTeamMember?.name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{
                  order.amount 
                    ? formatCurrency(order.amount, order.currency) 
                    : 'Not specified'
                }</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Client Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{order.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{order.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Type:</span>
                <span className="font-medium capitalize">{order.userType}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Order Description</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
              {order.description || 'No description provided.'}
            </p>
          </div>

          {order.requirements && (
            <div>
              <h3 className="text-lg font-medium mb-2">Requirements</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {order.requirements}
              </p>
            </div>
          )}

          {order.internalNotes && (
            <div>
              <h3 className="text-lg font-medium mb-2">Internal Notes</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {order.internalNotes}
              </p>
            </div>
          )}
        </div>

        {order.files && order.files.length > 0 && (
          <>
            <Separator />
            <div className="py-4">
              <h3 className="text-lg font-medium mb-2">Attached Files</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.files.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center p-2 border rounded-md text-sm"
                  >
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                    <span className="truncate flex-1">{file.filename}</span>
                    <Button variant="ghost" size="icon" className="ml-2" title="Download file">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onEdit(order)} className="ml-2">
            <Edit className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderDetail;
