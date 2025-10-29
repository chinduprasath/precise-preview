import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Gift, Clock, Check, X, Hourglass, Copy, Share2, Instagram, Facebook, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Offer, UserPromotion } from '@/types/offer';

const mockCurrentOffer: Offer = {
  id: '1',
  title: 'Summer Campaign 2025',
  description: 'Promote our new summer collection with exclusive discounts for your followers.',
  imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  caption: 'Summer is here! Check out the new collection from @influenceconnect with 20% off using code SUMMER25 #ad',
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true
};

const mockUserPromotions: UserPromotion[] = [
  {
    id: '1',
    offerId: '1',
    generatedUrl: 'https://inf.co/promo/u123/summer25',
    platform: 'Instagram',
    postTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    status: 'Live',
    timeRemaining: '18h remaining',
    engagement: {
      views: 245,
      likes: 56,
      shares: 12,
      comments: 8,
      clicks: 23
    },
    rewardStatus: 'Given'
  },
  {
    id: '2',
    offerId: '2',
    generatedUrl: 'https://inf.co/promo/u123/spring25',
    platform: 'Facebook',
    postTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Expired',
    timeRemaining: '0h remaining',
    engagement: {
      views: 189,
      likes: 42,
      shares: 8,
      comments: 5,
      clicks: 17
    },
    rewardStatus: 'Given'
  }
];

