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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, X, Info } from 'lucide-react';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
}

const allPlatformServices = [
  { 
    id: 'post', 
    name: 'Post Image/Video', 
    price: '499₹', 
    platforms: ['instagram', 'facebook', 'youtube', 'twitter'],
    tooltip: 'Standard feed post with an image or video provided by the brand.'
  },
  { 
    id: 'reel', 
    name: 'Reels/Shorts', 
    price: '499₹', 
    platforms: ['instagram', 'facebook', 'youtube'],
    tooltip: 'Vertical short video (15–90 sec) for high engagement. Suitable for Instagram, Facebook, YouTube Shorts.'
  },
  { 
    id: 'story', 
    name: 'Story (Image/Video)', 
    price: '499₹', 
    platforms: ['instagram', 'facebook'],
    tooltip: 'Temporary 24-hour image/video post. Great for timely promotions.'
  },
  { 
    id: 'in-video-promotion', 
    name: 'In-Video Promotion (<10 min)', 
    price: '499₹', 
    platforms: ['youtube'],
    tooltip: 'Brand mention or product feature integrated inside influencer\'s YouTube video. Typically 1–5 mins.'
  },
  { 
    id: 'promotions-long', 
    name: 'Promotions (>10 min)', 
    price: '499₹', 
    platforms: ['youtube'],
    tooltip: 'Long-form brand video (provided by business) uploaded to influencer\'s YouTube channel. Best for detailed content.'
  },
  { 
    id: 'polls', 
    name: 'Polls', 
    price: '499₹', 
    platforms: ['twitter'],
    tooltip: 'Only supported on Twitter/X. Allows voting and result extraction via API.'
  },
  { 
    id: 'visit-promote', 
    name: 'Visit & Promote', 
    price: '₹1000 – ₹5000', 
    platforms: ['instagram', 'facebook', 'youtube', 'twitter'],
    tooltip: 'Influencer visits your location, creates real-time content (Reels/Stories), and publishes it to promote footfall.',
    isVisitPromote: true
  },
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
  const [selectedPlatform, setSelectedPlatform] = useState<string>(''); // Changed to single platform
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

  // Filter services based on selected platform (single selection)
  const filteredServices = useMemo(() => {
    if (!selectedPlatform) {
      return allPlatformServices;
    }

    // Show only services that are available on the selected platform
    return allPlatformServices.filter(service => 
      service.platforms.includes(selectedPlatform)
    );
  }, [selectedPlatform]);

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setPlatformDropdownOpen(false);
  };

  const removePlatform = () => {
    setSelectedPlatform('');
  };

  const hasVisitPromoteSelected = selectedItems.includes('visit-promote');

  const handleBook = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one service or package",
        variant: "destructive"
      });
      return;
    }

    if (hasVisitPromoteSelected) {
      // For Visit & Promote, trigger review flow
      navigate('/orders/review', { 
        state: { 
          influencerId, 
          influencerName, 
          selectedItems,
          isVisitPromote: true
        } 
      });
    } else {
      navigate('/orders/place', { 
        state: { 
          influencerId, 
          influencerName, 
          selectedItems 
        } 
      });
    }
  };

  const selectedPlatformName = selectedPlatform ? 
    availablePlatforms.find(p => p.id === selectedPlatform)?.name : 
    'Select Platform';

  return (
    <TooltipProvider>
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
                        {selectedPlatformName}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="end">
                      <div className="p-2 space-y-1">
                        {availablePlatforms.map((platform) => (
                          <div 
                            key={platform.id}
                            className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 cursor-pointer"
                            onClick={() => handlePlatformSelect(platform.id)}
                          >
                            <span className="text-sm font-medium leading-none">
                              {platform.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {selectedPlatform && (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedPlatformName}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={removePlatform}
                      />
                    </Badge>
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
                          <div className="flex items-center gap-2">
                            <label htmlFor={service.id} className="text-sm font-medium cursor-pointer">
                              {service.name}
                            </label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-sm">{service.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary">{service.price}</span>
                      </div>
                    ))}
                  </div>
                ) : selectedPlatform ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No order types available for selected platform.</p>
                    <p className="text-sm mt-1">Try selecting a different platform.</p>
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
            {hasVisitPromoteSelected ? 'Send for Review' : 'Book'}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PricesTabContent;
