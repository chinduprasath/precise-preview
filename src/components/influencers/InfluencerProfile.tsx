
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ServiceType, SocialPlatform } from '@/types/request';
import InfluencerDetails from './InfluencerDetails';
import ServicesTabContent from './ServicesTabContent';
import PricesTabContent from './PricesTabContent';
import { serviceContentData, platformServicesData, comboPackagesData } from './utils/constants';

interface InfluencerProfileProps {
  id: string;
  name: string;
  category: string;
  bio: string;
  followers: number;
  engagementRate: number;
  profileImage: string;
  coverImage: string;
  onRequestService: (serviceData: {
    influencerId: string;
    influencerName: string;
    serviceType: ServiceType;
    platform: SocialPlatform;
    description: string;
    price: number;
  }) => void;
}

// Sample pricing data (in a real app, this would come from the backend)
const samplePricing = [
  { serviceType: 'post', platform: 'instagram', price: 500 },
  { serviceType: 'story', platform: 'instagram', price: 300 },
  { serviceType: 'reel', platform: 'instagram', price: 800 },
  { serviceType: 'post', platform: 'facebook', price: 400 },
  { serviceType: 'video', platform: 'youtube', price: 1500 },
  { serviceType: 'short', platform: 'youtube', price: 700 },
  { serviceType: 'post', platform: 'twitter', price: 250 },
];

const InfluencerProfile: React.FC<InfluencerProfileProps> = ({
  id,
  name,
  category,
  bio,
  followers,
  engagementRate,
  profileImage,
  coverImage,
  onRequestService
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('post');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [selectedPackage, setSelectedPackage] = useState('platform');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Simulating data loading
    try {
      setIsLoading(true);
      // Load influencer data or other initializations
      // If using actual API calls, this would be where to place them

      setIsLoading(false);
    } catch (err) {
      setError("Failed to load influencer data");
      setIsLoading(false);
      console.error("Error loading influencer profile:", err);
    }
  }, [id]);

  const getPrice = (serviceType: ServiceType, platform: SocialPlatform): number => {
    const pricing = samplePricing.find(p => p.serviceType === serviceType && p.platform === platform);
    return pricing ? pricing.price : 0;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4">
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Influencer Details */}
            <div className="md:w-1/3 flex-shrink-0">
              <InfluencerDetails 
                id={id}
                name={name}
                profileImage={profileImage}
                followers={{
                  instagram: 1000000,
                  facebook: 235000,
                  twitter: 98000,
                  youtube: 2000000
                }}
              />
            </div>

            {/* Right Column - Tabs */}
            <div className="md:w-2/3 flex-grow">
              <Tabs defaultValue="services" className="w-full">
                <div className="border-b mb-6">
                  <TabsList className="w-full flex justify-between bg-transparent p-0">
                    <TabsTrigger 
                      value="services" 
                      className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                    >
                      Services
                    </TabsTrigger>
                    <TabsTrigger 
                      value="prices" 
                      className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                    >
                      Prices
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="services" className="mt-0">
                  <ServicesTabContent serviceContent={serviceContentData} />
                </TabsContent>
                
                <TabsContent value="prices" className="mt-0">
                  <PricesTabContent 
                    platformServices={platformServicesData} 
                    comboPackages={comboPackagesData}
                    influencerName={name}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
