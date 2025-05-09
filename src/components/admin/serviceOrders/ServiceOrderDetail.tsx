
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, ExternalLink, User, Calendar, Tag, FileText } from 'lucide-react';
import { ServiceOrder } from '@/types/serviceOrder';

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
  onEdit,
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.orderId}</span>
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service Info */}
          <div>
            <h3 className="text-lg font-semibold">Service Information</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Service Type:</span>
              </div>
              <div className="text-sm">{order.serviceTypeDisplay}</div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Order Date:</span>
              </div>
              <div className="text-sm">{format(new Date(order.orderDate), 'PPP')}</div>
              
              {order.assignedTeamMember && (
                <>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Assigned To:</span>
                  </div>
                  <div className="text-sm">{order.assignedTeamMember.name}</div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* User Info */}
          <div>
            <h3 className="text-lg font-semibold">User Information</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Name:</span>
              </div>
              <div className="text-sm">{order.userName}</div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">User Type:</span>
              </div>
              <div className="text-sm capitalize">{order.userType}</div>
              
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email:</span>
              </div>
              <div className="text-sm">{order.userEmail}</div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {order.description && (
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-sm mt-2 whitespace-pre-wrap">{order.description}</p>
            </div>
          )}

          {/* Requirements */}
          {order.requirements && (
            <div>
              <h3 className="text-lg font-semibold">Requirements</h3>
              <p className="text-sm mt-2 whitespace-pre-wrap">{order.requirements}</p>
            </div>
          )}

          {/* Internal Notes */}
          {order.internalNotes && (
            <div>
              <h3 className="text-lg font-semibold">Internal Notes</h3>
              <p className="text-sm mt-2 whitespace-pre-wrap">{order.internalNotes}</p>
            </div>
          )}

          {/* Files */}
          {order.files && order.files.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Files</h3>
              <div className="space-y-2 mt-2">
                {order.files.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/10"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{file.filename}</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onEdit(order)} className="mr-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderDetail;
