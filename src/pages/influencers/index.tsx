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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Mock additional influencers with blurred identity
const MOCK_BLURRED_INFLUENCERS: Influencer[] = [
  {
    id: 'mock-blur-1',
    name: 'Sarah Johnson',
    username: '@sarahj_lifestyle',
    bio: 'Lifestyle and fashion content creator',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    followers_instagram: 245000,
    followers_facebook: 85000,
    followers_youtube: 125000,
    followers_twitter: 65000,
    engagement_rate: 3.8,
    is_blurred: true,
    country_id: 1,
    state_id: 1,
    city_id: 1,
    niche_id: 1,
    social_platforms: [{ platform_name: 'instagram' }, { platform_name: 'facebook' }]
  },
  {
    id: 'mock-blur-2',
    name: 'Alex Rodriguez',
    username: '@alex_techreview',
    bio: 'Tech reviewer and gadget enthusiast',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    followers_instagram: 180000,
    followers_facebook: 95000,
    followers_youtube: 320000,
    followers_twitter: 145000,
    engagement_rate: 4.2,
    is_blurred: true,
    country_id: 1,
    state_id: 1,
    city_id: 1,
    niche_id: 2,
    social_platforms: [{ platform_name: 'youtube' }, { platform_name: 'twitter' }]
  },
  {
    id: 'mock-blur-3',
    name: 'Maya Patel',
    username: '@maya_fitness',
    bio: 'Fitness trainer and wellness coach',
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
    followers_instagram: 195000,
    followers_facebook: 45000,
    followers_youtube: 85000,
    followers_twitter: 35000,
    engagement_rate: 5.1,
    is_blurred: true,
    country_id: 1,
    state_id: 1,
    city_id: 1,
    niche_id: 3,
    social_platforms: [{ platform_name: 'instagram' }]
  },
  {
    id: 'mock-blur-4',
    name: 'David Chen',
    username: '@david_foodie',
    bio: 'Food blogger and restaurant reviewer',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
    followers_instagram: 155000,
    followers_facebook: 120000,
    followers_youtube: 75000,
    followers_twitter: 88000,
    engagement_rate: 3.9,
    is_blurred: true,
    country_id: 1,
    state_id: 1,
    city_id: 1,
    niche_id: 4,
    social_platforms: [{ platform_name: 'facebook' }, { platform_name: 'youtube' }]
  },
  {
    id: 'mock-blur-5',
    name: 'Emma Williams',
    username: '@emma_travel',
    bio: 'Travel photographer and adventure seeker',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    followers_instagram: 285000,
    followers_facebook: 65000,
    followers_youtube: 145000,
    followers_twitter: 95000,
    engagement_rate: 4.7,
    is_blurred: true,
    country_id: 1,
    state_id: 1,
    city_id: 1,
    niche_id: 5,
    social_platforms: [{ platform_name: 'instagram' }, { platform_name: 'twitter' }]
  }
];

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
  return (
    <div onClick={onClick} className={`flex items-center gap-3 py-3 hover:bg-secondary/50 rounded-lg px-2 transition-colors cursor-pointer ${isSelected ? 'bg-secondary/70' : ''}`}>
      <Avatar className="h-12 w-12">
        <img 
          src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
          alt={influencer.name} 
          className={`h-full w-full object-cover ${influencer.is_blurred ? 'blur-sm' : ''}`} 
        />
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">{influencer.username || influencer.name}</h3>
          {influencer.is_verified && (
            <Badge variant="default" className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              Verified
            </Badge>
          )}
          {influencer.is_trending && (
            <Badge variant="secondary" className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              Trending
            </Badge>
          )}
        </div>
        {influencer.niche && (
          <p className="text-xs text-muted-foreground">
            {influencer.niche.name}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 mt-1">
          {influencer.followers_instagram && influencer.followers_instagram > 0 && (
            <div className="flex items-center gap-1">
              <Instagram className="h-4 w-4 text-social-instagram" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_instagram)}</span>
            </div>
          )}
          {influencer.followers_facebook && influencer.followers_facebook > 0 && (
            <div className="flex items-center gap-1">
              <Facebook className="h-4 w-4 text-social-facebook" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_facebook)}</span>
            </div>
          )}
          {influencer.followers_twitter && influencer.followers_twitter > 0 && (
            <div className="flex items-center gap-1">
              <Twitter className="h-4 w-4 text-social-twitter" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_twitter)}</span>
            </div>
          )}
          {influencer.followers_youtube && influencer.followers_youtube > 0 && (
            <div className="flex items-center gap-1">
              <Youtube className="h-4 w-4 text-social-youtube" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_youtube)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfluencerListSkeleton = () => {
  return (
    <div className="space-y-3 px-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

type Platform = {
  value: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  label: string;
  icon: React.ElementType;
};

const platforms: Platform[] = [
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
];

const audienceCountries = [
  { value: 'us', label: 'United States' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'id', label: 'Indonesia' },
  { value: 'mx', label: 'Mexico' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'ph', label: 'Philippines' },
  { value: 'tr', label: 'Turkey' },
  { value: 'eg', label: 'Egypt' },
] as const;

const audienceLanguages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'hi', label: 'Hindi' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'de', label: 'German' },
  { value: 'ko', label: 'Korean' },
] as const;

type AudienceCountry = typeof audienceCountries[number]['value'];
type AudienceLanguage = typeof audienceLanguages[number]['value'];

const InfluencersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [followerRange, setFollowerRange] = useState<[number, number]>([0, 1500000]);
  const [engagementRange, setEngagementRange] = useState<[number, number]>([0, 10]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform['value'][]>([]);
  const [selectedAudienceCountries, setSelectedAudienceCountries] = useState<AudienceCountry[]>([]);
  const [selectedAudienceLanguages, setSelectedAudienceLanguages] = useState<AudienceLanguage[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [isAudienceCountryDropdownOpen, setIsAudienceCountryDropdownOpen] = useState(false);
  const [isAudienceLanguageDropdownOpen, setIsAudienceLanguageDropdownOpen] = useState(false);

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

  const handlePlatformSelect = (platform: Platform['value']) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFollowerRange([0, 1500000]);
    setEngagementRange([0, 10]);
    setPriceRange([0, 5000]);
    setSelectedType('');
    setSelectedGender('');
    setSelectedAge('');
    setSelectedPlatforms([]);
    setSelectedAudienceCountries([]);
    setSelectedAudienceLanguages([]);
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedNiche('');
    setSelectedHashtags([]);
  };

  const filters: InfluencerFilters = {
    countryId: selectedCountry ? parseInt(selectedCountry) : undefined,
    stateId: selectedState ? parseInt(selectedState) : undefined,
    cityId: selectedCity ? parseInt(selectedCity) : undefined,
    nicheId: selectedNiche ? parseInt(selectedNiche) : undefined,
    hashtags: selectedHashtags.length > 0 ? selectedHashtags : undefined,
    followerRange: followerRange,
    engagementRange: engagementRange,
    platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
  };

  const {
    influencers,
    selectedInfluencer,
    setSelectedInfluencer,
    loading,
    isInitialLoad
  } = useInfluencers(filters);

  // Combine real influencers with mock blurred influencers
  const combinedInfluencers = [...influencers, ...MOCK_BLURRED_INFLUENCERS];

  const filteredInfluencers = combinedInfluencers.filter(influencer => {
    const matchesSearch = searchTerm === '' || 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      influencer.niche?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false || 
      influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    const matchesPlatform = selectedPlatforms.length === 0 || 
      (influencer.social_platforms && 
       influencer.social_platforms.some(p => {
         const platformName = p.platform_name.toLowerCase() as Platform['value'];
         return selectedPlatforms.includes(platformName);
       }));

    const matchesFollowerRange = 
      (influencer.followers_instagram && Number(influencer.followers_instagram) >= Number(followerRange[0]) && Number(influencer.followers_instagram) <= Number(followerRange[1])) ||
      (influencer.followers_facebook && Number(influencer.followers_facebook) >= Number(followerRange[0]) && Number(influencer.followers_facebook) <= Number(followerRange[1])) ||
      (influencer.followers_twitter && Number(influencer.followers_twitter) >= Number(followerRange[0]) && Number(influencer.followers_twitter) <= Number(followerRange[1])) ||
      (influencer.followers_youtube && Number(influencer.followers_youtube) >= Number(followerRange[0]) && Number(influencer.followers_youtube) <= Number(followerRange[1]));

    return matchesSearch && matchesPlatform && matchesFollowerRange;
  });
  
  const handleInfluencerClick = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
  };
  
  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm) filters.push(`Search: ${searchTerm}`);
    if (selectedPlatforms.length > 0) {
      filters.push(`Platforms: ${selectedPlatforms.map(p => platforms.find(pl => pl.value === p)?.label).join(', ')}`);
    }
    if (selectedType) filters.push(`Type: ${selectedType}`);
    if (selectedGender) filters.push(`Gender: ${selectedGender}`);
    if (selectedAge) filters.push(`Age: ${selectedAge}`);
    if (selectedAudienceCountries.length > 0) {
      filters.push(`Audience Countries: ${selectedAudienceCountries.map(c => audienceCountries.find(ac => ac.value === c)?.label).join(', ')}`);
    }
    if (selectedAudienceLanguages.length > 0) {
      filters.push(`Audience Languages: ${selectedAudienceLanguages.map(l => audienceLanguages.find(al => al.value === l)?.label).join(', ')}`);
    }
    if (selectedCountry) filters.push(`Country: ${countries.find(c => c.id === selectedCountry)?.name}`);
    if (selectedState) filters.push(`State: ${states.find(s => s.id === selectedState)?.name}`);
    if (selectedCity) filters.push(`City: ${cities.find(c => c.id === selectedCity)?.name}`);
    if (selectedNiche) filters.push(`Niche: ${niches.find(n => n.id === selectedNiche)?.name}`);
    if (selectedHashtags.length > 0) filters.push(`Hashtags: ${selectedHashtags.join(', ')}`);
    return filters;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2" id="active-filter-chips">
              {/* Active filter chips will go here */}
              {getActiveFilters().map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => {
                    const [key] = filter.split(': ');
                    if (key === 'Platforms') setSelectedPlatforms([]);
                    else if (key === 'Search') setSearchTerm('');
                    else if (key === 'Type') setSelectedType('');
                    else if (key === 'Gender') setSelectedGender('');
                    else if (key === 'Age') setSelectedAge('');
                    else if (key === 'Audience Countries') setSelectedAudienceCountries([]);
                    else if (key === 'Audience Languages') setSelectedAudienceLanguages([]);
                    else if (key === 'Country') setSelectedCountry('');
                    else if (key === 'State') setSelectedState('');
                    else if (key === 'City') setSelectedCity('');
                    else if (key === 'Niche') setSelectedNiche('');
                    else if (key === 'Hashtags') setSelectedHashtags([]);
                  }} />
                </Badge>
              ))}
            </div>
            <Button onClick={() => setIsFilterOpen(true)} className="shrink-0">Filter</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full"> {/* Main content grid */}
            {/* Left column: Influencer List */}
            <div className="md:col-span-1 h-full flex flex-col">
              <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden h-full flex flex-col">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Influencers</h2>
                  <div className="relative w-1/2">
                    <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
                    <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {isInitialLoad ? <InfluencerListSkeleton /> : loading && !isInitialLoad ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                      <span className="ml-2 text-muted-foreground">Filtering...</span>
                    </div>
                  ) : filteredInfluencers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <div className="mb-2">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No influencers found</h3>
                      <p className="text-sm">Try adjusting your filters to see more results</p>
                    </div>
                  ) : (
                    filteredInfluencers.map(influencer => (
                      <div key={influencer.id}>
                        <InfluencerListItem influencer={influencer} isSelected={selectedInfluencer && selectedInfluencer.id === influencer.id} onClick={() => handleInfluencerClick(influencer)} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right column: Selected Influencer Details */}
            <div className="md:col-span-2 h-full flex flex-col">
              {selectedInfluencer ? (
                <div className="bg-card rounded-lg shadow-sm border border-border p-6 flex-1 overflow-auto">
                  <h2 className="text-2xl font-bold mb-4">Profile</h2>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <img
                          src={selectedInfluencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'}
                          alt={selectedInfluencer.name}
                          className={`h-full w-full object-cover ${selectedInfluencer.is_blurred ? 'blur-sm' : ''}`}
                        />
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{selectedInfluencer.name}</h3>
                        {selectedInfluencer.username && (
                          <p className={`text-sm text-muted-foreground ${selectedInfluencer.is_blurred ? 'blur-sm' : ''}`}>
                            {selectedInfluencer.username}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-6">
                      {selectedInfluencer.followers_instagram && selectedInfluencer.followers_instagram > 0 && (
                        <div className="flex flex-col items-center gap-1">
                          <Instagram className="h-5 w-5 text-social-instagram" />
                          <span className="text-sm font-medium">{formatNumber(selectedInfluencer.followers_instagram)}</span>
                        </div>
                      )}
                      {selectedInfluencer.followers_facebook && selectedInfluencer.followers_facebook > 0 && (
                        <div className="flex flex-col items-center gap-1">
                          <Facebook className="h-5 w-5 text-social-facebook" />
                          <span className="text-sm font-medium">{formatNumber(selectedInfluencer.followers_facebook)}</span>
                        </div>
                      )}
                      {selectedInfluencer.followers_youtube && selectedInfluencer.followers_youtube > 0 && (
                        <div className="flex flex-col items-center gap-1">
                          <Youtube className="h-5 w-5 text-social-youtube" />
                          <span className="text-sm font-medium">{formatNumber(selectedInfluencer.followers_youtube)}</span>
                        </div>
                      )}
                      {selectedInfluencer.followers_twitter && selectedInfluencer.followers_twitter > 0 && (
                        <div className="flex flex-col items-center gap-1">
                          <Twitter className="h-5 w-5 text-social-twitter" />
                          <span className="text-sm font-medium">{formatNumber(selectedInfluencer.followers_twitter)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Tabs defaultValue="services" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="prices">Prices</TabsTrigger>
                      <TabsTrigger value="data">Data</TabsTrigger>
                    </TabsList>
                    <TabsContent value="services" className="mt-4">
                      <ServicesTabContent influencerId={selectedInfluencer.id} influencerName={selectedInfluencer.name} />
                    </TabsContent>
                    <TabsContent value="prices" className="mt-4">
                      <PricesTabContent influencerId={selectedInfluencer.id} influencerName={selectedInfluencer.name} />
                    </TabsContent>
                    <TabsContent value="data" className="mt-4">
                      <DataTabContent influencerId={selectedInfluencer?.id} />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="bg-card rounded-lg shadow-sm border border-border p-6 flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select an influencer to view their profile</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <div
        className={`fixed inset-y-0 right-0 w-[400px] bg-background shadow-lg z-50 transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>Reset Filters</Button>
            <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
          <div className="space-y-6">
            {/* All filter content will go here */}
            <div className="space-y-2">
              <h3 className="font-medium mb-2">Location</h3>
              <div className="grid grid-cols-3 gap-2">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : countries.map(country => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedState} onValueChange={setSelectedState} disabled={!selectedCountry || loadingLocations}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : states.map(state => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState || loadingLocations}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingLocations ? <SelectItem value="loading" disabled>Loading...</SelectItem> : cities.map(city => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium mb-2">Niche</h3>
                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingNiches ? <SelectItem value="loading" disabled>Loading...</SelectItem> : niches.map(niche => (
                      <SelectItem key={niche.id} value={niche.id.toString()}>
                        {niche.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium mb-2">Content Type</h3>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium mb-2">Engagement Rate</h3>
              <div className="px-2">
                <RangeSlider label="" min={0} value={engagementRange} max={10} step={0.1} onChange={setEngagementRange} formatValue={value => `${value}%`} direction="rtl" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium mb-2">Follower Count</h3>
              <div className="px-2">
                <RangeSlider label="" min={0} value={followerRange} max={1500000} step={10000} onChange={setFollowerRange} formatValue={value => formatNumber(value)} direction="rtl" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Popover open={isPlatformDropdownOpen} onOpenChange={setIsPlatformDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPlatformDropdownOpen}
                    className="w-full justify-between"
                  >
                    {selectedPlatforms.length > 0
                      ? `${selectedPlatforms.length} selected`
                      : "Select platforms"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="py-1">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div
                          key={platform.value}
                          className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent cursor-pointer"
                          onClick={() => handlePlatformSelect(platform.value)}
                        >
                          <Checkbox
                            checked={selectedPlatforms.includes(platform.value)}
                            onCheckedChange={() => handlePlatformSelect(platform.value)}
                            className="mr-2"
                          />
                          <Icon className="h-4 w-4" />
                          <span>{platform.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" className="w-1/2" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} />
                <Input type="number" placeholder="Max" className="w-1/2" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} />
              </div>
            </div>

            <div className="space-y-2">
              <HashtagInput label="Hashtags" tags={selectedHashtags} onChange={setSelectedHashtags} placeholder="Enter hashtags" onAddHashtag={addHashtag} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Top Audience Countries</label>
              <Popover open={isAudienceCountryDropdownOpen} onOpenChange={setIsAudienceCountryDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isAudienceCountryDropdownOpen}
                    className="w-full justify-between"
                  >
                    {selectedAudienceCountries.length > 0
                      ? `${selectedAudienceCountries.length} selected`
                      : "Select audience countries"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="py-1">
                    {audienceCountries.map((country) => (
                      <div
                        key={country.value}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent cursor-pointer"
                        onClick={() => {
                          setSelectedAudienceCountries(prev =>
                            prev.includes(country.value)
                              ? prev.filter(c => c !== country.value)
                              : [...prev, country.value]
                          );
                        }}
                      >
                        <Checkbox
                          checked={selectedAudienceCountries.includes(country.value)}
                          onCheckedChange={() => {
                            setSelectedAudienceCountries(prev =>
                              prev.includes(country.value)
                                ? prev.filter(c => c !== country.value)
                                : [...prev, country.value]
                            );
                          }}
                          className="mr-2"
                        />
                        <span>{country.label}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Audience Languages</label>
              <Popover open={isAudienceLanguageDropdownOpen} onOpenChange={setIsAudienceLanguageDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isAudienceLanguageDropdownOpen}
                    className="w-full justify-between"
                  >
                    {selectedAudienceLanguages.length > 0
                      ? `${selectedAudienceLanguages.length} selected`
                      : "Select audience languages"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="py-1">
                    {audienceLanguages.map((language) => (
                      <div
                        key={language.value}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent cursor-pointer"
                        onClick={() => {
                          setSelectedAudienceLanguages(prev =>
                            prev.includes(language.value)
                              ? prev.filter(l => l !== language.value)
                              : [...prev, language.value]
                          );
                        }}
                      >
                        <Checkbox
                          checked={selectedAudienceLanguages.includes(language.value)}
                          onCheckedChange={() => {
                            setSelectedAudienceLanguages(prev =>
                              prev.includes(language.value)
                                ? prev.filter(l => l !== language.value)
                                : [...prev, language.value]
                            );
                          }}
                          className="mr-2"
                        />
                        <span>{language.label}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsFilterOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsFilterOpen(false)}>Update</Button>
        </div>
      </div>
    </div>
  );
};

export default InfluencersPage;
