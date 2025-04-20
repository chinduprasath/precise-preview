
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { usePricingData } from '@/hooks/usePricingData';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
}

const platformServices = [
  { id: 'post', name: 'Post Image', price: '499₹' },
  { id: 'reel', name: 'Reel', price: '499₹' },
  { id: 'story', name: 'Story (Image/Video)', price: '499₹' },
  { id: 'shorts', name: 'Shorts', price: '499₹' },
  { id: 'videos', name: 'Videos (>10m)', price: '499₹' },
  { id: 'polls', name: 'Polls', price: '499₹' },
];

const comboPackages = [
  { 
    id: 'package1', 
    name: 'Packagename-1', 
    platforms: 'Insta/FB/Youtube',
    price: '*****'
  },
  { 
    id: 'package2', 
    name: 'Packagename-2', 
    platforms: 'Insta/FB/Youtube',
    price: '499₹'
  },
  { 
    id: 'package3', 
    name: 'Packagename-3', 
    platforms: 'Insta/FB/Youtube',
    price: '499₹'
  },
];

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  influencerId,
  influencerName,
}) => {
  const { toast } = useToast();
  const [platform, setPlatform] = useState('instagram');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [pricingType, setPricingType] = useState('platform');

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleBook = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one service or package",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking initiated",
      description: `Selected ${selectedItems.length} items for booking with ${influencerName}`,
    });
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        value={pricingType}
        onValueChange={setPricingType}
        className="grid grid-cols-2 gap-4"
      >
        <div className={`p-4 rounded-lg border ${pricingType === 'platform' ? 'border-primary bg-accent/50' : 'border-border'}`}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="platform" id="platform" />
            <label htmlFor="platform" className="text-lg font-medium">Platform Based</label>
          </div>
          {pricingType === 'platform' && (
            <div className="mt-4 space-y-4">
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-y-2">
                {platformServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={service.id}
                        checked={selectedItems.includes(service.id)}
                        onCheckedChange={() => handleCheckboxChange(service.id)}
                      />
                      <label htmlFor={service.id} className="text-sm font-medium">
                        {service.name}
                      </label>
                    </div>
                    <span className="font-medium">{service.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`p-4 rounded-lg border ${pricingType === 'combo' ? 'border-primary bg-accent/50' : 'border-border'}`}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="combo" id="combo" />
            <label htmlFor="combo" className="text-lg font-medium">Combo Package</label>
          </div>
          {pricingType === 'combo' && (
            <div className="mt-4 space-y-2">
              {comboPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={pkg.id}
                      checked={selectedItems.includes(pkg.id)}
                      onCheckedChange={() => handleCheckboxChange(pkg.id)}
                    />
                    <div>
                      <label htmlFor={pkg.id} className="text-sm font-medium block">
                        {pkg.name}
                      </label>
                      <span className="text-xs text-muted-foreground">{pkg.platforms}</span>
                    </div>
                  </div>
                  <span className="font-medium">{pkg.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </RadioGroup>

      <div className="flex justify-center mt-6">
        <Button 
          className="w-32 bg-blue-500 hover:bg-blue-600"
          onClick={handleBook}
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default PricesTabContent;
