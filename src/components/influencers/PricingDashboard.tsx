
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Instagram, Facebook, Youtube, Twitter, Info, Plus, Pencil, Trash, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ComboPackage, PlatformPricing, usePricingData } from '@/hooks/usePricingData';

const SERVICE_TYPES = [
  { id: 'post', name: 'Image Post', tooltip: 'Static image content with caption' },
  { id: 'video', name: 'Video Post', tooltip: 'Long-form video content (> 1 minute)' },
  { id: 'reel', name: 'Reel/Short', tooltip: 'Short vertical video content (< 1 minute)' },
  { id: 'story', name: 'Story', tooltip: 'Content that disappears after 24 hours' },
  { id: 'poll', name: 'Poll', tooltip: 'Interactive voting content' }
];

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' }
];

// Define which service types are available on which platforms
const PLATFORM_SERVICE_COMPATIBILITY = {
  instagram: ['post', 'video', 'reel', 'story', 'poll'],
  facebook: ['post', 'video', 'reel', 'story', 'poll'],
  youtube: ['video', 'reel'],
  twitter: ['post', 'video', 'poll']
};

type PricingFormState = {
  [platform: string]: {
    [serviceType: string]: string; // String for input handling
  }
};

interface PricingDashboardProps {
  influencerId?: string;
}

