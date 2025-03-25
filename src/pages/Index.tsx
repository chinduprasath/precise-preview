
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import FilterDropdown from '@/components/filters/FilterDropdown';
import RangeSlider from '@/components/filters/RangeSlider';
import HashtagInput from '@/components/filters/HashtagInput';
import InfluencerCard from '@/components/influencers/InfluencerCard';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileContent from '@/components/profile/ProfileContent';
import { Share2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  socialStats: Array<{
    platform: 'instagram' | 'facebook' | 'twitter' | 'youtube';
    count: number;
  }>;
}

interface FilterOption {
  type: string;
  label: string;
  value: string | number | [number, number] | string[];
}

const Index = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [engagementRange, setEngagementRange] = useState<[number, number]>([2, 10]);
  const [followerRange, setFollowerRange] = useState<[number, number]>([0, 52.5]);
  const [isBasicFilterOpen, setIsBasicFilterOpen] = useState(true);
  const [isAudienceDemographicsOpen, setIsAudienceDemographicsOpen] = useState(true);
  
  // Filter selections
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [niche, setNiche] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [interests, setInterests] = useState<string>("");

  const getActiveBasicFilters = (): FilterOption[] => {
    const filters: FilterOption[] = [];
    
    if (country) filters.push({ type: "country", label: "Country", value: country });
    if (state) filters.push({ type: "state", label: "State", value: state });
    if (city) filters.push({ type: "city", label: "City", value: city });
    if (contentType) filters.push({ type: "contentType", label: "Content Type", value: contentType });
    if (hashtags.length > 0) filters.push({ type: "hashtags", label: "Hashtags", value: hashtags });
    if (engagementRange[0] !== 0 || engagementRange[1] !== 20) {
      filters.push({ 
        type: "engagementRate", 
        label: "Engagement Rate", 
        value: `${engagementRange[0]}% - ${engagementRange[1]}%` 
      });
    }
    
    return filters;
  };

  const getActiveAudienceFilters = (): FilterOption[] => {
    const filters: FilterOption[] = [];
    
    if (niche) filters.push({ type: "niche", label: "Niche", value: niche });
    if (platform) filters.push({ type: "platform", label: "Platform", value: platform });
    if (priceMin || priceMax) {
      const priceRange = `${priceMin || 0} - ${priceMax || "∞"}`;
      filters.push({ type: "priceRange", label: "Price Range", value: priceRange });
    }
    if (age) filters.push({ type: "age", label: "Age", value: age });
    if (gender) filters.push({ type: "gender", label: "Gender", value: gender });
    if (interests) filters.push({ type: "interests", label: "Interests", value: interests });
    if (followerRange[0] !== 0 || followerRange[1] !== 100) {
      const formatFollower = (v: number) => v === 0 ? '0' : v === 100 ? '100M+' : `${v}K`;
      filters.push({ 
        type: "followerCount", 
        label: "Followers", 
        value: `${formatFollower(followerRange[0])} - ${formatFollower(followerRange[1])}` 
      });
    }
    
    return filters;
  };

  const clearFilter = (type: string) => {
    switch (type) {
      case "country": setCountry(""); break;
      case "state": setState(""); break;
      case "city": setCity(""); break;
      case "contentType": setContentType(""); break;
      case "hashtags": setHashtags([]); break;
      case "engagementRate": setEngagementRange([0, 20]); break;
      case "niche": setNiche(""); break;
      case "platform": setPlatform(""); break;
      case "priceRange": setPriceMin(""); setPriceMax(""); break;
      case "age": setAge(""); break;
      case "gender": setGender(""); break;
      case "interests": setInterests(""); break;
      case "followerCount": setFollowerRange([0, 100]); break;
      default: break;
    }
  };

  const handleInfluencerClick = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
  };

  // Example dummy data for dropdown selections
  const countryOptions = ["United States", "Canada", "United Kingdom", "Australia"];
  const stateOptions = ["California", "New York", "Texas", "Florida"];
  const cityOptions = ["Los Angeles", "New York", "Chicago", "Miami"];
  const contentTypeOptions = ["Photo", "Video", "Reel", "Story", "Live"];
  const nicheOptions = ["Fashion", "Beauty", "Fitness", "Travel", "Food", "Tech"];
  const platformOptions = ["Instagram", "YouTube", "TikTok", "Twitter"];
  const ageOptions = ["13-17", "18-24", "25-34", "35-44", "45+"];
  const genderOptions = ["Male", "Female", "Non-binary"];
  const interestOptions = ["Fashion", "Sports", "Music", "Gaming", "Technology"];

  // Dummy function for dropdown click handling
  const handleDropdownClick = (option: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(option);
  };

  const influencers: Influencer[] = [
    {
      id: '1',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=1',
      email: 'Username@gmail.com',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '2',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=2',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '3',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=3',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '4',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=4',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '5',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=5',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
    {
      id: '6',
      name: 'Username',
      avatar: 'https://i.pravatar.cc/150?img=6',
      socialStats: [
        { platform: 'instagram', count: 1000000 },
        { platform: 'facebook', count: 235000 },
        { platform: 'twitter', count: 98000 },
        { platform: 'youtube', count: 2000000 },
      ],
    },
  ];

  const activeBasicFilters = getActiveBasicFilters();
  const activeAudienceFilters = getActiveAudienceFilters();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 animate-fade-in">
              <Card className="shadow-sm border-gray-200 mb-6">
                <CardContent className="p-6">
                  <Collapsible
                    open={isBasicFilterOpen}
                    onOpenChange={setIsBasicFilterOpen}
                    className="mb-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-medium">Basic Filter</h2>
                        
                        {!isBasicFilterOpen && activeBasicFilters.length > 0 && (
                          <div className="flex flex-wrap gap-2 ml-4">
                            {activeBasicFilters.map((filter, index) => (
                              <Badge 
                                key={`basic-${index}`} 
                                variant="outline"
                                className="py-1 px-2 flex items-center gap-1 bg-gray-100"
                              >
                                <span className="text-xs">{filter.label}: {Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}</span>
                                <button
                                  onClick={() => clearFilter(filter.type)}
                                  className="text-gray-500 hover:text-gray-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          {isBasicFilterOpen ? 
                            <ChevronUp className="h-5 w-5" /> : 
                            <ChevronDown className="h-5 w-5" />
                          }
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                        <div className="col-span-1">
                          <h3 className="text-sm font-medium mb-2">Location</h3>
                          <div className="flex flex-col space-y-2">
                            <FilterDropdown
                              label=""
                              placeholder="Select Country"
                              value={country}
                              className="w-full"
                              onClick={() => {
                                // In a real app, this would open a dropdown with options
                                handleDropdownClick(countryOptions[0], setCountry);
                              }}
                              onClear={() => setCountry("")}
                            />
                            <FilterDropdown
                              label=""
                              placeholder="Select State"
                              value={state}
                              className="w-full"
                              onClick={() => {
                                handleDropdownClick(stateOptions[0], setState);
                              }}
                              onClear={() => setState("")}
                            />
                            <FilterDropdown
                              label=""
                              placeholder="Select City"
                              value={city}
                              className="w-full"
                              onClick={() => {
                                handleDropdownClick(cityOptions[0], setCity);
                              }}
                              onClear={() => setCity("")}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <h3 className="text-sm font-medium mb-2">Engagement Rate</h3>
                          <RangeSlider
                            label=""
                            min={0}
                            max={20}
                            value={engagementRange}
                            onChange={setEngagementRange}
                            formatValue={(v) => `${v}%`}
                          />
                        </div>
                        <div className="col-span-1">
                          <h3 className="text-sm font-medium mb-2">Content Type</h3>
                          <FilterDropdown
                            label=""
                            placeholder="Select Type"
                            value={contentType}
                            className="w-full"
                            onClick={() => {
                              handleDropdownClick(contentTypeOptions[0], setContentType);
                            }}
                            onClear={() => setContentType("")}
                          />
                        </div>
                        <div className="col-span-1">
                          <h3 className="text-sm font-medium mb-2">Hashtags</h3>
                          <HashtagInput
                            label=""
                            tags={hashtags}
                            onChange={setHashtags}
                            placeholder="Enter Hashtags"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible
                    open={isAudienceDemographicsOpen}
                    onOpenChange={setIsAudienceDemographicsOpen}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-medium">Audience Demographics</h2>
                        
                        {!isAudienceDemographicsOpen && activeAudienceFilters.length > 0 && (
                          <div className="flex flex-wrap gap-2 ml-4">
                            {activeAudienceFilters.map((filter, index) => (
                              <Badge 
                                key={`audience-${index}`} 
                                variant="outline"
                                className="py-1 px-2 flex items-center gap-1 bg-gray-100"
                              >
                                <span className="text-xs">{filter.label}: {Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}</span>
                                <button
                                  onClick={() => clearFilter(filter.type)}
                                  className="text-gray-500 hover:text-gray-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          {isAudienceDemographicsOpen ? 
                            <ChevronUp className="h-5 w-5" /> : 
                            <ChevronDown className="h-5 w-5" />
                          }
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4">
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium mb-2">Niche</h3>
                          <FilterDropdown
                            label=""
                            placeholder="Select Niche"
                            value={niche}
                            className="w-full"
                            onClick={() => {
                              handleDropdownClick(nicheOptions[0], setNiche);
                            }}
                            onClear={() => setNiche("")}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium mb-2">Follower Count</h3>
                          <RangeSlider
                            label=""
                            min={0}
                            max={100}
                            step={0.5}
                            value={followerRange}
                            onChange={setFollowerRange}
                            formatValue={(v) => v === 0 ? '0' : v === 100 ? '100M+' : `${v}K`}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium mb-2">Platform</h3>
                          <FilterDropdown
                            label=""
                            placeholder="Select Platform"
                            value={platform}
                            className="w-full"
                            onClick={() => {
                              handleDropdownClick(platformOptions[0], setPlatform);
                            }}
                            onClear={() => setPlatform("")}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium mb-2">Price Range</h3>
                          <div className="flex space-x-2">
                            <div className="w-1/2">
                              <Input
                                type="text"
                                placeholder="Min"
                                className="bg-gray-100"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                              />
                            </div>
                            <div className="w-1/2">
                              <Input
                                type="text"
                                placeholder="Max"
                                className="bg-gray-100"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium mb-2">Age</h3>
                          <FilterDropdown
                            label=""
                            placeholder="Select Age"
                            value={age}
                            className="w-full"
                            onClick={() => {
                              handleDropdownClick(ageOptions[0], setAge);
                            }}
                            onClear={() => setAge("")}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium mb-2">Gender</h3>
                          <FilterDropdown
                            label=""
                            placeholder="Select Gender"
                            value={gender}
                            className="w-full"
                            onClick={() => {
                              handleDropdownClick(genderOptions[0], setGender);
                            }}
                            onClear={() => setGender("")}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium mb-2">Interests</h3>
                          <FilterDropdown
                            label=""
                            placeholder="Select Interests"
                            value={interests}
                            className="w-full"
                            onClick={() => {
                              handleDropdownClick(interestOptions[0], setInterests);
                            }}
                            onClear={() => setInterests("")}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium mb-2">Location</h3>
                          <div className="flex flex-col space-y-2">
                            <FilterDropdown
                              label=""
                              placeholder="Select Country"
                              className="w-full"
                            />
                            <FilterDropdown
                              label=""
                              placeholder="Select State"
                              className="w-full"
                            />
                            <FilterDropdown
                              label=""
                              placeholder="Select City"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-4">
                      <h2 className="text-lg font-medium mb-4">Influencers</h2>
                      <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                        <div className="space-y-3 pr-4">
                          {influencers.map((influencer) => (
                            <InfluencerCard
                              key={influencer.id}
                              name={influencer.name}
                              avatar={influencer.avatar}
                              socialStats={influencer.socialStats}
                              onClick={() => handleInfluencerClick(influencer)}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="shadow-sm border-gray-200 h-full">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-medium mb-4">Profile</h2>
                      
                      {selectedInfluencer ? (
                        <div className="animate-scale-in">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16 border">
                                <img 
                                  src={selectedInfluencer.avatar} 
                                  alt={selectedInfluencer.name} 
                                  className="h-full w-full object-cover"
                                />
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">{selectedInfluencer.name}</h3>
                                <p className="text-gray-500 text-sm">{selectedInfluencer.email || `${selectedInfluencer.name.toLowerCase()}@gmail.com`}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Share2 className="h-4 w-4" />
                                Share
                              </Button>
                              <Button size="sm">Contact</Button>
                            </div>
                          </div>
                          
                          <ProfileStats stats={selectedInfluencer.socialStats} />
                          <ProfileContent />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[600px] text-gray-400">
                          <p>Select an influencer to view their profile</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
