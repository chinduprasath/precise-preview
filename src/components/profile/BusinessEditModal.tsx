import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface BusinessEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: {
    businessName: string;
    category: string;
    serviceType: string;
    website: string;
    location: string;
    isRegistered: boolean;
    priceRange: string;
    accountManagement: string;
  };
}

const BusinessEditModal: React.FC<BusinessEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      isRegistered: checked,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Business Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="businessName" className="text-right">
              Business Name
            </Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isRegistered" className="text-right">
              Business Status
            </Label>
            <Switch
              id="isRegistered"
              checked={formData.isRegistered}
              onCheckedChange={handleSwitchChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serviceType" className="text-right">
              Service Type
            </Label>
            <Input
              id="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priceRange" className="text-right">
              Price Range
            </Label>
            <Input
              id="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accountManagement" className="text-right">
              Account Management
            </Label>
            <select
              id="accountManagement"
              value={formData.accountManagement}
              onChange={handleSelectChange}
              className="col-span-3 border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm"
            >
              <option value="Select">Select</option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessEditModal; 