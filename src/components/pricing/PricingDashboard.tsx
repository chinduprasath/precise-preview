
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Instagram, Facebook, Youtube, Twitter, Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { usePricingData, PlatformService, ComboPackage } from '@/hooks/usePricingData';
import { supabase } from '@/integrations/supabase/client';

interface PricingDashboardProps {
  influencerId?: string;
}

interface PlatformPricing {
  platform: string;
  serviceType: string;
  price: number;
  isActive: boolean;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'youtube', name: 'YouTube', icon: Youtube },
  { id: 'twitter', name: 'Twitter', icon: Twitter },
];

const ORDER_TYPES = [
  { id: 'post', name: 'Image Post', description: 'Static image post on selected platform' },
  { id: 'video', name: 'Video Post', description: 'Video content, typically > 1 min' },
  { id: 'reel', name: 'Reel/Short', description: 'Short vertical video content (15-60s)' },
  { id: 'story', name: 'Story', description: 'Temporary content that disappears in 24hrs' },
  { id: 'poll', name: 'Poll', description: 'Interactive voting content' },
];

// Mapping of which platforms support which order types
const PLATFORM_ORDER_TYPES = {
  instagram: ['post', 'video', 'reel', 'story', 'poll'],
  facebook: ['post', 'video', 'reel', 'story', 'poll'],
  youtube: ['video', 'reel'],
  twitter: ['post', 'video', 'poll'],
};