const PricingDashboard: React.FC<PricingDashboardProps> = ({ influencerId }) => {
  const { toast } = useToast();
  const { 
    platformPricing,
    comboPackages,
    loading, 
    error, 
    updatePlatformPrice,
    savePackage,
    updatePackage,
    deletePackage
  } = usePricingData(influencerId);
  
  const [pricingForm, setPricingForm] = useState<PricingFormState>({});
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [packageFormData, setPackageFormData] = useState<Partial<ComboPackage>>({
    name: '',
    description: '',
    platforms: [],
    service_types: [],
    price: 0,
    delivery_days: 3,
    is_featured: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  // Initialize form with data from the hook
  useEffect(() => {
    if (platformPricing && !loading) {
      const initialForm: PricingFormState = {};
      
      PLATFORMS.forEach(platform => {
        initialForm[platform.id] = {};
        SERVICE_TYPES.forEach(service => {
          const price = platformPricing[platform.id]?.[service.id] ?? '';
          initialForm[platform.id][service.id] = price !== null && price !== undefined ? String(price) : '';
        });
      });
      
      setPricingForm(initialForm);
    }
  }, [platformPricing, loading]);

  const handlePriceChange = (platform: string, serviceType: string, value: string) => {
    setPricingForm(prev => ({
      ...prev,
      [platform]: {
        ...(prev[platform] || {}),
        [serviceType]: value
      }
    }));
  };

  const handleSavePricing = async () => {
    let hasChanges = false;
    
    // Loop through all platforms and service types to update prices
    for (const platform of PLATFORMS) {
      for (const service of SERVICE_TYPES) {
        // Skip if service is not available on platform
        if (!PLATFORM_SERVICE_COMPATIBILITY[platform.id].includes(service.id)) continue;
        
        const inputValue = pricingForm[platform.id]?.[service.id] || '';
        const currentValue = platformPricing[platform.id]?.[service.id];
        
        // Convert empty string to null, otherwise parse as number
        const newValue = inputValue === '' ? null : parseFloat(inputValue);
        
        // Only update if value has changed
        if (newValue !== currentValue) {
          await updatePlatformPrice(platform.id, service.id, newValue);
          hasChanges = true;
        }
      }
    }
    
    if (hasChanges) {
      toast({
        title: "Prices Updated",
        description: "Your pricing changes have been saved successfully.",
      });
    } else {
      toast({
        title: "No Changes",
        description: "No pricing changes were detected.",
      });
    }
  };

  const openNewPackageDialog = () => {
    setPackageFormData({
      name: '',
      description: '',
      platforms: [],
      service_types: [],
      price: 0,
      delivery_days: 3,
      is_featured: false
    });
    setIsEditing(false);
    setEditingPackageId(null);
    setIsPackageDialogOpen(true);
  };

  const openEditPackageDialog = (pkg: ComboPackage) => {
    setPackageFormData({
      name: pkg.name,
      description: pkg.description || '',
      platforms: pkg.platforms,
      service_types: pkg.service_types,
      price: pkg.price,
      delivery_days: pkg.delivery_days,
      is_featured: pkg.is_featured
    });
    setIsEditing(true);
    setEditingPackageId(pkg.id);
    setIsPackageDialogOpen(true);
  };

  const handlePackageFormChange = (field: string, value: any) => {
    setPackageFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePlatform = (platform: string) => {
    setPackageFormData(prev => {
      const platforms = [...(prev.platforms || [])];
      const index = platforms.indexOf(platform);
      
      if (index === -1) {
        platforms.push(platform);
      } else {
        platforms.splice(index, 1);
      }
      
      return { ...prev, platforms };
    });
  };

  const toggleServiceType = (serviceType: string) => {
    setPackageFormData(prev => {
      const serviceTypes = [...(prev.service_types || [])];
      const index = serviceTypes.indexOf(serviceType);
      
      if (index === -1) {
        serviceTypes.push(serviceType);
      } else {
        serviceTypes.splice(index, 1);
      }
      
      return { ...prev, service_types: serviceTypes };
    });
  };

  const handleSavePackage = async () => {
    // Validate required fields
    if (!packageFormData.name || !packageFormData.platforms?.length || !packageFormData.service_types?.length) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isEditing && editingPackageId) {
        const success = await updatePackage(editingPackageId, packageFormData);
        if (success) {
          toast({
            title: "Package Updated",
            description: "Your package has been updated successfully."
          });
        }
      } else {
        const result = await savePackage(packageFormData as Omit<ComboPackage, 'id' | 'influencer_id' | 'is_active'>);
        if (result) {
          toast({
            title: "Package Created",
            description: "Your new package has been created successfully."
          });
        }
      }
      
      setIsPackageDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your package.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      const success = await deletePackage(id);
      
      if (success) {
        toast({
          title: "Package Deleted",
          description: "The package has been deleted successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem deleting the package.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Unified Pricing Table Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Platform Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full overflow-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Content Type</TableHead>
                    {PLATFORMS.map((platform) => (
                      <TableHead key={platform.id} className="text-center">
                        <div className="flex flex-col items-center justify-center">
                          <platform.icon className={`h-5 w-5 ${platform.color}`} />
                          <span className="mt-1 text-xs">{platform.name}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SERVICE_TYPES.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex items-center gap-1">
                              {service.name}
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{service.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      
                      {PLATFORMS.map((platform) => {
                        const isCompatible = PLATFORM_SERVICE_COMPATIBILITY[platform.id].includes(service.id);
                        
                        return (
                          <TableCell key={`${platform.id}-${service.id}`} className="text-center">
                            {isCompatible ? (
                              <div className="flex items-center">
                                <span className="text-muted-foreground mr-1">₹</span>
                                <Input
                                  type="number"
                                  min="0"
                                  value={pricingForm[platform.id]?.[service.id] || ''}
                                  onChange={(e) => handlePriceChange(platform.id, service.id, e.target.value)}
                                  className="w-24 text-right"
                                  placeholder="Price"
                                />
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSavePricing}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Combo Packages Management Section */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Combo Packages</CardTitle>
          <Button onClick={openNewPackageDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Package
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full overflow-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Content Types</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Delivery (Days)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comboPackages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No packages created yet. Click "Add New Package" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    comboPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {pkg.platforms.map(platformId => {
                              const platform = PLATFORMS.find(p => p.id === platformId);
                              if (platform) {
                                return (
                                  <platform.icon 
                                    key={platformId} 
                                    className={`h-4 w-4 ${platform.color}`} 
                                  />
                                );
                              }
                              return null;
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {pkg.service_types?.map(serviceId => {
                            const service = SERVICE_TYPES.find(s => s.id === serviceId);
                            return service ? service.name : '';
                          }).join(', ')}
                        </TableCell>
                        <TableCell>₹{pkg.price}</TableCell>
                        <TableCell>{pkg.delivery_days || 3} days</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditPackageDialog(pkg)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePackage(pkg.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Package Create/Edit Dialog */}
      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Package' : 'Create New Package'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update your combo package details below.' 
                : 'Create a new combo package with selected platforms and services.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={packageFormData.name || ''}
                onChange={(e) => handlePackageFormChange('name', e.target.value)}
                className="col-span-3"
                placeholder="Package Name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Platforms
              </Label>
              <div className="flex flex-wrap gap-3 col-span-3">
                {PLATFORMS.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`platform-${platform.id}`}
                      checked={(packageFormData.platforms || []).includes(platform.id)}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                    <Label 
                      htmlFor={`platform-${platform.id}`}
                      className="flex items-center"
                    >
                      <platform.icon className={`h-4 w-4 mr-1 ${platform.color}`} />
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Content Types
              </Label>
              <div className="flex flex-wrap gap-3 col-span-3">
                {SERVICE_TYPES.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`service-${service.id}`}
                      checked={(packageFormData.service_types || []).includes(service.id)}
                      onCheckedChange={() => toggleServiceType(service.id)}
                    />
                    <Label htmlFor={`service-${service.id}`}>
                      {service.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (₹)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={packageFormData.price || ''}
                onChange={(e) => handlePackageFormChange('price', parseFloat(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="delivery" className="text-right">
                Delivery Days
              </Label>
              <Input
                id="delivery"
                type="number"
                min="1"
                max="30"
                value={packageFormData.delivery_days || ''}
                onChange={(e) => handlePackageFormChange('delivery_days', parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={packageFormData.description || ''}
                onChange={(e) => handlePackageFormChange('description', e.target.value)}
                className="col-span-3"
                placeholder="Package description (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                Featured
              </div>
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured"
                    checked={packageFormData.is_featured || false}
                    onCheckedChange={(checked) => handlePackageFormChange('is_featured', checked)}
                  />
                  <Label htmlFor="featured">
                    Highlight as featured package
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePackage}>
              {isEditing ? 'Update Package' : 'Create Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingDashboard;
