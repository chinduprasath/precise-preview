import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, X, Info, Instagram, Facebook, Youtube, Edit, Plus, Eye, EyeOff } from 'lucide-react';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
}

const allPlatformServices = [
  { 
    id: 'post', 
    name: 'Post Image/Video', 
    price: '499₹', 
    platforms: ['instagram', 'facebook', 'youtube', 'twitter'],
    tooltip: 'Standard feed post with an image or video provided by the brand.'
  },
  { 
    id: 'reel', 
    name: 'Reels/Shorts', 
    price: '499₹', 
    platforms: ['instagram', 'facebook', 'youtube'],
    tooltip: 'Vertical short video (15–90 sec) for high engagement. Suitable for Instagram, Facebook, YouTube Shorts.'
  },
  { 
    id: 'story', 
    name: 'Story (Image/Video)', 
    price: '499₹', 
    platforms: ['instagram', 'facebook'],
    tooltip: 'Temporary 24-hour image/video post. Great for timely promotions.'
  },
  { 
    id: 'in-video-promotion', 
    name: 'In-Video Promotion (<10 min)', 
    price: '499₹', 
    platforms: ['youtube'],
    tooltip: 'Brand mention or product feature integrated inside influencer\'s YouTube video. Typically 1–5 mins.'
  },
  { 
    id: 'promotions-long', 
    name: 'Promotions (>10 min)', 
    price: '499₹', 
    platforms: ['youtube'],
    tooltip: 'Long-form brand video (provided by business) uploaded to influencer\'s YouTube channel. Best for detailed content.'
  },
  { 
    id: 'polls', 
    name: 'Polls', 
    price: '499₹', 
    platforms: ['twitter'],
    tooltip: 'Only supported on Twitter/X. Allows voting and result extraction via API.'
  },
  { 
    id: 'visit-promote', 
    name: 'Visit & Promote', 
    price: '₹1000 – ₹5000', 
    platforms: ['instagram', 'facebook', 'youtube', 'twitter'],
    tooltip: 'Influencer visits your location, creates real-time content (Reels/Stories), and publishes it to promote footfall.',
    isVisitPromote: true
  },
];

const customPackages = [
  { 
    id: 'package1', 
    name: 'Brand Boost', 
    platforms: ['instagram', 'facebook'],
    description: 'Perfect for product launches and brand awareness',
    price: '₹899',
    tooltip: 'Includes one main feed post on Instagram and one 24-hour story on Facebook. Content must be provided by business.',
    serviceTypes: ['Post Image/Video', 'Story']
  },
  { 
    id: 'package2', 
    name: 'Social Combo', 
    platforms: ['instagram', 'facebook', 'youtube'],
    description: 'Maximum reach across all major platforms',
    price: '₹1499',
    tooltip: 'Cross-platform promotion with short-form video content on Instagram, standard post on Facebook, and YouTube Short. All content provided by business.',
    serviceTypes: ['Reels/Shorts', 'In-Video Promotion']
  },
  { 
    id: 'package3', 
    name: 'Video Power Pack', 
    platforms: ['youtube', 'instagram'],
    description: 'Great for detailed product demos and tutorials',
    price: '₹2199',
    tooltip: 'Includes one full YouTube video (up to 10 minutes) plus one Instagram reel post. Perfect for in-depth product showcases.',
    serviceTypes: ['In-Video Promotion', 'Detailed Product Demo']
  },
];

const availablePlatforms = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'twitter', name: 'Twitter/X' },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="h-4 w-4 text-pink-500" />;
    case 'facebook':
      return <Facebook className="h-4 w-4 text-blue-600" />;
    case 'youtube':
      return <Youtube className="h-4 w-4 text-red-500" />;
    case 'twitter':
      return <div className="h-4 w-4 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold">X</div>;
    default:
      return null;
  }
};

