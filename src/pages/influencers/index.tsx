import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Twitter, Youtube, Search, ChevronDown, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import HashtagInput from '@/components/filters/HashtagInput';
import RangeSlider from '@/components/filters/RangeSlider';
import { useLocations } from '@/hooks/useLocations';
import { useNiches } from '@/hooks/useNiches';
import { useHashtags } from '@/hooks/useHashtags';
import { useInfluencers, InfluencerFilters } from '@/hooks/useInfluencers';
import { Influencer } from '@/types/location';
import { Skeleton } from '@/components/ui/skeleton';
import PricesTabContent from '@/components/influencers/PricesTabContent';
import DataTabContent from '@/components/influencers/DataTabContent';
import ServicesTabContent from '@/components/influencers/ServicesTabContent';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
const InfluencerListItem = ({
  influencer,
  isSelected,
  onClick
}: {
  influencer: Influencer;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return <div onClick={onClick} className={`flex items-center gap-3 py-3 hover:bg-secondary/50 rounded-lg px-2 transition-colors cursor-pointer ${isSelected ? 'bg-secondary/70' : ''}`}>
      <Avatar className="h-12 w-12">
        <img src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} alt={influencer.name} className="h-full w-full object-cover" />
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{influencer.name}</h3>
        <div className="flex flex-wrap gap-x-4 mt-1">
          {influencer.followers_instagram > 0 && <div className="flex items-center gap-1">
              <Instagram className="h-4 w-4 text-social-instagram" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_instagram)}</span>
            </div>}
          {influencer.followers_facebook > 0 && <div className="flex items-center gap-1">
              <Facebook className="h-4 w-4 text-social-facebook" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_facebook)}</span>
            </div>}
          {influencer.followers_twitter > 0 && <div className="flex items-center gap-1">
              <Twitter className="h-4 w-4 text-social-twitter" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_twitter)}</span>
            </div>}
          {influencer.followers_youtube > 0 && <div className="flex items-center gap-1">
              <Youtube className="h-4 w-4 text-social-youtube" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_youtube)}</span>
            </div>}
        </div>
      </div>
    </div>;
};
const InfluencerListSkeleton = () => {
  return <div className="space-y-3 px-2">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>)}
    </div>;
};
const FilterBadge = ({
  label,
  onRemove
}: {
  label: string;
  onRemove: () => void;
}) => <div className="inline-flex items-center bg-secondary/20 text-secondary-foreground text-xs rounded-full px-3 py-1.5">
    <span>{label}</span>
    <Button variant="ghost" size="sm" onClick={onRemove} className="h-auto p-0 ml-1 hover:bg-transparent">
      <X className="h-3 w-3" />
    </Button>
  </div>;
