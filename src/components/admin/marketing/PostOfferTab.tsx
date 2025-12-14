import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OfferCard, { MarketingOffer } from './OfferCard';

const initialOffers: MarketingOffer[] = [
  {
    id: '1',
    url: 'https://instagram.com/p/example1',
    type: 'Story',
    message: 'Share our summer collection with your followers!',
    duration: 24,
    durationUnit: 'hours',
    status: 'Active',
    isEditing: false,
  },
  {
    id: '2',
    url: 'https://instagram.com/reel/example2',
    type: 'Collab',
    message: 'Create a collab post featuring our new product line.',
    duration: 3,
    durationUnit: 'days',
    status: 'Inactive',
    isEditing: false,
  },
];

const PostOfferTab: React.FC = () => {
  const [offers, setOffers] = useState<MarketingOffer[]>(initialOffers);

  const handleAddOffer = () => {
    const newOffer: MarketingOffer = {
      id: Date.now().toString(),
      url: '',
      type: 'Story',
      message: '',
      duration: 24,
      durationUnit: 'hours',
      status: 'Inactive',
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
        toast.error('Please enter a valid Instagram URL');
        return;
      }
      if (!offer.message.trim()) {
        toast.error('Please enter instructions/message');
        return;
      }
    }
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, isEditing: false } : offer
    ));
    toast.success('Offer saved successfully');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">Marketing Offers</h2>
        <Button onClick={handleAddOffer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Offer
        </Button>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground mb-4">No offers created yet</p>
          <Button onClick={handleAddOffer}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Offer
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map(offer => (
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