// Custom MultiSelect Component
interface MultiSelectProps {
  options: Array<{ id: string; name: string; icon?: React.ReactNode }>;
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const selectedOptions = options.filter(option => selectedValues.includes(option.id));
  const displayText = selectedOptions.length > 0 
    ? `${selectedOptions.length} selected` 
    : placeholder;

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            {displayText}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div 
                key={option.id}
                className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 cursor-pointer"
                onClick={() => handleToggle(option.id)}
              >
                <Checkbox
                  checked={selectedValues.includes(option.id)}
                  onChange={() => {}} // Handled by onClick
                />
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="text-sm font-medium leading-none">
                    {option.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  influencerId,
  influencerName,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAccountInfluencer = location.pathname.startsWith('/account/influencer');
  const { toast } = useToast();
  const [selectedOrderType, setSelectedOrderType] = useState<string>('');
  const [selectedCustomPackage, setSelectedCustomPackage] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [isPlatformEditOpen, setIsPlatformEditOpen] = useState(false);
  const [isCustomEditOpen, setIsCustomEditOpen] = useState(false);
  const [arePlatformPricesHidden, setArePlatformPricesHidden] = useState(false);
  const [platformEditSelected, setPlatformEditSelected] = useState<Record<string, boolean>>({});
  const [editableCustomPackages, setEditableCustomPackages] = useState(customPackages);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [newCustomPackage, setNewCustomPackage] = useState({
    title: '',
    tagline: '',
    platforms: [] as string[],
    services: [] as string[],
    price: ''
  });
  
  // Platform-specific pricing state
  const [platformPricing, setPlatformPricing] = useState<Record<string, Record<string, string>>>(() => {
    const initialPricing: Record<string, Record<string, string>> = {};
    allPlatformServices.forEach(service => {
      initialPricing[service.id] = {};
      service.platforms.forEach(platform => {
        initialPricing[service.id][platform] = service.price;
      });
    });
    return initialPricing;
  });

  // Filter services based on selected platform (single selection)
  const filteredServices = useMemo(() => {
    const base = selectedPlatform
      ? allPlatformServices.filter(service => service.platforms.includes(selectedPlatform))
      : allPlatformServices;
    return base;
  }, [selectedPlatform]);

  const handleOrderTypeChange = (orderTypeId: string) => {
    setSelectedOrderType(orderTypeId);
  };

  const handleCustomPackageChange = (packageId: string) => {
    setSelectedCustomPackage(packageId);
  };

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setPlatformDropdownOpen(false);
  };

  const removePlatform = () => {
    setSelectedPlatform('');
  };

