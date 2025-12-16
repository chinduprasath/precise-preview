import React, { useState } from 'react';
import { Plus, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OfferCard, { MarketingOffer, Platform } from './OfferCard';
import OfferDialog from './OfferDialog';
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

const allPlatforms: Platform[] = ['instagram', 'youtube', 'facebook', 'twitter'];

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
};

const initialOffers: MarketingOffer[] = [
  {
    id: '1',
    url: 'https://instagram.com/p/example1',
    type: 'Story',
    message: 'Share our summer collection with your followers!',
    duration: 24,
    durationUnit: 'hours',
    status: 'Active',
    platforms: ['instagram'],
    createdAt: new Date('2024-12-10T10:30:00'),
  },
  {
    id: '2',
    url: 'https://youtube.com/watch?v=example2',
    type: 'Collab',
    message: 'Create a collab post featuring our new product line.',
    duration: 3,
    durationUnit: 'days',
    status: 'Inactive',
    platforms: ['youtube', 'instagram'],
    createdAt: new Date('2024-12-08T14:15:00'),
  },
];

const PostOfferTab: React.FC = () => {
  const [offers, setOffers] = useState<MarketingOffer[]>(initialOffers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedOffer, setSelectedOffer] = useState<MarketingOffer | null>(null);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatforms, setFilterPlatforms] = useState<Platform[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  const handleAddOffer = () => {
    setSelectedOffer(null);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditOffer = (id: string) => {
    const offer = offers.find(o => o.id === id);
    if (offer) {
      setSelectedOffer(offer);
      setDialogMode('edit');
      setDialogOpen(true);
    }
  };

  const handleSaveOffer = (data: Partial<MarketingOffer>) => {
    if (!data.url?.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    if (!data.message?.trim()) {
      toast.error('Please enter instructions/message');
      return;
    }
    if (!data.platforms?.length) {
      toast.error('Please select at least one platform');
      return;
    }

    if (dialogMode === 'add') {
      const newOffer: MarketingOffer = {
        id: Date.now().toString(),
        url: data.url || '',
        type: data.type || 'Story',
        message: data.message || '',
        duration: data.duration || 24,
        durationUnit: data.durationUnit || 'hours',
        status: data.status || 'Inactive',
        platforms: data.platforms || ['instagram'],
        createdAt: new Date(),
      };
      setOffers([newOffer, ...offers]);
      toast.success('Offer added successfully');
    } else if (selectedOffer) {
      setOffers(offers.map(offer =>
        offer.id === selectedOffer.id
          ? { ...offer, ...data }
          : offer
      ));
      toast.success('Offer updated successfully');
    }
  };

  const handleDeleteOffer = (id: string) => {
    setOffers(offers.filter(offer => offer.id !== id));
    toast.success('Offer deleted successfully');
  };

  const toggleFilterPlatform = (platform: Platform) => {
    setFilterPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // Filter offers
  const filteredOffers = offers.filter(offer => {
    if (filterStatus !== 'all' && offer.status !== filterStatus) return false;
    if (filterPlatforms.length > 0) {
      const hasMatchingPlatform = filterPlatforms.some(p => offer.platforms.includes(p));
      if (!hasMatchingPlatform) return false;
    }
    if (filterType !== 'all' && offer.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Marketing Offers</h2>
        
        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Platform Filter (Multi-select dropdown) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-36 justify-start gap-2 bg-background">
                {filterPlatforms.length > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      {filterPlatforms.slice(0, 2).map(p => (
                        <span key={p} className="text-primary">{platformIcons[p]}</span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {filterPlatforms.length > 2 ? `+${filterPlatforms.length - 2}` : ''}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Platforms</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-popover">
              {allPlatforms.map(platform => (
                <DropdownMenuCheckboxItem
                  key={platform}
                  checked={filterPlatforms.includes(platform)}
                  onCheckedChange={() => toggleFilterPlatform(platform)}
                >
                  <span className="flex items-center gap-2 capitalize">
                    {platformIcons[platform]}
                    {platform}
                  </span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 bg-background">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Story">Story</SelectItem>
              <SelectItem value="Collab">Collab</SelectItem>
              <SelectItem value="Reshare">Reshare</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleAddOffer}>
            <Plus className="h-4 w-4 mr-2" />
            Add Offer
          </Button>
        </div>
      </div>

      {filteredOffers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground mb-4">
            {offers.length === 0 ? 'No offers created yet' : 'No offers match the selected filters'}
          </p>
          {offers.length === 0 && (
            <Button onClick={handleAddOffer}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Offer
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredOffers.map(offer => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onEdit={handleEditOffer}
              onDelete={handleDeleteOffer}
            />
          ))}
        </div>
      )}

      <OfferDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        offer={selectedOffer}
        onSave={handleSaveOffer}
        mode={dialogMode}
      />
    </div>
  );
};

export default PostOfferTab;