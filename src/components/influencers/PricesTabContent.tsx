
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {/* Left column - Platform Based */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            <span className="font-medium text-lg">Platform Based</span>
            
            <div className="ml-auto">
              <Select defaultValue="instagram" onValueChange={(value) => setSelectedPlatform(value as SocialPlatform)}>
                <SelectTrigger className="w-[180px] h-9 text-sm bg-gray-100 border-gray-200">
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            {platformServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-gray-800 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <label className="text-base">
                    {service.name}
                  </label>
                </div>
                <div className="font-medium">{service.price}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right column - Combo Package */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            <span className="font-medium text-lg">Combo Package</span>
          </div>
          
          <div className="space-y-2 mt-4">
            {comboPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-gray-800 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <label className="text-base">
                      {pkg.name}
                    </label>
                  </div>
                  <div className="text-gray-500 text-sm ml-8">{pkg.platforms}</div>
                </div>
                <div className="font-medium">
                  {pkg.id === 'package1' ? (
                    <div className="text-amber-500">★★★★★</div>
                  ) : (
                    pkg.price
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-12 rounded-md py-2 w-1/3"
          onClick={handleBook}
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default PricesTabContent;
