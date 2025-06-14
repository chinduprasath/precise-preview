import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Twitter, Youtube, MessageCircle, Share2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocations } from '@/hooks/useLocations';
import { useNiches } from '@/hooks/useNiches';
import { useHashtags } from '@/hooks/useHashtags';
import { useInfluencers, InfluencerFilters } from '@/hooks/useInfluencers';
import { Influencer } from '@/types/location';
import PricesTabContent from '@/components/influencers/PricesTabContent';
import DataTabContent from '@/components/influencers/DataTabContent';
import ServicesTabContent from '@/components/influencers/ServicesTabContent';
import FilterPanel from '@/components/influencers/FilterPanel';
import InfluencerList from '@/components/influencers/InfluencerList';
import ActiveFilterChips from '@/components/influencers/ActiveFilterChips';
import { MOCK_BLURRED_INFLUENCERS } from '@/data/mockInfluencers';
import { useNavigate } from 'react-router-dom';
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
type Platform = {
  value: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  label: string;
  icon: React.ElementType;
};
const platforms: Platform[] = [{
  value: 'instagram',
  label: 'Instagram',
  icon: Instagram
}, {
  value: 'facebook',
  label: 'Facebook',
  icon: Facebook
}, {
  value: 'twitter',
  label: 'Twitter',
  icon: Twitter
}, {
  value: 'youtube',
  label: 'YouTube',
  icon: Youtube
}];
const audienceCountries = [{
  value: 'us',
  label: 'United States'
}, {
  value: 'in',
  label: 'India'
}, {
  value: 'br',
  label: 'Brazil'
}, {
  value: 'id',
  label: 'Indonesia'
}, {
  value: 'mx',
  label: 'Mexico'
}, {
  value: 'gb',
  label: 'United Kingdom'
}, {
  value: 'ng',
  label: 'Nigeria'
}, {
  value: 'ph',
  label: 'Philippines'
}, {
  value: 'tr',
  label: 'Turkey'
}, {
  value: 'eg',
  label: 'Egypt'
}] as const;
const audienceLanguages = [{
  value: 'en',
  label: 'English'
}, {
  value: 'es',
  label: 'Spanish'
}, {
  value: 'hi',
  label: 'Hindi'
}, {
  value: 'fr',
  label: 'French'
}, {
  value: 'ar',
  label: 'Arabic'
}, {
  value: 'pt',
  label: 'Portuguese'
}, {
  value: 'ru',
  label: 'Russian'
}, {
  value: 'ja',
  label: 'Japanese'
}, {
  value: 'de',
  label: 'German'
}, {
  value: 'ko',
  label: 'Korean'
}] as const;
type AudienceCountry = typeof audienceCountries[number]['value'];
type AudienceLanguage = typeof audienceLanguages[number]['value'];
const InfluencersPage = () => {
  const navigate = useNavigate();
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
  const handleRemoveFilter = (filterType: string) => {
    switch (filterType) {
      case 'Platforms':
        setSelectedPlatforms([]);
        break;
      case 'Search':
        setSearchTerm('');
        break;
      case 'Type':
        setSelectedType('');
        break;
      case 'Gender':
        setSelectedGender('');
        break;
      case 'Age':
        setSelectedAge('');
        break;
      case 'Audience Countries':
        setSelectedAudienceCountries([]);
        break;
      case 'Audience Languages':
        setSelectedAudienceLanguages([]);
        break;
      case 'Country':
        setSelectedCountry('');
        break;
      case 'State':
        setSelectedState('');
        break;
      case 'City':
        setSelectedCity('');
        break;
      case 'Niche':
        setSelectedNiche('');
        break;
      case 'Hashtags':
        setSelectedHashtags([]);
        break;
    }
  };
  const filters: InfluencerFilters = {
    countryId: selectedCountry ? parseInt(selectedCountry) : undefined,
    stateId: selectedState ? parseInt(selectedState) : undefined,
    cityId: selectedCity ? parseInt(selectedCity) : undefined,
    nicheId: selectedNiche ? parseInt(selectedNiche) : undefined,
    hashtags: selectedHashtags.length > 0 ? selectedHashtags : undefined,
    followerRange: followerRange,
    engagementRange: engagementRange,
    platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined
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
    const matchesSearch = searchTerm === '' || influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) || influencer.niche?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false || influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesPlatform = selectedPlatforms.length === 0 || influencer.social_platforms && influencer.social_platforms.some(p => {
      const platformName = p.platform_name.toLowerCase() as Platform['value'];
      return selectedPlatforms.includes(platformName);
    });
    const matchesFollowerRange = influencer.followers_instagram && Number(influencer.followers_instagram) >= followerRange[0] && Number(influencer.followers_instagram) <= followerRange[1] || influencer.followers_facebook && Number(influencer.followers_facebook) >= followerRange[0] && Number(influencer.followers_facebook) <= followerRange[1] || influencer.followers_twitter && Number(influencer.followers_twitter) >= followerRange[0] && Number(influencer.followers_twitter) <= followerRange[1] || influencer.followers_youtube && Number(influencer.followers_youtube) >= followerRange[0] && Number(influencer.followers_youtube) <= followerRange[1];
    return matchesSearch && matchesPlatform && matchesFollowerRange;
  });
  const handleInfluencerClick = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
  };
  const handleBookInfluencer = () => {
    navigate('/orders/place');
  };
  const handleChatInfluencer = () => {
    navigate('/chats');
  };
  const handleShareInfluencer = () => {
    // Simple share functionality - could be enhanced with actual sharing
    if (navigator.share) {
      navigator.share({
        title: `Check out ${selectedInfluencer?.name}`,
        text: `Influencer profile: ${selectedInfluencer?.name}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  // Helper function to get social media page name
  const getSocialMediaPageName = (influencer: Influencer) => {
    // Priority order: Instagram, Facebook, YouTube, Twitter
    if (influencer.followers_instagram && influencer.followers_instagram > 0) {
      return `@${influencer.name.toLowerCase().replace(/\s+/g, '')}`;
    }
    if (influencer.followers_facebook && influencer.followers_facebook > 0) {
      return `${influencer.name} on Facebook`;
    }
    if (influencer.followers_youtube && influencer.followers_youtube > 0) {
      return `${influencer.name} YouTube`;
    }
    if (influencer.followers_twitter && influencer.followers_twitter > 0) {
      return `@${influencer.name.toLowerCase().replace(/\s+/g, '')}`;
    }
    return `@${influencer.name.toLowerCase().replace(/\s+/g, '')}`;
  };
  return <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <ActiveFilterChips searchTerm={searchTerm} selectedPlatforms={selectedPlatforms} selectedType={selectedType} selectedGender={selectedGender} selectedAge={selectedAge} selectedAudienceCountries={selectedAudienceCountries} selectedAudienceLanguages={selectedAudienceLanguages} selectedCountry={selectedCountry} selectedState={selectedState} selectedCity={selectedCity} selectedNiche={selectedNiche} selectedHashtags={selectedHashtags} countries={countries} states={states} cities={cities} niches={niches} onRemoveFilter={handleRemoveFilter} />
            <Button onClick={() => setIsFilterOpen(true)} className="shrink-0">Filter</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <InfluencerList influencers={filteredInfluencers} selectedInfluencer={selectedInfluencer} onInfluencerClick={handleInfluencerClick} searchTerm={searchTerm} onSearchChange={setSearchTerm} loading={loading} isInitialLoad={isInitialLoad} />

            {/* Right column: Selected Influencer Details */}
            <div className="md:col-span-2 h-full flex flex-col">
              {selectedInfluencer ? <div className="bg-card rounded-lg shadow-sm border border-border p-6 flex-1 overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Profile</h2>
                    <Button onClick={handleBookInfluencer} className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2">
                      Book
                    </Button>
                  </div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <img src={selectedInfluencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} alt={selectedInfluencer.name} className={`h-full w-full object-cover ${selectedInfluencer.is_blurred ? 'blur-sm' : ''}`} />
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground">{getSocialMediaPageName(selectedInfluencer)}</h3>
                          <Button variant="ghost" size="icon" onClick={handleChatInfluencer} className="h-8 w-8">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {selectedInfluencer.niche && <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{selectedInfluencer.niche.name}</span>
                            <Button variant="ghost" size="icon" onClick={handleShareInfluencer} className="h-6 w-6">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>}
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-6">
                      {selectedInfluencer.followers_instagram && selectedInfluencer.followers_instagram > 0 && <div className="flex flex-col items-center gap-1">
                          <Instagram className="h-5 w-5 text-social-instagram" />
                          <span className="text-sm font-medium">{formatNumber(selectedInfluencer.followers_instagram)}</span>
                        </div>}
                      {selectedInfluencer.followers_facebook && selectedInfluencer.followers_facebook > 0 && <div className="flex flex-col items-center gap-1">
                          <Facebook className="h-5 w-5 text-social-facebook" />
                          <span className="text-sm font-medium">{formatNumber(selectedInfluencer.followers_facebook)}</span>
                        </div>}
                      {selectedInfluencer.followers_youtube && selectedInfluencer.followers_youtube > 0 && <div className="flex flex-col items-center gap-1">
                          <Youtube className="h-5 w-5 text-social-youtube" />
                          <span className="text-sm font-medium">{formatNumber(selectedInfluencer.followers_youtube)}</span>
                        </div>}
                      {selectedInfluencer.followers_twitter && selectedInfluencer.followers_twitter > 0 && <div className="flex flex-col items-center gap-1">
                          <Twitter className="h-5 w-5 text-social-twitter" />
                          <span className="text-sm font-medium">{formatNumber(selectedInfluencer.followers_twitter)}</span>
                        </div>}
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
                </div> : <div className="bg-card rounded-lg shadow-sm border border-border p-6 flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select an influencer to view their profile</p>
                </div>}
            </div>
          </div>
        </main>
      </div>
      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} followerRange={followerRange} setFollowerRange={setFollowerRange} engagementRange={engagementRange} setEngagementRange={setEngagementRange} priceRange={priceRange} setPriceRange={setPriceRange} selectedType={selectedType} setSelectedType={setSelectedType} selectedGender={selectedGender} setSelectedGender={setSelectedGender} selectedAge={selectedAge} setSelectedAge={setSelectedAge} selectedPlatforms={selectedPlatforms} setSelectedPlatforms={setSelectedPlatforms} selectedAudienceCountries={selectedAudienceCountries} setSelectedAudienceCountries={setSelectedAudienceCountries} selectedAudienceLanguages={selectedAudienceLanguages} setSelectedAudienceLanguages={setSelectedAudienceLanguages} isPlatformDropdownOpen={isPlatformDropdownOpen} setIsPlatformDropdownOpen={setIsPlatformDropdownOpen} isAudienceCountryDropdownOpen={isAudienceCountryDropdownOpen} setIsAudienceCountryDropdownOpen={setIsAudienceCountryDropdownOpen} isAudienceLanguageDropdownOpen={isAudienceLanguageDropdownOpen} setIsAudienceLanguageDropdownOpen={setIsAudienceLanguageDropdownOpen} countries={countries} states={states} cities={cities} niches={niches} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedState={selectedState} setSelectedState={setSelectedState} selectedCity={selectedCity} setSelectedCity={setSelectedCity} selectedNiche={selectedNiche} setSelectedNiche={setSelectedNiche} selectedHashtags={selectedHashtags} setSelectedHashtags={setSelectedHashtags} addHashtag={addHashtag} loadingLocations={loadingLocations} loadingNiches={loadingNiches} onResetFilters={resetFilters} formatNumber={formatNumber} />
    </div>;
};
export default InfluencersPage;