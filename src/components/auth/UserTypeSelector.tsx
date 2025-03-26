
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface UserTypeSelectorProps {
  userType: 'business' | 'influencer' | 'admin';
  onUserTypeChange: (value: 'business' | 'influencer' | 'admin') => void;
}

const UserTypeSelector = ({ userType, onUserTypeChange }: UserTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label>Sign in as</Label>
      <RadioGroup 
        defaultValue="business" 
        value={userType}
        onValueChange={(value) => onUserTypeChange(value as 'business' | 'influencer' | 'admin')}
        className="grid grid-cols-3 gap-4"
      >
        <div className="flex items-center space-x-2 border border-border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="business" id="business" />
          <Label htmlFor="business" className="cursor-pointer">Business</Label>
        </div>
        <div className="flex items-center space-x-2 border border-border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="influencer" id="influencer" />
          <Label htmlFor="influencer" className="cursor-pointer">Influencer</Label>
        </div>
        <div className="flex items-center space-x-2 border border-border rounded-md p-3 hover:bg-accent cursor-pointer">
          <RadioGroupItem value="admin" id="admin" />
          <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeSelector;