const OffersPage = () => {
  const { toast } = useToast();
  const [userType] = useState(() => localStorage.getItem('userType') || 'business');
  const [activePromotions, setActivePromotions] = useState<UserPromotion[]>(mockUserPromotions);
  const [urlGenerated, setUrlGenerated] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  
  const generateUniqueUrl = () => {
    const newUrl = `https://inf.co/promo/u${Math.floor(Math.random() * 1000)}/${mockCurrentOffer.title.toLowerCase().replace(/\s+/g, '')}`;
    
    setUrlGenerated(true);
    setGeneratedUrl(newUrl);
    
    toast({
      title: "URL Generated!",
      description: "Your unique promotional URL has been created. Copy and use it in your post.",
    });
    
    const newPromotion: UserPromotion = {
      id: (activePromotions.length + 1).toString(),
      offerId: mockCurrentOffer.id,
      generatedUrl: newUrl,
      platform: 'Instagram',
      status: 'Pending',
      postTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      timeRemaining: '24h remaining',
      engagement: {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        clicks: 0
      },
      rewardStatus: 'Pending'
    };
    
    setActivePromotions([...activePromotions, newPromotion]);
    return newUrl;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };
  
  const calculateTimeRemaining = (expiryTime?: string) => {
    if (!expiryTime) return '0h remaining';
    
    const expiry = new Date(expiryTime);
    const now = new Date();
    const diffHours = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    return `${diffHours}h remaining`;
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Live':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check className="w-3 h-3 mr-1" /> Live</Badge>;
      case 'Removed':
        return <Badge className="bg-red-500 hover:bg-red-600"><X className="w-3 h-3 mr-1" /> Removed</Badge>;
      case 'Expired':
        return <Badge className="bg-gray-500 hover:bg-gray-600"><Hourglass className="w-3 h-3 mr-1" /> Expired</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };
  
  const calculateReward = () => {
    return userType === 'business' 
      ? '1 Month Free Subscription' 
      : 'Commission-Free Withdrawal';
  };
  
  const isOfferActive = () => {
    const now = new Date();
    const expiryDate = new Date(mockCurrentOffer.expiresAt);
    return now < expiryDate;
  };
  
  const handlePlatformShare = (platform: string) => {
    toast({
      title: `Opening ${platform}...`,
      description: `Copy your URL and create a story on ${platform}`,
    });
  };
  
  const handleClaimReward = (promoId: string) => {
    toast({
      title: "Reward Activated!",
      description: "Your 1-Month Pro Subscription has been activated successfully.",
    });
  };
  
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'Instagram':
        return <Instagram className="w-5 h-5" />;
      case 'Facebook':
        return <Facebook className="w-5 h-5" />;
      case 'YouTube':
        return <Youtube className="w-5 h-5" />;
      default:
        return <Share2 className="w-5 h-5" />;
    }
  };
  
  const calculateProgress = (expiryTime?: string) => {
    if (!expiryTime) return 100;
    
    const postTime = new Date(expiryTime);
    postTime.setHours(postTime.getHours() - 24); // 24 hours earlier
    
    const now = new Date();
    const total = 24 * 60 * 60 * 1000; // 24 hours in ms
    const elapsed = now.getTime() - postTime.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const safeClickElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      element.click();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Gift className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">Promotional Offers</h1>
          </div>
        </div>
        
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">Current Offer</TabsTrigger>
            <TabsTrigger value="my-promotions">My Promotions</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>{mockCurrentOffer.title}</CardTitle>
                <CardDescription>
                  {mockCurrentOffer.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={mockCurrentOffer.imageUrl} 
                      alt={mockCurrentOffer.title} 
                      className="w-full h-64 object-cover rounded-lg mb-4" 
                    />
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="font-medium text-sm">Suggested Caption:</p>
                      <p className="text-gray-700 mt-1">{mockCurrentOffer.caption}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => copyToClipboard(mockCurrentOffer.caption)}
                      >
                        <Copy className="w-4 h-4 mr-1" /> Copy Caption
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Promotion Details</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Campaign Period:</span>
                          <span className="font-medium">7 days</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Story Duration Requirement:</span>
                          <span className="font-medium">24 hours</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Reward:</span>
                          <span className="font-medium">{calculateReward()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Campaign Ends On:</span>
                          <span className="font-medium">{new Date(mockCurrentOffer.expiresAt).toLocaleDateString()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium flex items-center">
                            {isOfferActive() ? (
                              <><span className="text-green-500 mr-1">🟢</span> Active</>
                            ) : (
                              <><span className="text-red-500 mr-1">🔴</span> Expired</>
                            )}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">📋 Platform Instructions</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                          <div className="flex items-start">
                            <span className="text-xl mr-2">🟣</span>
                            <div>
                              <p className="font-semibold text-purple-900">Instagram</p>
                              <p className="text-sm text-gray-700 mt-1">Post promotional video as Story with caption & tag @InfluenceConnect — keep it live for 24h to earn your reward.</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                          <div className="flex items-start">
                            <span className="text-xl mr-2">🔵</span>
                            <div>
                              <p className="font-semibold text-blue-900">Facebook</p>
                              <p className="text-sm text-gray-700 mt-1">Share as Post or Story with caption & tag @InfluenceConnectOfficial — tracked for 24h automatically.</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-100">
                          <div className="flex items-start">
                            <span className="text-xl mr-2">🟦</span>
                            <div>
                              <p className="font-semibold text-sky-900">Twitter (X)</p>
                              <p className="text-sm text-gray-700 mt-1">Tweet video link with caption & tag @InfluenceConnect — keep tweet live for 24h.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!urlGenerated ? (
                      <Button 
                        className="w-full" 
                        onClick={generateUniqueUrl}
                      >
                        <Gift className="w-5 h-5 mr-2" /> Generate Unique URL
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Your Generated URL:</p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-white px-2 py-1 rounded flex-1 overflow-x-auto">{generatedUrl}</code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(generatedUrl)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex flex-col items-center py-3 h-auto"
                            onClick={() => handlePlatformShare('Instagram')}
                          >
                            <Instagram className="w-5 h-5 mb-1" />
                            <span className="text-xs">Instagram Story</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex flex-col items-center py-3 h-auto"
                            onClick={() => handlePlatformShare('Facebook')}
                          >
                            <Facebook className="w-5 h-5 mb-1" />
                            <span className="text-xs">Facebook Story</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex flex-col items-center py-3 h-auto"
                            onClick={() => handlePlatformShare('Twitter')}
                          >
                            <Share2 className="w-5 h-5 mb-1" />
                            <span className="text-xs">Twitter Story</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my-promotions">
            <div className="space-y-4">
              {activePromotions.length > 0 ? (
                activePromotions.map(promo => (
                  <Card key={promo.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getPlatformIcon(promo.platform as string)}
                          <span className="ml-2 font-medium">{promo.platform}</span>
                          <span className="mx-2">•</span>
                          {getStatusBadge(promo.status as string)}
                        </div>
                        {promo.status === 'Live' && (
                          <div className="flex items-center">
                            <Hourglass className="w-4 h-4 text-amber-500 mr-1" />
                            <span className="text-sm font-medium">{promo.timeRemaining || calculateTimeRemaining(promo.expiryTime)}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Generated URL:</p>
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded flex-1 overflow-x-auto whitespace-nowrap">
                              <code className="text-xs">{promo.generatedUrl}</code>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2"
                              onClick={() => copyToClipboard(promo.generatedUrl as string)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {promo.status === 'Live' && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>0h</span>
                                <span>24h</span>
                              </div>
                              <Progress value={calculateProgress(promo.expiryTime)} className="h-2" />
                              <p className="text-xs text-center mt-1">Time remaining until reward eligibility</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-sm text-gray-500">Reward:</p>
                              <p className="font-medium">{calculateReward()}</p>
                            </div>
                            <Badge 
                              className={promo.rewardStatus === 'Given' 
                                ? "bg-green-500" 
                                : "bg-yellow-500"
                              }
                            >
                              {promo.rewardStatus}
                            </Badge>
                          </div>
                          {promo.status === 'Live' && promo.rewardStatus === 'Pending' && (
                            <Button 
                              className="w-full"
                              onClick={() => handleClaimReward(promo.id)}
                            >
                              <Gift className="w-4 h-4 mr-2" />
                              🎁 Reward Ready — Click to Activate 1-Month Pro Subscription
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Gift className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Promotions Yet</h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                      You haven't created any promotional links yet. Generate a unique URL from the Current Offer tab to get started.
                    </p>
                    <Button onClick={() => safeClickElement('[data-value="current"]')}>
                      View Current Offer
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="how-it-works">
            <Card>
              <CardHeader>
                <CardTitle>How to Earn Rewards with Promotions</CardTitle>
                <CardDescription>
                  Follow these simple steps to promote our campaigns and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-primary/5 p-4 rounded-lg text-center">
                      <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">1</div>
                      <h3 className="font-medium mb-2">Generate a Unique URL</h3>
                      <p className="text-sm text-gray-600">
                        Click the "Generate Unique URL" button on the current promotion to create your personal tracking link.
                      </p>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg text-center">
                      <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">2</div>
                      <h3 className="font-medium mb-2">Post on Social Media</h3>
                      <p className="text-sm text-gray-600">
                        Share the promotion on Instagram, Facebook, or YouTube using the provided content and your unique URL.
                      </p>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg text-center">
                      <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">3</div>
                      <h3 className="font-medium mb-2">Keep Live for 24 Hours</h3>
                      <p className="text-sm text-gray-600">
                        Maintain your post for at least 24 hours to qualify for your reward.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Gift className="w-5 h-5 mr-2 text-yellow-600" />
                      Your Reward
                    </h3>
                    <p className="text-sm">
                      After successfully keeping your promotion live for 24 hours, you'll automatically receive:
                    </p>
                    <ul className="mt-2 space-y-1">
                      {userType === 'business' ? (
                        <li className="text-sm flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          1 month Free Subscription to our Premium Business Plan
                        </li>
                      ) : (
                        <li className="text-sm flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          Commission-Free Withdrawal on your next payout
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Rules & Requirements</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-primary font-medium mr-2">•</span>
                        Posts must include the provided caption and your unique URL.
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary font-medium mr-2">•</span>
                        Content must remain live and unchanged for at least 24 hours.
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary font-medium mr-2">•</span>
                        The post must be public and viewable by our tracking system.
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary font-medium mr-2">•</span>
                        Each user can earn one reward per promotional campaign.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => safeClickElement('[data-value="current"]')} className="w-full">
                  View Current Promotion
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OffersPage;
