import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Platform Based Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-4 rounded-full bg-purple-600" />
            <h2 className="text-lg font-medium">Platform Based</h2>
          </div>
          <Select defaultValue="platform">
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="platform">Select Platform</SelectItem>
            </SelectContent>
          </Select>
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
        </div>

        {/* Combo Package Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-4 rounded-full bg-purple-600" />
            <h2 className="text-lg font-medium">Combo Package</h2>
          </div>
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
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button 
          onClick={handleBook}
          className="px-12 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default PricesTabContent;
