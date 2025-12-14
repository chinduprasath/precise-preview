import React, { useState } from 'react';
import { Plus, Filter, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OfferCard, { MarketingOffer, Platform } from './OfferCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    isEditing: false,
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
    isEditing: false,
  },
];

const PostOfferTab: React.FC = () => {
  const [offers, setOffers] = useState<MarketingOffer[]>(initialOffers);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatforms, setFilterPlatforms] = useState<Platform[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  const handleAddOffer = () => {
    const newOffer: MarketingOffer = {
      id: Date.now().toString(),
      url: '',
      type: 'Story',
      message: '',
      duration: 24,
      durationUnit: 'hours',
      status: 'Inactive',
      platforms: ['instagram'],
      createdAt: new Date(),
      isEditing: true,
    };
    setOffers([newOffer, ...offers]);
    toast.info('New offer card added. Fill in the details and save.');
  };

  const handleUpdateOffer = (id: string, updates: Partial<MarketingOffer>) => {
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, ...updates } : offer
    ));
  };

  const handleDeleteOffer = (id: string) => {
    setOffers(offers.filter(offer => offer.id !== id));
    toast.success('Offer deleted successfully');
  };

  const handleToggleEdit = (id: string) => {
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, isEditing: !offer.isEditing } : offer
    ));
  };

  const handleSaveOffer = (id: string) => {
    const offer = offers.find(o => o.id === id);
    if (offer) {
      if (!offer.url.trim()) {
        toast.error('Please enter a valid URL');
        return;
      }
      if (!offer.message.trim()) {
        toast.error('Please enter instructions/message');
        return;
      }
      if (offer.platforms.length === 0) {
        toast.error('Please select at least one platform');
        return;
      }
    }
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, isEditing: false } : offer
    ));
    toast.success('Offer saved successfully');
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
    // Status filter
    if (filterStatus !== 'all' && offer.status !== filterStatus) return false;
    
    // Platform filter
    if (filterPlatforms.length > 0) {
      const hasMatchingPlatform = filterPlatforms.some(p => offer.platforms.includes(p));
      if (!hasMatchingPlatform) return false;
    }
    
    // Type filter
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

          {/* Platform Filter (Multi-select buttons) */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {allPlatforms.map(platform => {
              const isSelected = filterPlatforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => toggleFilterPlatform(platform)}
                  className={`p-2 rounded-md transition-all ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background'
                  }`}
                  title={platform}
                >
                  {platformIcons[platform]}
                </button>
              );
            })}
          </div>

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
              onUpdate={handleUpdateOffer}
              onDelete={handleDeleteOffer}
              onToggleEdit={handleToggleEdit}
              onSave={handleSaveOffer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostOfferTab;