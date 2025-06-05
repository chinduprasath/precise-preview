
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { usePricingData } from '@/hooks/usePricingData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, X } from 'lucide-react';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
}

const platformServices = [
  { id: 'post', name: 'Post Image/Video', price: '499₹' },
  { id: 'reel', name: 'Reel', price: '499₹' },
  { id: 'story', name: 'Story (Image/Video)', price: '499₹' },
  { id: 'shorts', name: 'Short Video (<10m)', price: '499₹' },
  { id: 'videos', name: 'Video (>10m)', price: '499₹' },
  { id: 'polls', name: 'Polls', price: '499₹' },
];

const comboPackages = [
  { 
    id: 'package1', 
    name: 'Packagename-1', 
    platforms: 'Insta/FB/Youtube',
    price: '499₹'
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

const availablePlatforms = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'twitter', name: 'Twitter' },
];

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  influencerId,
  influencerName,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPackageType, setSelectedPackageType] = useState<'platform' | 'combo'>('platform');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      }
      return [...prev, platformId];
    });
  };

  const removePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => prev.filter(id => id !== platformId));
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

    navigate('/orders/place', { 
      state: { 
        influencerId, 
        influencerName, 
        selectedItems 
      } 
    });
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <RadioGroup value={selectedPackageType} onValueChange={(value) => setSelectedPackageType(value as 'platform' | 'combo')} className="space-y-6">
          {/* Platform Based Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RadioGroupItem id="platform" value="platform" className="h-4 w-4" />
                <label htmlFor="platform" className="text-base font-medium">Platform Based</label>
              </div>
              
              {selectedPackageType === 'platform' && (
                <Popover open={platformDropdownOpen} onOpenChange={setPlatformDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={platformDropdownOpen}
                      className="w-48 justify-between"
                    >
                      Select Platforms
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0" align="end">
                    <div className="p-2 space-y-2">
                      {availablePlatforms.map((platform) => (
                        <div key={platform.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={platform.id}
                            checked={selectedPlatforms.includes(platform.id)}
                            onCheckedChange={() => handlePlatformToggle(platform.id)}
                          />
                          <label
                            htmlFor={platform.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {platform.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            
            {selectedPackageType === 'platform' && (
              <>
                {selectedPlatforms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPlatforms.map((platformId) => {
                      const platform = availablePlatforms.find(p => p.id === platformId);
                      return (
                        <Badge key={platformId} variant="secondary" className="flex items-center gap-1">
                          {platform?.name}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removePlatform(platformId)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
                
                <div className="space-y-3">
                  {platformServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id={service.id}
                          checked={selectedItems.includes(service.id)}
                          onCheckedChange={() => handleCheckboxChange(service.id)}
                        />
                        <label htmlFor={service.id} className="text-sm">
                          {service.name}
                        </label>
                      </div>
                      <span className="text-sm">{service.price}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Combo Package Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem id="combo" value="combo" className="h-4 w-4" />
              <label htmlFor="combo" className="text-base font-medium">Combo Package</label>
            </div>
            
            {selectedPackageType === 'combo' && (
              <div className="space-y-3">
                {comboPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id={pkg.id}
                        checked={selectedItems.includes(pkg.id)}
                        onCheckedChange={() => handleCheckboxChange(pkg.id)}
                      />
                      <div>
                        <label htmlFor={pkg.id} className="text-sm block">
                          {pkg.name}
                        </label>
                        <span className="text-xs text-gray-500">{pkg.platforms}</span>
                      </div>
                    </div>
                    <span className="text-sm">{pkg.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RadioGroup>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleBook}
          className="px-12"
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default PricesTabContent;
