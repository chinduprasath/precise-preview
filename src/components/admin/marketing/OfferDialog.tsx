import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Youtube, Twitter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MarketingOffer, Platform } from './OfferCard';

const allPlatforms: Platform[] = ['instagram', 'youtube', 'facebook', 'twitter'];

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
};

interface OfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: MarketingOffer | null;
  onSave: (offer: Partial<MarketingOffer>) => void;
  mode: 'add' | 'edit';
}

const OfferDialog: React.FC<OfferDialogProps> = ({
  open,
  onOpenChange,
  offer,
  onSave,
  mode,
}) => {
  const [formData, setFormData] = useState<Partial<MarketingOffer>>({
    url: '',
    type: 'Story',
    message: '',
    duration: 24,
    durationUnit: 'hours',
    status: 'Inactive',
    platforms: ['instagram'],
  });

  useEffect(() => {
    if (offer && mode === 'edit') {
      setFormData({
        url: offer.url,
        type: offer.type,
        message: offer.message,
        duration: offer.duration,
        durationUnit: offer.durationUnit,
        status: offer.status,
        platforms: offer.platforms,
      });
    } else if (mode === 'add') {
      setFormData({
        url: '',
        type: 'Story',
        message: '',
        duration: 24,
        durationUnit: 'hours',
        status: 'Inactive',
        platforms: ['instagram'],
      });
    }
  }, [offer, mode, open]);

  const togglePlatform = (platform: Platform) => {
    const current = formData.platforms || [];
    if (current.includes(platform)) {
      if (current.length > 1) {
        setFormData({ ...formData, platforms: current.filter(p => p !== platform) });
      }
    } else {
      setFormData({ ...formData, platforms: [...current, platform] });
    }
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Offer' : 'Edit Offer'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">URL</label>
            <Input
              placeholder="https://instagram.com/p/..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          {/* Type and Platform Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as 'Story' | 'Collab' | 'Reshare' })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Story">Story</SelectItem>
                  <SelectItem value="Collab">Collab</SelectItem>
                  <SelectItem value="Reshare">Reshare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Platforms</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-background">
                    <div className="flex items-center gap-1">
                      {(formData.platforms || []).map(p => (
                        <span key={p} className="text-primary">{platformIcons[p]}</span>
                      ))}
                    </div>
                    <span className="text-muted-foreground ml-auto text-xs">
                      {(formData.platforms || []).length} selected
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-popover">
                  {allPlatforms.map(platform => (
                    <DropdownMenuCheckboxItem
                      key={platform}
                      checked={(formData.platforms || []).includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                    >
                      <span className="flex items-center gap-2 capitalize">
                        {platformIcons[platform]}
                        {platform}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Message / Instructions</label>
            <Textarea
              placeholder="Enter instructions for this offer..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>

          {/* Duration and Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Duration</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                  className="w-20"
                />
                <Select
                  value={formData.durationUnit}
                  onValueChange={(value) => setFormData({ ...formData, durationUnit: value as 'hours' | 'days' })}
                >
                  <SelectTrigger className="flex-1 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'Active' | 'Inactive' | 'Completed' })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === 'add' ? 'Add Offer' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDialog;
