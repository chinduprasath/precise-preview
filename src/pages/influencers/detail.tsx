import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ServiceType, SocialPlatform, RequestStatus } from '@/types/request';

const sampleInfluencers = [
  {
    id: '1',
    name: 'Username',
    category: 'Fashion & Lifestyle',
    bio: 'Fashion blogger sharing the latest trends and style tips.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 4.2,
    profileImage: 'https://picsum.photos/id/64/300/300',
    coverImage: 'https://picsum.photos/id/30/1000/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  },
  {
    id: '2',
    name: 'Username',
    category: 'Beauty & Skincare',
    bio: 'Beauty expert specializing in skincare reviews and tutorials.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 3.8,
    profileImage: 'https://picsum.photos/id/65/300/300',
    coverImage: 'https://picsum.photos/id/31/1000/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  },
  {
    id: '3',
    name: 'Username',
    category: 'Tech & Gaming',
    bio: 'Tech reviewer covering the latest gadgets and gaming content.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 5.1,
    profileImage: 'https://picsum.photos/id/91/300/300',
    coverImage: 'https://picsum.photos/id/32/1000/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  }
];

const samplePricing = [
  { serviceType: 'post', platform: 'instagram', price: 25000 },
  { serviceType: 'story', platform: 'instagram', price: 15000 },
  { serviceType: 'reel', platform: 'instagram', price: 40000 },
  { serviceType: 'post', platform: 'facebook', price: 20000 },
  { serviceType: 'video', platform: 'youtube', price: 75000 },
  { serviceType: 'short', platform: 'youtube', price: 35000 },
  { serviceType: 'post', platform: 'twitter', price: 12500 },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

const InfluencerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const influencer = sampleInfluencers.find(inf => inf.id === id);
  
  if (!influencer) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold">Influencer not found</h1>
              <p className="text-gray-500 mt-2">The influencer you're looking for doesn't exist.</p>
              <Button 
                onClick={() => navigate('/influencers')}
                className="mt-4"
              >
                Back to Influencers
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
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
    
    console.log('Service request submitted:', {
      influencerId: id,
      influencerName: influencer.name,
      serviceType: selectedService,
      platform: selectedPlatform,
      description,
      price
    });
    
    const requestId = `req-${Date.now()}`;
    const newRequest = {
      id: requestId,
      businessId: 'business-1',
      businessName: 'Your Business',
      status: 'pending' as RequestStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      influencerId: id,
      influencerName: influencer.name,
      serviceType: selectedService,
      platform: selectedPlatform,
      description,
      price
    };
    
    const existingRequests = JSON.parse(localStorage.getItem('influencerRequests') || '[]');
    localStorage.setItem('influencerRequests', JSON.stringify([...existingRequests, newRequest]));
    
    setDescription('');
    
    toast({
      title: "Request Submitted",
      description: `Your request has been sent to ${influencer.name}. They will review it shortly.`,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-xl overflow-hidden h-48 mb-6">
              <img 
                src={influencer.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-end">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img 
                    src={influencer.profileImage} 
                    alt={influencer.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 bg-black/50 p-2 rounded-lg">
                  <h1 className="text-xl font-bold text-white">{influencer.name}</h1>
                  <p className="text-white/80 text-sm">{influencer.category}</p>
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
                    <div className="flex flex-wrap gap-4">
                      <div className="flex flex-col items-center">
                        <Instagram className="h-6 w-6 text-pink-500 mb-1" />
                        <span className="font-semibold">{formatNumber(influencer.followers.instagram)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Facebook className="h-6 w-6 text-blue-600 mb-1" />
                        <span className="font-semibold">{formatNumber(influencer.followers.facebook)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Twitter className="h-6 w-6 text-blue-400 mb-1" />
                        <span className="font-semibold">{formatNumber(influencer.followers.twitter)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Youtube className="h-6 w-6 text-red-600 mb-1" />
                        <span className="font-semibold">{formatNumber(influencer.followers.youtube)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                      <p className="text-lg font-semibold">{influencer.engagementRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="text-lg font-semibold">{influencer.category}</p>
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
                        <CardTitle>About {influencer.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{influencer.bio}</p>
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
                            <span className="text-xl font-bold">₹{getPrice(selectedService, selectedPlatform)}</span>
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
        </main>
      </div>
    </div>
  );
};

export default InfluencerDetailPage;

