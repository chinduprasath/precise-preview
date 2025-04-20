
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
}

const PricesTabContent: React.FC<PricesTabContentProps> = ({ influencerId, influencerName }) => {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

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

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  const handleBook = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service to book",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking request sent",
      description: `Your booking request for ${influencerName} has been sent successfully.`
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Platform Based Services */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <h3 className="font-semibold">Platform Based</h3>
          </div>
          
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-full bg-gray-100">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            {platformServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <label htmlFor={service.id} className="text-sm">
                    {service.name}
                  </label>
                </div>
                <span className="text-sm font-medium">{service.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Combo Packages */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <h3 className="font-semibold">Combo Package</h3>
          </div>

          <div className="space-y-2">
            {comboPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={pkg.id}
                    checked={selectedServices.includes(pkg.id)}
                    onCheckedChange={() => handleServiceToggle(pkg.id)}
                  />
                  <div>
                    <label htmlFor={pkg.id} className="text-sm block">
                      {pkg.name}
                    </label>
                    <span className="text-xs text-gray-500">{pkg.platforms}</span>
                  </div>
                </div>
                <span className="text-sm font-medium">{pkg.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleBook}
          className="px-8 bg-blue-500 hover:bg-blue-600"
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default PricesTabContent;