const InfluencerProfile = ({
  influencer
}: {
  influencer: Influencer | null;
}) => {
  if (!influencer) {
    return <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-muted-foreground mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-muted-foreground mb-1">No Profile Selected</h3>
        <p className="text-muted-foreground">Please select an influencer profile to display their data</p>
      </div>;
  }
  return <div className="p-4">
      <div className="mb-6">
        <div className="flex flex-col bg-[#F8F9FA] rounded-lg p-6 py-0 px-[23px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4">
                <img src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} alt={influencer.name} className="h-full w-full object-cover" />
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{influencer.name}</h2>
                <p className="text-sm text-muted-foreground">{influencer.username || '@' + influencer.name.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              {influencer.followers_instagram > 0 && <div className="flex flex-col items-center">
                  <Instagram size={20} className="text-social-instagram mb-1" />
                  <span className="text-sm font-medium">{formatNumber(influencer.followers_instagram)}</span>
                </div>}
              {influencer.followers_facebook > 0 && <div className="flex flex-col items-center">
                  <Facebook size={20} className="text-social-facebook mb-1" />
                  <span className="text-sm font-medium">{formatNumber(influencer.followers_facebook)}</span>
                </div>}
              {influencer.followers_youtube > 0 && <div className="flex flex-col items-center">
                  <Youtube size={20} className="text-social-youtube mb-1" />
                  <span className="text-sm font-medium">{formatNumber(influencer.followers_youtube)}</span>
                </div>}
              {influencer.followers_twitter > 0 && <div className="flex flex-col items-center">
                  <Twitter size={20} className="text-social-twitter mb-1" />
                  <span className="text-sm font-medium">{formatNumber(influencer.followers_twitter)}</span>
                </div>}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
          <TabsTrigger value="prices" className="flex-1">Prices</TabsTrigger>
          <TabsTrigger value="data" className="flex-1">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="mt-0">
          <ServicesTabContent influencerId={influencer.id} influencerName={influencer.name} />
        </TabsContent>
        
        <TabsContent value="prices" className="mt-0">
          <PricesTabContent influencerId={influencer.id} influencerName={influencer.name} />
        </TabsContent>
        
        <TabsContent value="data" className="mt-0">
          <DataTabContent influencerId={influencer.id} />
        </TabsContent>
      </Tabs>
    </div>;
};
const InfluencersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [followerRange, setFollowerRange] = useState<[number, number]>([0, 1500000]);
  const [engagementRange, setEngagementRange] = useState<[number, number]>([0, 10]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedInterests, setSelectedInterests] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    setSelectedCountry,
    setSelectedState,
    setSelectedCity,
    loading: loadingLocations
  } = useLocations();
  const {
    niches,
    selectedNiche,
    setSelectedNiche,
    loading: loadingNiches
  } = useNiches();
  const {
    selectedHashtags,
    setSelectedHashtags,
    addHashtag,
    loading: loadingHashtags
  } = useHashtags();
  const resetFilters = () => {
    setFollowerRange([0, 1500000]);
    setEngagementRange([0, 10]);
    setPriceRange([0, 5000]);
    setSelectedType('');
    setSelectedGender('');
    setSelectedAge('');
    setSelectedInterests('');
    setSelectedPlatform('');
    if (setSelectedCountry) setSelectedCountry('');
    if (setSelectedState) setSelectedState('');
    if (setSelectedCity) setSelectedCity('');
    if (setSelectedNiche) setSelectedNiche('');
    setSelectedHashtags([]);
  };
  const filters: InfluencerFilters = {
    countryId: selectedCountry ? parseInt(selectedCountry) : undefined,
    stateId: selectedState ? parseInt(selectedState) : undefined,
    cityId: selectedCity ? parseInt(selectedCity) : undefined,
    nicheId: selectedNiche ? parseInt(selectedNiche) : undefined,
    hashtags: selectedHashtags.length > 0 ? selectedHashtags : undefined,
    followerRange: followerRange,
    engagementRange: engagementRange
  };
  const {
    influencers,
    selectedInfluencer,
    setSelectedInfluencer,
    loading,
    isInitialLoad
  } = useInfluencers(filters);
  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = searchTerm === '' || influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) || influencer.niche?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false || influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return matchesSearch;
  });
  const handleInfluencerClick = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
  };
  const getActiveFilters = () => {
    const active: {
      label: string;
      onRemove: () => void;
    }[] = [];
    if (selectedCountry) {
      const country = countries.find(c => c.id.toString() === selectedCountry);
      if (country) {
        active.push({
          label: `Country: ${country.name}`,
          onRemove: () => setSelectedCountry('')
        });
      }
    }
    if (selectedState) {
      const state = states.find(s => s.id.toString() === selectedState);
      if (state) {
        active.push({
          label: `State: ${state.name}`,
          onRemove: () => setSelectedState('')
        });
      }
    }
    if (selectedCity) {
      const city = cities.find(c => c.id.toString() === selectedCity);
      if (city) {
        active.push({
          label: `City: ${city.name}`,
          onRemove: () => setSelectedCity('')
        });
      }
    }
    if (selectedNiche) {
      const niche = niches.find(n => n.id.toString() === selectedNiche);
      if (niche) {
        active.push({
          label: `Niche: ${niche.name}`,
          onRemove: () => setSelectedNiche('')
        });
      }
    }
    if (selectedType) {
      active.push({
        label: `Type: ${selectedType}`,
        onRemove: () => setSelectedType('')
      });
    }
    if (selectedPlatform) {
      active.push({
        label: `Platform: ${selectedPlatform}`,
        onRemove: () => setSelectedPlatform('')
      });
    }
    if (selectedAge) {
      active.push({
        label: `Age: ${selectedAge}`,
        onRemove: () => setSelectedAge('')
      });
    }
    if (selectedGender) {
      active.push({
        label: `Gender: ${selectedGender}`,
        onRemove: () => setSelectedGender('')
      });
    }
    if (selectedInterests) {
      active.push({
        label: `Interest: ${selectedInterests}`,
        onRemove: () => setSelectedInterests('')
      });
    }
    selectedHashtags.forEach(tag => {
      active.push({
        label: `#${tag}`,
        onRemove: () => setSelectedHashtags(selectedHashtags.filter(t => t !== tag))
      });
    });
    return active;
  };
  const activeFilters = getActiveFilters();
  return <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="space-y-2">
              <div className="bg-white rounded-lg shadow-sm border border-border">
                <div className="px-6 py-4 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    {!isFilterOpen && activeFilters.length > 0 && <div className="flex flex-wrap gap-2">
                        {activeFilters.map((filter, index) => <FilterBadge key={index} label={filter.label} onRemove={filter.onRemove} />)}
                      </div>}
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-transparent p-0">
                      <ChevronDown className={`h-5 w-5 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Basic Filter</h2>
                      <Button variant="outline" size="sm" onClick={resetFilters} className="text-sm">
                        Reset Filters
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <h3 className="font-medium mb-2">Location</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : countries.map(country => <SelectItem key={country.id} value={country.id.toString()}>
                                    {country.name}
                                  </SelectItem>)}
                            </SelectContent>
                          </Select>
                          
                          <Select value={selectedState} onValueChange={setSelectedState} disabled={!selectedCountry || loadingLocations}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : states.map(state => <SelectItem key={state.id} value={state.id.toString()}>
                                    {state.name}
                                  </SelectItem>)}
                            </SelectContent>
                          </Select>
                          
                          <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState || loadingLocations}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : cities.map(city => <SelectItem key={city.id} value={city.id.toString()}>
                                    {city.name}
                                  </SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Niche</h3>
                        <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Niche" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingNiches ? <SelectItem value="loading" disabled>Loading...</SelectItem> : niches.map(niche => <SelectItem key={niche.id} value={niche.id.toString()}>
                                  {niche.name}
                                </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Content Type</h3>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="post">Post</SelectItem>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="reel">Reel</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Engagement Rate</h3>
                        <div className="px-2">
                          <RangeSlider label="" min={0} value={engagementRange} max={10} step={0.1} onChange={setEngagementRange} formatValue={value => `${value}%`} direction="rtl" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Follower Count</h3>
                        <div className="px-2">
                          <RangeSlider label="" min={0} value={followerRange} max={1500000} step={10000} onChange={setFollowerRange} formatValue={value => formatNumber(value)} direction="rtl" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Platform</h3>
                        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Price Range</h3>
                        <div className="flex gap-2">
                          <Input type="number" placeholder="Min" className="w-1/2" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} />
                          <Input type="number" placeholder="Max" className="w-1/2" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} />
                        </div>
                      </div>
                      
                      <div>
                        <HashtagInput label="Hashtags" tags={selectedHashtags} onChange={setSelectedHashtags} placeholder="Enter hashtags" onAddHashtag={addHashtag} />
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-semibold mb-4">Audience Demographics</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Age</h3>
                        <Select value={selectedAge} onValueChange={setSelectedAge}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Age" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="13-17">13-17</SelectItem>
                            <SelectItem value="18-24">18-24</SelectItem>
                            <SelectItem value="25-34">25-34</SelectItem>
                            <SelectItem value="35-44">35-44</SelectItem>
                            <SelectItem value="45+">45+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Gender</h3>
                        <Select value={selectedGender} onValueChange={setSelectedGender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Interests</h3>
                        <Select value={selectedInterests} onValueChange={setSelectedInterests}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Interests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="beauty">Beauty</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Influencers</h2>
                  <div className="relative w-1/2">
                    <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
                    <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  {isInitialLoad ? <InfluencerListSkeleton /> : loading && !isInitialLoad ? <div className="flex items-center justify-center py-8">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                      <span className="ml-2 text-muted-foreground">Filtering...</span>
                    </div> : filteredInfluencers.length === 0 ? <div className="p-8 text-center text-muted-foreground">
                      <div className="mb-2">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No influencers found</h3>
                      <p className="text-sm">Try adjusting your filters to see more results</p>
                    </div> : filteredInfluencers.map(influencer => <div key={influencer.id}>
                        <InfluencerListItem influencer={influencer} isSelected={selectedInfluencer && selectedInfluencer.id === influencer.id} onClick={() => handleInfluencerClick(influencer)} />
                      </div>)}
                </div>
              </div>
              
              <div className="col-span-8 bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Profile</h2>
                </div>
                <InfluencerProfile influencer={selectedInfluencer} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>;
};
export default InfluencersPage;