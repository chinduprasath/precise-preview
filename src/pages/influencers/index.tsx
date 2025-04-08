import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Twitter, Youtube, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from '@/components/ui/avatar';
import InfluencerCard from '@/components/influencers/InfluencerCard'; 
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

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const InfluencerListItem = ({ influencer, isSelected, onClick }: { 
  influencer: Influencer; 
  isSelected: boolean; 
  onClick: () => void 
}) => {
  return (
    <div 
      onClick={onClick} 
      className={`flex items-center gap-3 py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer ${isSelected ? 'bg-gray-100' : ''}`}
    >
      <Avatar className="h-12 w-12">
        <img 
          src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
          alt={influencer.name} 
          className="h-full w-full object-cover"
        />
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium">{influencer.name}</h3>
        <div className="flex flex-wrap gap-x-4 mt-1">
          {influencer.followers_instagram > 0 && (
            <div className="flex items-center gap-1">
              <Instagram className="h-4 w-4 text-pink-500" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_instagram)}</span>
            </div>
          )}
          {influencer.followers_facebook > 0 && (
            <div className="flex items-center gap-1">
              <Facebook className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_facebook)}</span>
            </div>
          )}
          {influencer.followers_twitter > 0 && (
            <div className="flex items-center gap-1">
              <Twitter className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers_twitter)}</span>
            </div>
          )}
          {influencer.followers_youtube > 0 && (
            <div className="flex items-center gap-1">
              <Youtube className="h-4 w-4 text-red-600" />
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
      {[1, 2, 3, 4, 5].map((i) => (
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

const InfluencerProfile = ({ influencer }: { influencer: Influencer | null }) => {
  const [activeTab, setActiveTab] = useState('services');
  
  if (!influencer) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-500 mb-1">No Profile Selected</h3>
        <p className="text-gray-400">Please select an influencer profile to display their data</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <img 
            src={influencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
            alt={influencer.name} 
            className="h-full w-full object-cover"
          />
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{influencer.name}</h2>
          <p className="text-sm text-gray-500">{influencer.username || '@' + influencer.name.toLowerCase().replace(/\s+/g, '')}</p>
          <p className="text-sm text-gray-600 mt-2">{influencer.bio || 'No bio available'}</p>
          
          <div className="flex gap-6 mt-4">
            <div className="flex flex-col items-center">
              <Instagram className="h-6 w-6 text-pink-500" />
              <span className="font-medium">{formatNumber(influencer.followers_instagram)}</span>
            </div>
            <div className="flex flex-col items-center">
              <Facebook className="h-6 w-6 text-blue-600" />
              <span className="font-medium">{formatNumber(influencer.followers_facebook)}</span>
            </div>
            <div className="flex flex-col items-center">
              <Youtube className="h-6 w-6 text-red-600" />
              <span className="font-medium">{formatNumber(influencer.followers_youtube)}</span>
            </div>
            <div className="flex flex-col items-center">
              <Twitter className="h-6 w-6 text-blue-400" />
              <span className="font-medium">{formatNumber(influencer.followers_twitter)}</span>
            </div>
          </div>
          
          <div className="mt-4">
            {influencer.niche && (
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2">
                {influencer.niche.name}
              </span>
            )}
            {influencer.state && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                {influencer.state.name}
              </span>
            )}
            {influencer.city && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {influencer.city.name}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-b">
        <div className="flex">
          <button 
            className={`px-4 py-2 border-b-2 ${activeTab === 'services' ? 'border-primary text-primary' : 'border-transparent'}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button 
            className={`px-4 py-2 border-b-2 ${activeTab === 'prices' ? 'border-primary text-primary' : 'border-transparent'}`}
            onClick={() => setActiveTab('prices')}
          >
            Prices
          </button>
          <button 
            className={`px-4 py-2 border-b-2 ${activeTab === 'data' ? 'border-primary text-primary' : 'border-transparent'}`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        {activeTab === 'services' && (
          <div className="grid grid-cols-2 gap-4">
            <ContentCard platform="instagram" type="post" />
            <ContentCard platform="instagram" type="story" />
            <ContentCard platform="instagram" type="reel" />
            <ContentCard platform="youtube" type="video" />
          </div>
        )}
        
        {activeTab === 'prices' && (
          <div className="grid grid-cols-2 gap-4">
            <PricingCard platform="instagram" type="post" />
            <PricingCard platform="instagram" type="story" />
            <PricingCard platform="facebook" type="post" />
            <PricingCard platform="youtube" type="video" />
          </div>
        )}
        
        {activeTab === 'data' && (
          <div className="grid grid-cols-2 gap-4">
            <DataCard platform="instagram" type="post" />
            <DataCard platform="facebook" type="post" />
            <DataCard platform="youtube" type="video" />
            <DataCard platform="twitter" type="post" />
          </div>
        )}
      </div>
    </div>
  );
};

const ContentCard = ({ platform, type }: { platform: string; type: string }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border">
      <div className="h-36 bg-gray-200">
        <img 
          src={`https://picsum.photos/id/${Math.floor(Math.random() * 100)}/300/200`} 
          alt="Content" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 bg-white flex justify-between">
        <div className="flex items-center gap-1">
          <div className="text-red-500">❤</div>
          <span className="text-xs">200K</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-500">👁️</div>
          <span className="text-xs">500K</span>
        </div>
      </div>
      <div className="p-3 bg-white flex justify-between border-t">
        <div className="flex items-center gap-1">
          <div className="text-gray-700">💬</div>
          <span className="text-xs">500</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-gray-700">🔄</div>
          <span className="text-xs">10K</span>
        </div>
      </div>
    </div>
  );
};

const PricingCard = ({ platform, type }: { platform: string; type: string }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border">
      <div className="h-36 bg-gray-200">
        <img 
          src={`https://picsum.photos/id/${Math.floor(Math.random() * 100)}/300/200`} 
          alt="Content" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 bg-white flex justify-between">
        <div className="flex items-center gap-1">
          <div className="text-red-500">❤</div>
          <span className="text-xs">200K</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-500">👁️</div>
          <span className="text-xs">500K</span>
        </div>
      </div>
      <div className="p-3 bg-white flex justify-between border-t">
        <div className="flex items-center gap-1">
          <div className="text-gray-700">💰</div>
          <span className="text-xs">$500</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-gray-700">🔄</div>
          <span className="text-xs">10K</span>
        </div>
      </div>
    </div>
  );
};

const DataCard = ({ platform, type }: { platform: string; type: string }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border">
      <div className="h-36 bg-gray-200">
        <img 
          src={`https://picsum.photos/id/${Math.floor(Math.random() * 100)}/300/200`} 
          alt="Content" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 bg-white flex justify-between">
        <div className="flex items-center gap-1">
          <div className="text-red-500">❤</div>
          <span className="text-xs">200K</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-500">👁️</div>
          <span className="text-xs">500K</span>
        </div>
      </div>
      <div className="p-3 bg-white flex justify-between border-t">
        <div className="flex items-center gap-1">
          <div className="text-gray-700">💰</div>
          <span className="text-xs">$500</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-gray-700">🔄</div>
          <span className="text-xs">10K</span>
        </div>
      </div>
    </div>
  );
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
  
  const { niches, selectedNiche, setSelectedNiche, loading: loadingNiches } = useNiches();
  const { selectedHashtags, setSelectedHashtags, addHashtag, loading: loadingHashtags } = useHashtags();
  
  const filters: InfluencerFilters = {
    countryId: selectedCountry ? parseInt(selectedCountry) : undefined,
    stateId: selectedState ? parseInt(selectedState) : undefined,
    cityId: selectedCity ? parseInt(selectedCity) : undefined,
    nicheId: selectedNiche ? parseInt(selectedNiche) : undefined,
    hashtags: selectedHashtags.length > 0 ? selectedHashtags : undefined,
    followerRange: followerRange,
    engagementRange: engagementRange
  };
  
  const { influencers, selectedInfluencer, setSelectedInfluencer, loading, isInitialLoad } = useInfluencers(filters);
  
  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = searchTerm === '' || 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (influencer.niche?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    return matchesSearch;
  });

  const handleInfluencerClick = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex gap-6">
            <div className="w-1/3 bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Basic Filter</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Location</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingLocations ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        countries.map(country => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedState} onValueChange={setSelectedState} disabled={!selectedCountry || loadingLocations}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingLocations ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        states.map(state => (
                          <SelectItem key={state.id} value={state.id.toString()}>
                            {state.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState || loadingLocations}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingLocations ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        cities.map(city => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Niche</h3>
                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingNiches ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      niches.map(niche => (
                        <SelectItem key={niche.id} value={niche.id.toString()}>
                          {niche.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Follower Count</h3>
                <div className="px-2">
                  <RangeSlider 
                    label=""
                    min={0}
                    value={followerRange} 
                    max={1500000} 
                    step={10000}
                    onChange={setFollowerRange}
                    formatValue={(value) => formatNumber(value)}
                    direction="rtl"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Engagement Rate</h3>
                <div className="px-2">
                  <RangeSlider 
                    label=""
                    min={0}
                    value={engagementRange} 
                    max={10} 
                    step={0.1}
                    onChange={setEngagementRange}
                    formatValue={(value) => `${value}%`}
                    direction="rtl"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    className="w-1/2"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    className="w-1/2"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  />
                </div>
              </div>
              
              <div className="mb-6">
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
              
              <div className="mb-6">
                <HashtagInput 
                  label="Hashtags"
                  tags={selectedHashtags}
                  onChange={setSelectedHashtags}
                  placeholder="Enter hashtags"
                  onAddHashtag={addHashtag}
                />
              </div>
              
              <h2 className="text-lg font-semibold mb-4">Audience Demographics</h2>
              
              <div className="mb-6">
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
              
              <div className="mb-6">
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
              
              <div className="mb-6">
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
            
            <div className="w-2/3 grid grid-cols-7 gap-4">
              <div className="col-span-3 bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Influencers</h2>
                  <div className="relative w-1/2">
                    <Input
                      placeholder="Search influencers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                    <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                  {isInitialLoad ? (
                    <InfluencerListSkeleton />
                  ) : loading && !isInitialLoad ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                      <span className="ml-2 text-gray-500">Filtering...</span>
                    </div>
                  ) : filteredInfluencers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="mb-2">
                        <Search className="h-12 w-12 mx-auto text-gray-300" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No influencers found</h3>
                      <p className="text-sm">Try adjusting your filters to see more results</p>
                    </div>
                  ) : (
                    filteredInfluencers.map((influencer) => (
                      <div key={influencer.id}>
                        <InfluencerListItem 
                          influencer={influencer} 
                          isSelected={selectedInfluencer && selectedInfluencer.id === influencer.id}
                          onClick={() => handleInfluencerClick(influencer)} 
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="col-span-4 bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Profile</h2>
                </div>
                <InfluencerProfile influencer={selectedInfluencer} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InfluencersPage;
