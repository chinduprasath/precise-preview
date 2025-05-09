
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ServiceOrder, ServiceOrderTeamMember } from '@/types/serviceOrder';

interface ServiceOrderEditProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (order: ServiceOrder) => void;
  teamMembers: ServiceOrderTeamMember[];
}

const ServiceOrderEdit: React.FC<ServiceOrderEditProps> = ({
  order,
  isOpen,
  onOpenChange,
  onSave,
  teamMembers
}) => {
  const [editedOrder, setEditedOrder] = React.useState<ServiceOrder | null>(null);

  React.useEffect(() => {
    if (order) {
      setEditedOrder({ ...order });
    }
  }, [order]);

  if (!editedOrder) return null;

  const handleSave = () => {
    onSave(editedOrder);
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof ServiceOrder, value: any) => {
    setEditedOrder({ ...editedOrder, [field]: value });
  };

  const handleAssignedToChange = (value: string) => {
    const selectedTeamMember = teamMembers.find(m => m.id === value);
    
    setEditedOrder({
      ...editedOrder,
      assignedTo: value,
      assignedTeamMember: selectedTeamMember
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service Order - {editedOrder.orderId}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serviceType" className="text-right">
              Service Type
            </Label>
            <Input
              id="serviceType"
              value={editedOrder.serviceTypeDisplay}
              className="col-span-3"
              disabled
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={editedOrder.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">
              Assign To
            </Label>
            <Select
              value={editedOrder.assignedTo || ''}
              onValueChange={handleAssignedToChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              rows={3}
              value={editedOrder.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="internalNotes" className="text-right">
              Internal Notes
            </Label>
            <Textarea
              id="internalNotes"
              className="col-span-3"
              rows={3}
              value={editedOrder.internalNotes || ''}
              onChange={(e) => handleInputChange('internalNotes', e.target.value)}
            />
          </div>

          {/* File upload UI would go here */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderEdit;
