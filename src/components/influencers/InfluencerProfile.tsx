
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ServiceType, SocialPlatform, RequestPrice } from '@/types/request';

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
const samplePricing: RequestPrice[] = [
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
  const [selectedService, setSelectedService] = useState<ServiceType>('post');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [description, setDescription] = useState('');

  const getPrice = (serviceType: ServiceType, platform: SocialPlatform): number => {
    const pricing = samplePricing.find(p => p.serviceType === serviceType && p.platform === platform);
    return pricing ? pricing.price : 0;
  };

  const handleRequestService = () => {
    if (!description) {
      toast({
        title: "Description required",
        description: "Please provide details about your service request",
        variant: "destructive"
      });
      return;
    }

    const price = getPrice(selectedService, selectedPlatform);
    
    onRequestService({
      influencerId: id,
      influencerName: name,
      serviceType: selectedService,
      platform: selectedPlatform,
      description,
      price
    });

    setDescription('');
    
    toast({
      title: "Request sent",
      description: `Your request has been sent to ${name}`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="relative rounded-xl overflow-hidden h-48 mb-6">
        <img 
          src={coverImage || "https://picsum.photos/1000/300"} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 flex items-end">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
            <img 
              src={profileImage || "https://picsum.photos/200"} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4 bg-black/50 p-2 rounded-lg">
            <h1 className="text-xl font-bold text-white">{name}</h1>
            <p className="text-white/80 text-sm">{category}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Influencer Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Followers</p>
                <p className="text-lg font-semibold">{followers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-lg font-semibold">{engagementRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-lg font-semibold">{category}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{bio}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square rounded-md overflow-hidden">
                        <img 
                          src={`https://picsum.photos/300/300?random=${i}`} 
                          alt="Content" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Pricing</CardTitle>
                  <CardDescription>Request content creation services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Service Type</h3>
                      <Select 
                        value={selectedService} 
                        onValueChange={(value) => setSelectedService(value as ServiceType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post">Post</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="reel">Reel</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="short">Short</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Platform</h3>
                      <Select 
                        value={selectedPlatform} 
                        onValueChange={(value) => setSelectedPlatform(value as SocialPlatform)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <Textarea 
                      placeholder="Describe what you want the influencer to create..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price:</span>
                      <span className="text-xl font-bold">${getPrice(selectedService, selectedPlatform)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is the base price. Final price may vary based on specific requirements.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleRequestService} className="w-full">
                    Request Service
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
