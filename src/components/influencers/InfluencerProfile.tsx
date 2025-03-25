
import React, { useState } from 'react';
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
  { serviceType: 'post', platform: 'instagram', price: 25000 },
  { serviceType: 'story', platform: 'instagram', price: 15000 },
  { serviceType: 'reel', platform: 'instagram', price: 40000 },
  { serviceType: 'post', platform: 'facebook', price: 20000 },
  { serviceType: 'video', platform: 'youtube', price: 75000 },
  { serviceType: 'short', platform: 'youtube', price: 35000 },
  { serviceType: 'post', platform: 'twitter', price: 12500 },
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
  const [selectedService, setSelectedService] = useState<ServiceType>('post');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [selectedPackage, setSelectedPackage] = useState('platform');
  const [description, setDescription] = useState('');

  const getPrice = (serviceType: ServiceType, platform: SocialPlatform): number => {
    const pricing = samplePricing.find(p => p.serviceType === serviceType && p.platform === platform);
    return pricing ? pricing.price : 0;
  };

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
                    platformServices={platformServicesData.map(service => ({
                      ...service,
                      price: `₹${(parseInt(service.price.replace('$', '')) * 50)}`
                    }))} 
                    comboPackages={comboPackagesData.map(pkg => ({
                      ...pkg,
                      price: `₹${(parseInt(pkg.price.replace('$', '')) * 50)}`
                    }))}
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