const PricingDashboard: React.FC<PricingDashboardProps> = ({ influencerId }) => {
  // State for platform pricing
  const [platformPricing, setPlatformPricing] = useState<PlatformPricing[]>([]);
  // State for combo packages
  const [comboPackages, setComboPackages] = useState<ComboPackage[]>([]);
  // State for the new package dialog
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false);
  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State for the new package form
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    platforms: [] as string[],
    orderTypes: [] as string[],
    price: 0,
    deliveryDays: 3,
    isFeatured: false,
  });

  // Get pricing data from the hook
  const { platformServices, comboPackages: fetchedPackages, loading, error } = usePricingData(influencerId);

  useEffect(() => {
    if (platformServices.length > 0) {
      // Transform platform services to our format
      const pricing: PlatformPricing[] = [];
      
      // For each service type and platform combination, find the price
      ORDER_TYPES.forEach(orderType => {
        PLATFORMS.forEach(platform => {
          const service = platformServices.find(
            s => s.service_type === orderType.id && s.platform === platform.id
          );
          
          pricing.push({
            platform: platform.id,
            serviceType: orderType.id,
            price: service?.price || 0,
            isActive: !!service && service.is_active,
          });
        });
      });
      
      setPlatformPricing(pricing);
    } else if (!loading) {
      // Initialize with empty pricing if no data
      const initialPricing: PlatformPricing[] = [];
      ORDER_TYPES.forEach(orderType => {
        PLATFORMS.forEach(platform => {
          initialPricing.push({
            platform: platform.id,
            serviceType: orderType.id,
            price: 0,
            isActive: false,
          });
        });
      });
      setPlatformPricing(initialPricing);
    }
    
    if (fetchedPackages.length > 0) {
      setComboPackages(fetchedPackages);
    }
  }, [platformServices, fetchedPackages, loading]);

  // Handle price change for platform services
  const handlePriceChange = (platform: string, serviceType: string, price: string) => {
    setPlatformPricing(prev => 
      prev.map(item => 
        item.platform === platform && item.serviceType === serviceType
          ? { ...item, price: parseInt(price) || 0, isActive: parseInt(price) > 0 }
          : item
      )
    );
  };

  // Save platform pricing changes
  const handleSavePricing = async () => {
    if (!influencerId) return;
    
    setIsSaving(true);
    try {
      // Filter only active prices
      const activePricing = platformPricing.filter(p => p.price > 0);
      
      // Get existing pricing records
      const { data: existingPricing } = await supabase
        .from('influencer_pricing')
        .select('id, platform, service_type')
        .eq('influencer_id', influencerId);
      
      // Prepare upsert data
      const upsertData = activePricing.map(p => ({
        influencer_id: influencerId,
        platform: p.platform,
        service_type: p.serviceType,
        price: p.price,
        is_active: true,
      }));
      
      // Upsert the data
      const { error } = await supabase
        .from('influencer_pricing')
        .upsert(upsertData, { 
          onConflict: 'influencer_id, platform, service_type' 
        });
      
      if (error) throw error;
      
      // Handle any pricing that was removed (set to 0)
      const pricingToDeactivate = platformPricing.filter(p => p.price === 0 && p.isActive);
      
      if (pricingToDeactivate.length > 0) {
        for (const item of pricingToDeactivate) {
          await supabase
            .from('influencer_pricing')
            .update({ is_active: false })
            .eq('influencer_id', influencerId)
            .eq('platform', item.platform)
            .eq('service_type', item.serviceType);
        }
      }
      
      toast.success('Pricing updated successfully');
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing');
    } finally {
      setIsSaving(false);
    }
  };

  // Create a new package
  const handleCreatePackage = async () => {
    if (!influencerId || !newPackage.name || !newPackage.price || 
        newPackage.platforms.length === 0 || newPackage.orderTypes.length === 0) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('influencer_packages')
        .insert({
          influencer_id: influencerId,
          name: newPackage.name,
          description: newPackage.description,
          platforms: newPackage.platforms,
          service_types: newPackage.orderTypes,
          price: newPackage.price,
          delivery_days: newPackage.deliveryDays,
          is_featured: newPackage.isFeatured,
          is_active: true,
        })
        .select();
      
      if (error) throw error;
      
      if (data) {
        const newPackageData = data[0] as unknown as ComboPackage;
        setComboPackages(prev => [...prev, newPackageData]);
        setIsNewPackageOpen(false);
        setNewPackage({
          name: '',
          description: '',
          platforms: [],
          orderTypes: [],
          price: 0,
          deliveryDays: 3,
          isFeatured: false,
        });
        toast.success('Package created successfully');
      }
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error('Failed to create package');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a package
  const handleDeletePackage = async (packageId: string) => {
    if (!influencerId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('influencer_packages')
        .delete()
        .eq('id', packageId)
        .eq('influencer_id', influencerId);
      
      if (error) throw error;
      
      setComboPackages(prev => prev.filter(p => p.id !== packageId));
      toast.success('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle package featured status
  const handleToggleFeatured = async (packageId: string, isFeatured: boolean) => {
    if (!influencerId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('influencer_packages')
        .update({ is_featured: !isFeatured })
        .eq('id', packageId)
        .eq('influencer_id', influencerId);
      
      if (error) throw error;
      
      setComboPackages(prev => 
        prev.map(p => p.id === packageId ? { ...p, is_featured: !isFeatured } : p)
      );
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Failed to update package');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to check if a platform supports a service type
  const isPlatformServiceSupported = (platform: string, serviceType: string) => {
    return PLATFORM_ORDER_TYPES[platform as keyof typeof PLATFORM_ORDER_TYPES]?.includes(serviceType);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load pricing data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="platform-pricing" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="platform-pricing">Platform Pricing</TabsTrigger>
          <TabsTrigger value="combo-packages">Combo Packages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="platform-pricing" className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Set Your Pricing for Each Platform</h2>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Service Type</TableHead>
                      {PLATFORMS.map(platform => (
                        <TableHead key={platform.id} className="text-center">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <platform.icon className="h-5 w-5" />
                            <span>{platform.name}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ORDER_TYPES.map(orderType => (
                      <TableRow key={orderType.id}>
                        <TableCell className="align-middle">
                          <div className="flex items-center gap-1">
                            {orderType.name}
                            <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" 
                              title={orderType.description} />
                          </div>
                        </TableCell>
                        
                        {PLATFORMS.map(platform => {
                          const isSupported = isPlatformServiceSupported(platform.id, orderType.id);
                          const pricing = platformPricing.find(
                            p => p.platform === platform.id && p.serviceType === orderType.id
                          );
                          
                          return (
                            <TableCell key={`${platform.id}-${orderType.id}`} className="text-center">
                              {isSupported ? (
                                <div className="flex items-center justify-center">
                                  <span className="mr-1">₹</span>
                                  <Input
                                    type="number"
                                    value={pricing?.price || 0}
                                    min={0}
                                    onChange={(e) => handlePriceChange(
                                      platform.id, 
                                      orderType.id, 
                                      e.target.value
                                    )}
                                    className="w-20 text-center"
                                  />
                                </div>
                              ) : (
                                <div className="text-gray-400">N/A</div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSavePricing} disabled={isSaving} className="px-8">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="combo-packages" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Your Combo Packages</h2>
                <Button onClick={() => setIsNewPackageOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Package
                </Button>
              </div>
              
              {comboPackages.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No Packages Yet</h3>
                  <p className="text-gray-400 mb-4">Create combo packages to offer bundle deals to your clients</p>
                  <Button onClick={() => setIsNewPackageOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Package
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package Name</TableHead>
                        <TableHead>Platforms</TableHead>
                        <TableHead>Content Types</TableHead>
                        <TableHead>Price (₹)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comboPackages.map((pkg) => (
                        <TableRow key={pkg.id} className={pkg.is_featured ? "bg-amber-50" : ""}>
                          <TableCell>
                            <div className="font-medium">
                              {pkg.name}
                              {pkg.is_featured && (
                                <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            {pkg.description && (
                              <div className="text-xs text-gray-500 mt-1">{pkg.description}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {pkg.platforms.map(p => {
                                const platform = PLATFORMS.find(plat => plat.id === p);
                                if (platform) {
                                  const Icon = platform.icon;
                                  return <Icon key={p} className="h-4 w-4" />;
                                }
                                return null;
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {Array.isArray(pkg.service_types) ? 
                              pkg.service_types
                                .map(st => ORDER_TYPES.find(ot => ot.id === st)?.name || st)
                                .join(', ') : 
                              'Various'
                            }
                          </TableCell>
                          <TableCell>₹{pkg.price?.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleFeatured(pkg.id, pkg.is_featured)}
                                title={pkg.is_featured ? "Unmark as featured" : "Mark as featured"}
                              >
                                <span className={`text-amber-500 ${!pkg.is_featured && 'opacity-50'}`}>★</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeletePackage(pkg.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Package Dialog */}
      <Dialog open={isNewPackageOpen} onOpenChange={setIsNewPackageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="package-name">Package Name</Label>
              <Input 
                id="package-name" 
                value={newPackage.name} 
                onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                placeholder="e.g. Complete Social Bundle" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Platforms Included</Label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`platform-${platform.id}`} 
                      checked={newPackage.platforms.includes(platform.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewPackage({
                            ...newPackage, 
                            platforms: [...newPackage.platforms, platform.id]
                          });
                        } else {
                          setNewPackage({
                            ...newPackage, 
                            platforms: newPackage.platforms.filter(p => p !== platform.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`platform-${platform.id}`} className="flex items-center gap-1">
                      <platform.icon className="h-4 w-4" />
                      <span>{platform.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Content Types Included</Label>
              <div className="flex flex-wrap gap-3">
                {ORDER_TYPES.map((orderType) => (
                  <div key={orderType.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`order-type-${orderType.id}`}
                      checked={newPackage.orderTypes.includes(orderType.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewPackage({
                            ...newPackage, 
                            orderTypes: [...newPackage.orderTypes, orderType.id]
                          });
                        } else {
                          setNewPackage({
                            ...newPackage, 
                            orderTypes: newPackage.orderTypes.filter(ot => ot !== orderType.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`order-type-${orderType.id}`}>{orderType.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="package-price">Package Price (₹)</Label>
                <Input 
                  id="package-price" 
                  type="number"
                  min={0}
                  value={newPackage.price || ''}
                  onChange={(e) => setNewPackage({
                    ...newPackage, 
                    price: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="delivery-days">Delivery Time (days)</Label>
                <Input 
                  id="delivery-days" 
                  type="number"
                  min={1}
                  value={newPackage.deliveryDays}
                  onChange={(e) => setNewPackage({
                    ...newPackage, 
                    deliveryDays: parseInt(e.target.value) || 3
                  })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="package-description">Description (Optional)</Label>
              <Input 
                id="package-description"
                value={newPackage.description}
                onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                placeholder="What's included in this package"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="is-featured"
                checked={newPackage.isFeatured}
                onCheckedChange={(checked) => {
                  setNewPackage({...newPackage, isFeatured: !!checked});
                }}
              />
              <Label htmlFor="is-featured">Mark as featured package</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNewPackageOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePackage}
              disabled={isSaving || !newPackage.name || !newPackage.price || 
                newPackage.platforms.length === 0 || newPackage.orderTypes.length === 0}
            >
              {isSaving ? 'Creating...' : 'Create Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingDashboard;
