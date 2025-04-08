
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { SocialPlatform } from '@/types/request';
import { Skeleton } from '@/components/ui/skeleton';
import { usePricingData, PlatformService, ComboPackage } from '@/hooks/usePricingData';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
  onEditPrices?: () => void;
}

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  influencerId,
  influencerName,
  onEditPrices
}) => {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [selectedPackage, setSelectedPackage] = useState('platform');
  
  const { platformServices, comboPackages, loading, error } = usePricingData(influencerId);

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

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error loading pricing: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-9 w-40" />
            </div>
            {Array(6).fill(0).map((_, index) => (
              <div key={`service-skeleton-${index}`} className="flex items-center justify-between py-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            {Array(3).fill(0).map((_, index) => (
              <div key={`package-skeleton-${index}`} className="flex items-center justify-between py-2">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
    );
  }

  // Filter services by selected platform
  const filteredServices = platformServices.filter(
    service => service.platform === selectedPlatform
  );

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
              <Select 
                defaultValue={selectedPlatform} 
                onValueChange={(value) => setSelectedPlatform(value as SocialPlatform)}
              >
                <SelectTrigger className="w-[180px] h-9 text-sm bg-gray-100 border-gray-200">
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            {filteredServices.length === 0 ? (
              <p className="text-gray-500 py-2">No services available for this platform</p>
            ) : (
              filteredServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={service.id} 
                      className="rounded-sm border-gray-300 data-[state=checked]:bg-gray-800 data-[state=checked]:text-white"
                      defaultChecked
                      disabled
                    />
                    <label htmlFor={service.id} className="text-base">
                      {service.service_type.charAt(0).toUpperCase() + service.service_type.slice(1)}
                      {service.service_type === "story" && " (Image/Video)"}
                      {service.service_type === "videos" && " (>10m)"}
                    </label>
                  </div>
                  <div className="font-medium">₹{service.price}</div>
                </div>
              ))
            )}
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
            {comboPackages.length === 0 ? (
              <p className="text-gray-500 py-2">No packages available</p>
            ) : (
              comboPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id={pkg.id} 
                        className="rounded-sm border-gray-300 data-[state=checked]:bg-gray-800 data-[state=checked]:text-white"
                        defaultChecked
                        disabled
                      />
                      <label htmlFor={pkg.id} className="text-base">
                        {pkg.name}
                      </label>
                    </div>
                    <div className="text-gray-500 text-sm ml-8">
                      {pkg.platforms.join('/').replace(/,/g, '/')}
                    </div>
                  </div>
                  <div className="font-medium">
                    {pkg.is_featured ? (
                      <div className="text-amber-500">*****</div>
                    ) : (
                      `₹${pkg.price}`
                    )}
                  </div>
                </div>
              ))
            )}
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
