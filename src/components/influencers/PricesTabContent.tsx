
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
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

const allPlatformServices = [
  { id: 'post', name: 'Post Image/Video', price: '499₹', platforms: ['instagram', 'facebook', 'youtube', 'twitter'] },
  { id: 'reel', name: 'Reels/Shorts', price: '499₹', platforms: ['instagram', 'facebook', 'youtube'] },
  { id: 'story', name: 'Story (Image/Video)', price: '499₹', platforms: ['instagram', 'facebook'] },
  { id: 'shorts', name: 'Short Video (<10m)', price: '499₹', platforms: ['instagram', 'facebook', 'youtube', 'twitter'] },
  { id: 'videos', name: 'Video (>10m)', price: '499₹', platforms: ['youtube'] },
  { id: 'polls', name: 'Polls', price: '499₹', platforms: ['twitter'] },
];

const customPackages = [
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
  { id: 'twitter', name: 'Twitter/X' },
];

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  influencerId,
  influencerName,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

  // Filter services based on selected platforms
  const filteredServices = useMemo(() => {
    if (selectedPlatforms.length === 0) {
      return allPlatformServices;
    }

    // For multiple platforms, show only services that are available on ALL selected platforms
    const commonServices = allPlatformServices.filter(service => 
      selectedPlatforms.every(platform => service.platforms.includes(platform))
    );

    return commonServices;
  }, [selectedPlatforms]);

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
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="platform">Platform Based</TabsTrigger>
          <TabsTrigger value="custom">Custom Package</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Platform Services</h3>
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
              </div>
              
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
              
              {filteredServices.length > 0 ? (
                <div className="space-y-3">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id={service.id}
                          checked={selectedItems.includes(service.id)}
                          onCheckedChange={() => handleCheckboxChange(service.id)}
                        />
                        <label htmlFor={service.id} className="text-sm font-medium cursor-pointer">
                          {service.name}
                        </label>
                      </div>
                      <span className="text-sm font-semibold text-primary">{service.price}</span>
                    </div>
                  ))}
                </div>
              ) : selectedPlatforms.length > 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No common order types available for selected platforms.</p>
                  <p className="text-sm mt-1">Try selecting fewer platforms or different combinations.</p>
                </div>
              ) : null}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Custom Packages</h3>
              
              <div className="space-y-3">
                {customPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={pkg.id}
                        checked={selectedItems.includes(pkg.id)}
                        onCheckedChange={() => handleCheckboxChange(pkg.id)}
                      />
                      <div>
                        <label htmlFor={pkg.id} className="text-sm font-medium cursor-pointer block">
                          {pkg.name}
                        </label>
                        <span className="text-xs text-muted-foreground">{pkg.platforms}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{pkg.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

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
