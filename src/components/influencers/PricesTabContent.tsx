
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { SocialPlatform } from '@/types/request';

interface PlatformService {
  id: string;
  name: string;
  price: string;
}

interface ComboPackage {
  id: string;
  name: string;
  platforms: string;
  price: string;
}

interface PricesTabContentProps {
  platformServices: PlatformService[];
  comboPackages: ComboPackage[];
  influencerName: string;
  onEditPrices?: () => void;
}

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  platformServices,
  comboPackages,
  influencerName,
  onEditPrices
}) => {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = React.useState<SocialPlatform>('instagram');

  const handleBook = () => {
    toast({
      title: "Service booked",
      description: `Your service request has been sent to ${influencerName}`,
    });
  };

  const handleEditPrices = () => {
    if (onEditPrices) {
      onEditPrices();
    } else {
      toast({
        title: "Edit mode",
        description: "Editing prices functionality would be implemented here",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <span className="font-medium">Platform Based</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select defaultValue="instagram" onValueChange={(value) => setSelectedPlatform(value as SocialPlatform)}>
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleEditPrices}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Edit
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {platformServices.map((service) => (
          <div key={service.id} className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Checkbox id={service.id} defaultChecked />
              <label htmlFor={service.id} className="text-sm font-medium">
                {service.name}
              </label>
            </div>
            <div className="text-sm font-semibold">{service.price}</div>
          </div>
        ))}
      </div>
      
      <div className="py-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <span className="font-medium">Combo Package</span>
        </div>
        
        <div className="space-y-4">
          {comboPackages.map((pkg) => (
            <div key={pkg.id} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Checkbox id={pkg.id} defaultChecked />
                <div>
                  <label htmlFor={pkg.id} className="text-sm font-medium block">
                    {pkg.name}
                  </label>
                  <span className="text-xs text-gray-500">{pkg.platforms}</span>
                </div>
              </div>
              <div className="text-sm font-semibold">{pkg.price}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-12"
          onClick={handleBook}
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default PricesTabContent;