  const handlePlatformPriceUpdate = (serviceId: string, platform: string, newPrice: string) => {
    setPlatformPricing(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [platform]: newPrice
      }
    }));
  };

  const handleCustomPackagePriceUpdate = (packageId: string, newPrice: string) => {
    setEditableCustomPackages(prev => 
      prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, price: newPrice }
          : pkg
      )
    );
  };

  const handleAddCustomPackage = () => {
    if (!newCustomPackage.title || !newCustomPackage.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and price fields.",
        variant: "destructive"
      });
      return;
    }

    const newPackage = {
      id: `package${Date.now()}`,
      name: newCustomPackage.title,
      platforms: newCustomPackage.platforms,
      description: newCustomPackage.tagline,
      price: newCustomPackage.price,
      tooltip: newCustomPackage.tagline,
      serviceTypes: newCustomPackage.services
    };

    setEditableCustomPackages(prev => [...prev, newPackage]);
    setNewCustomPackage({
      title: '',
      tagline: '',
      platforms: [],
      services: [],
      price: ''
    });
    setIsAddCustomOpen(false);
    
    toast({
      title: "Package Added",
      description: "Your custom package has been added successfully.",
    });
  };

  const handleSavePrices = () => {
    // Here you would typically save to a database or API
    toast({
      title: "Prices Updated",
      description: "Your service prices have been successfully updated.",
    });
    setIsPlatformEditOpen(false);
    setIsCustomEditOpen(false);
  };

  const hasVisitPromoteSelected = selectedOrderType === 'visit-promote';

  const handleBook = () => {
    const hasOrderTypeSelected = selectedOrderType !== '';
    const hasCustomPackageSelected = selectedCustomPackage !== '';
    
    if (!hasOrderTypeSelected && !hasCustomPackageSelected) {
      toast({
        title: "No items selected",
        description: "Please select at least one service or package",
        variant: "destructive"
      });
      return;
    }

    const selectedItems = [];
    if (hasOrderTypeSelected) {
      selectedItems.push(selectedOrderType);
    }
    if (hasCustomPackageSelected) {
      selectedItems.push(selectedCustomPackage);
    }

    if (hasVisitPromoteSelected) {
      // For Visit & Promote, trigger review flow
      navigate('/orders/review', { 
        state: { 
          influencerId, 
          influencerName, 
          selectedItems,
          isVisitPromote: true
        } 
      });
    } else {
      navigate('/orders/place', { 
        state: { 
          influencerId, 
          influencerName, 
          selectedItems 
        } 
      });
    }
  };

  const selectedPlatformName = selectedPlatform ? 
    availablePlatforms.find(p => p.id === selectedPlatform)?.name : 
    'Select Platform';

  return (
    <TooltipProvider>
      <div className="space-y-8">

        <Tabs defaultValue="platform" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="platform">Platform Based</TabsTrigger>
            <TabsTrigger value="custom">Custom Package</TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="mt-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Platform Services</h3>
                  <div className="flex items-center gap-2">
                    <Popover open={platformDropdownOpen} onOpenChange={setPlatformDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={platformDropdownOpen}
                        className="w-48 justify-between"
                      >
                        {selectedPlatformName}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="end">
                      <div className="p-2 space-y-1">
                        {availablePlatforms.map((platform) => (
                          <div 
                            key={platform.id}
                            className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 cursor-pointer"
                            onClick={() => handlePlatformSelect(platform.id)}
                          >
                            <span className="text-sm font-medium leading-none">
                              {platform.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                    </Popover>
                    {isAccountInfluencer && (
                      <>
                        <Button variant="outline" onClick={() => setIsPlatformEditOpen(true)}>
                          Edit
                        </Button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              {arePlatformPricesHidden ? 'Unhide' : 'Hide'}
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-44 p-0" align="end">
                            <div className="p-1">
                              <button className="w-full text-left px-3 py-2 hover:bg-accent rounded-md text-sm"
                                onClick={() => setArePlatformPricesHidden(true)}
                              >Hide</button>
                              <button className="w-full text-left px-3 py-2 hover:bg-accent rounded-md text-sm"
                                onClick={() => setArePlatformPricesHidden(false)}
                              >Unhide</button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </>
                    )}
                  </div>
                </div>
                
                {selectedPlatform && (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedPlatformName}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={removePlatform}
                      />
                    </Badge>
                  </div>
                )}
                
                {filteredServices.length > 0 ? (
                  <div className="space-y-3">
                    <RadioGroup value={selectedOrderType} onValueChange={handleOrderTypeChange}>
                      {filteredServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={service.id} id={service.id} />
                            <div className="flex items-center gap-2">
                              <label htmlFor={service.id} className="text-sm font-medium cursor-pointer">
                                {service.name}
                              </label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">{service.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-primary">{arePlatformPricesHidden ? '******' : service.price}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ) : selectedPlatform ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No order types available for selected platform.</p>
                    <p className="text-sm mt-1">Try selecting a different platform.</p>
                  </div>
                ) : null}
              </div>
            </Card>
            {/* Platform Edit Dialog */}
            <Dialog open={isPlatformEditOpen} onOpenChange={setIsPlatformEditOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Platform Based Prices</DialogTitle>
                  <DialogDescription>Update prices for each platform per service.</DialogDescription>
                </DialogHeader>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-medium">Services</th>
                        <th className="text-center p-4 font-medium">Instagram</th>
                        <th className="text-center p-4 font-medium">Facebook</th>
                        <th className="text-center p-4 font-medium">YouTube</th>
                        <th className="text-center p-4 font-medium">Twitter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPlatformServices.map((service) => (
                        <tr key={service.id} className="border-t align-top">
                          <td className="p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={!!platformEditSelected[service.id]}
                                onCheckedChange={(checked) => setPlatformEditSelected(prev => ({ ...prev, [service.id]: !!checked }))}
                              />
                              <div>
                                <div className="font-medium">{service.name}</div>
                                <div className="text-sm text-muted-foreground">{service.tooltip}</div>
                              </div>
                            </div>
                          </td>
                          {availablePlatforms.map((platform) => (
                            <td key={platform.id} className="p-4 text-center">
                              {service.platforms.includes(platform.id) ? (
                                <Input
                                  value={arePlatformPricesHidden ? '******' : (platformPricing[service.id]?.[platform.id] || '')}
                                  onChange={(e) => handlePlatformPriceUpdate(service.id, platform.id, e.target.value)}
                                  className="w-24 text-center"
                                  placeholder="₹499"
                                />
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPlatformEditOpen(false)}>Close</Button>
                  <Button onClick={handleSavePrices}>Update Prices</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="custom" className="mt-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Custom Packages</h3>
                    {isAccountInfluencer && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setIsCustomEditOpen(true)}>Edit</Button>
                        <Button variant="outline" onClick={() => setIsAddCustomOpen(true)} className="flex items-center gap-2">
                          <Plus className="h-4 w-4" /> Add
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose a multi-platform promotion package designed by the influencer. These bundles include posts across 2 or more platforms at a fixed price. Content must be provided by the business.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <RadioGroup value={selectedCustomPackage} onValueChange={handleCustomPackageChange}>
                    {editableCustomPackages.map((pkg) => (
                      <div key={pkg.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors relative">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <RadioGroupItem value={pkg.id} id={pkg.id} className="mt-1" />
                            <div className="flex-1 space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <label htmlFor={pkg.id} className="text-base font-semibold cursor-pointer">
                                    {pkg.name}
                                  </label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="text-sm">{pkg.tooltip}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{pkg.description}</p>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground">Platforms:</span>
                                {pkg.platforms.map((platform) => (
                                  <div key={platform} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                                    <PlatformIcon platform={platform} />
                                    <span className="text-xs font-medium capitalize">{platform}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-lg font-bold text-primary">{pkg.price}</span>
                          </div>
                        </div>
                        
                        {/* Service Types Section - Bottom Right */}
                        <div className="absolute bottom-3 right-3">
                          <div className="text-right">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Includes</div>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {pkg.serviceTypes.map((serviceType, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline" 
                                  className="text-xs px-2 py-0.5 bg-background/80 border-muted-foreground/20"
                                >
                                  {serviceType}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </Card>
            {/* Custom Packages Edit Dialog */}
            <Dialog open={isCustomEditOpen} onOpenChange={setIsCustomEditOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Custom Packages</DialogTitle>
                  <DialogDescription>Update package titles, platforms, services and price.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {editableCustomPackages.map((pkg) => (
                    <div key={pkg.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input value={pkg.name} onChange={(e) => setEditableCustomPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, name: e.target.value } : p))} />
                        </div>
                        <div>
                          <Label>Price</Label>
                          <Input value={pkg.price} onChange={(e) => handleCustomPackagePriceUpdate(pkg.id, e.target.value)} />
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label>Description</Label>
                        <Input value={pkg.description} onChange={(e) => setEditableCustomPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, description: e.target.value } : p))} />
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Platforms</Label>
                          <MultiSelect
                            options={availablePlatforms.map(platform => ({ id: platform.id, name: platform.name, icon: <PlatformIcon platform={platform.id} /> }))}
                            selectedValues={pkg.platforms}
                            onSelectionChange={(values) => setEditableCustomPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, platforms: values } : p))}
                            placeholder="Select platforms"
                          />
                        </div>
                        <div>
                          <Label>Services</Label>
                          <MultiSelect
                            options={allPlatformServices.map(service => ({ id: service.id, name: service.name }))}
                            selectedValues={pkg.serviceTypes as any}
                            onSelectionChange={(values) => setEditableCustomPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, serviceTypes: values as any } : p))}
                            placeholder="Select services"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCustomEditOpen(false)}>Close</Button>
                  <Button onClick={handleSavePrices}>Update Packages</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Add Custom Package Dialog */}
            <Dialog open={isAddCustomOpen} onOpenChange={setIsAddCustomOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Custom Package</DialogTitle>
                  <DialogDescription>Create a new bundle with platforms, services and a price.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-title">Title</Label>
                    <Input id="new-title" value={newCustomPackage.title} onChange={(e) => setNewCustomPackage(prev => ({ ...prev, title: e.target.value }))} placeholder="Brand Boost" />
                  </div>
                  <div>
                    <Label htmlFor="new-price">Price</Label>
                    <Input id="new-price" value={newCustomPackage.price} onChange={(e) => setNewCustomPackage(prev => ({ ...prev, price: e.target.value }))} placeholder="₹999" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="new-desc">Description</Label>
                    <Input id="new-desc" value={newCustomPackage.tagline} onChange={(e) => setNewCustomPackage(prev => ({ ...prev, tagline: e.target.value }))} placeholder="Perfect for launches" />
                  </div>
                  <div>
                    <Label>Platforms</Label>
                    <MultiSelect
                      options={availablePlatforms.map(platform => ({ id: platform.id, name: platform.name, icon: <PlatformIcon platform={platform.id} /> }))}
                      selectedValues={newCustomPackage.platforms}
                      onSelectionChange={(values) => setNewCustomPackage(prev => ({ ...prev, platforms: values }))}
                      placeholder="Select platforms"
                    />
                  </div>
                  <div>
                    <Label>Services</Label>
                    <MultiSelect
                      options={allPlatformServices.map(service => ({ id: service.id, name: service.name }))}
                      selectedValues={newCustomPackage.services}
                      onSelectionChange={(values) => setNewCustomPackage(prev => ({ ...prev, services: values }))}
                      placeholder="Select services"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCustomOpen(false)}>Close</Button>
                  <Button onClick={handleAddCustomPackage}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button 
            onClick={handleBook}
            className="px-12"
          >
            {hasVisitPromoteSelected ? 'Send for Review' : 'Book'}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PricesTabContent;
