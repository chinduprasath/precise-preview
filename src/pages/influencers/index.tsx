
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from '@/components/ui/avatar';

// Sample data for influencers
const influencers = [
  {
    id: '1',
    name: 'Username',
    username: 'Username@gmail.com',
    category: 'Fashion & Lifestyle',
    bio: 'Fashion blogger sharing the latest trends and style tips.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 4.2,
    image: 'https://picsum.photos/id/64/300/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  },
  {
    id: '2',
    name: 'Username',
    username: 'Username@gmail.com',
    category: 'Beauty & Skincare',
    bio: 'Beauty expert specializing in skincare reviews and tutorials.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 3.8,
    image: 'https://picsum.photos/id/65/300/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  },
  {
    id: '3',
    name: 'Username',
    username: 'Username@gmail.com',
    category: 'Tech & Gaming',
    bio: 'Tech reviewer covering the latest gadgets and gaming content.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 5.1,
    image: 'https://picsum.photos/id/91/300/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  },
  {
    id: '4',
    name: 'Username',
    username: 'Username@gmail.com',
    category: 'Health & Fitness',
    bio: 'Fitness coach sharing workout tips and healthy recipes.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 4.5,
    image: 'https://picsum.photos/id/26/300/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  },
  {
    id: '5',
    name: 'Username',
    username: 'Username@gmail.com',
    category: 'Travel',
    bio: 'Travel enthusiast sharing adventures from around the world.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 3.9,
    image: 'https://picsum.photos/id/177/300/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  },
  {
    id: '6',
    name: 'Username',
    username: 'Username@gmail.com',
    category: 'Food & Cooking',
    bio: 'Chef sharing delicious recipes and cooking techniques.',
    followers: {
      instagram: 1000000,
      facebook: 235000,
      twitter: 98000,
      youtube: 2000000
    },
    engagementRate: 4.8,
    image: 'https://picsum.photos/id/129/300/300',
    platforms: ['instagram', 'facebook', 'twitter', 'youtube']
  }
];

const categories = [
  "Fashion & Lifestyle",
  "Beauty & Skincare",
  "Tech & Gaming",
  "Health & Fitness",
  "Travel",
  "Food & Cooking"
];

const platforms = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'facebook', label: 'Facebook' }
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

const InfluencerCard = ({ influencer }) => {
  return (
    <Link to={`/influencers/${influencer.id}`} className="block">
      <div className="flex items-center gap-3 py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
        <Avatar className="h-12 w-12">
          <img 
            src={influencer.image} 
            alt={influencer.name} 
            className="h-full w-full object-cover"
          />
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{influencer.name}</h3>
          <div className="flex flex-wrap gap-x-4 mt-1">
            <div className="flex items-center gap-1">
              <Instagram className="h-4 w-4 text-pink-500" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers.instagram)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Facebook className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers.facebook)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Twitter className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers.twitter)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Youtube className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium">{formatNumber(influencer.followers.youtube)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const InfluencerProfile = ({ influencer }) => {
  const [activeTab, setActiveTab] = useState('services');
  
  return (
    <div className="p-4">
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <img 
            src={influencer.image} 
            alt={influencer.name} 
            className="h-full w-full object-cover"
          />
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{influencer.name}</h2>
          <p className="text-sm text-gray-500">{influencer.username}</p>
          
          <div className="flex gap-6 mt-4">
            <div className="flex flex-col items-center">
              <Instagram className="h-6 w-6 text-pink-500" />
              <span className="font-medium">{formatNumber(influencer.followers.instagram)}</span>
            </div>
            <div className="flex flex-col items-center">
              <Facebook className="h-6 w-6 text-blue-600" />
              <span className="font-medium">{formatNumber(influencer.followers.facebook)}</span>
            </div>
            <div className="flex flex-col items-center">
              <Youtube className="h-6 w-6 text-red-600" />
              <span className="font-medium">{formatNumber(influencer.followers.youtube)}</span>
            </div>
            <div className="flex flex-col items-center">
              <Twitter className="h-6 w-6 text-blue-400" />
              <span className="font-medium">{formatNumber(influencer.followers.twitter)}</span>
            </div>
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

const ContentCard = ({ platform, type }) => {
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

const PricingCard = ({ platform, type }) => {
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

const DataCard = ({ platform, type }) => {
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [followerRange, setFollowerRange] = useState([0, 1500000]);
  const [engagementRange, setEngagementRange] = useState([0, 10]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [hashtags, setHashtags] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedInterests, setSelectedInterests] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState(influencers[0]);
  
  const filteredInfluencers = influencers.filter(influencer => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === '' || 
      influencer.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex gap-6">
            {/* Filters Panel */}
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
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="la">Los Angeles</SelectItem>
                      <SelectItem value="sf">San Francisco</SelectItem>
                      <SelectItem value="sd">San Diego</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Niche</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Follower Count</h3>
                <div className="px-2">
                  <Slider 
                    value={followerRange} 
                    max={1500000} 
                    step={10000}
                    onValueChange={setFollowerRange}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>1.5M</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Platform</h3>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Engagement Rate</h3>
                <div className="px-2">
                  <Slider 
                    value={engagementRange} 
                    max={10} 
                    step={0.1}
                    onValueChange={setEngagementRange}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>10%</span>
                  </div>
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
                <h3 className="font-medium mb-2">Hashtags</h3>
                <Input 
                  placeholder="Enter hashtags" 
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
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
            
            {/* Two panel layout */}
            <div className="w-2/3 grid grid-cols-7 gap-4">
              {/* Left panel - Influencer List */}
              <div className="col-span-3 bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Influencers</h2>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                  {filteredInfluencers.map((influencer) => (
                    <div key={influencer.id} onClick={() => setSelectedInfluencer(influencer)}>
                      <InfluencerCard influencer={influencer} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right panel - Profile View */}
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
