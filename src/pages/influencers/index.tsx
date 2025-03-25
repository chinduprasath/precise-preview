
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Sliders, Users, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for influencers
const influencers = [
  {
    id: '1',
    name: 'Alex Johnson',
    category: 'Fashion & Lifestyle',
    bio: 'Fashion blogger sharing the latest trends and style tips.',
    followers: 245000,
    engagementRate: 4.2,
    image: 'https://picsum.photos/id/64/300/300',
    platforms: ['instagram', 'tiktok']
  },
  {
    id: '2',
    name: 'Sarah Williams',
    category: 'Beauty & Skincare',
    bio: 'Beauty expert specializing in skincare reviews and tutorials.',
    followers: 532000,
    engagementRate: 3.8,
    image: 'https://picsum.photos/id/65/300/300',
    platforms: ['instagram', 'youtube']
  },
  {
    id: '3',
    name: 'Michael Chen',
    category: 'Tech & Gaming',
    bio: 'Tech reviewer covering the latest gadgets and gaming content.',
    followers: 1200000,
    engagementRate: 5.1,
    image: 'https://picsum.photos/id/91/300/300',
    platforms: ['youtube', 'twitter']
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    category: 'Health & Fitness',
    bio: 'Fitness coach sharing workout tips and healthy recipes.',
    followers: 420000,
    engagementRate: 4.5,
    image: 'https://picsum.photos/id/26/300/300',
    platforms: ['instagram', 'facebook']
  },
  {
    id: '5',
    name: 'David Kim',
    category: 'Travel',
    bio: 'Travel enthusiast sharing adventures from around the world.',
    followers: 350000,
    engagementRate: 3.9,
    image: 'https://picsum.photos/id/177/300/300',
    platforms: ['instagram', 'youtube']
  },
  {
    id: '6',
    name: 'Lisa Taylor',
    category: 'Food & Cooking',
    bio: 'Chef sharing delicious recipes and cooking techniques.',
    followers: 180000,
    engagementRate: 4.8,
    image: 'https://picsum.photos/id/129/300/300',
    platforms: ['instagram', 'tiktok']
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
  { id: 'tiktok', label: 'TikTok' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'facebook', label: 'Facebook' }
];

const InfluencerCard = ({ influencer }) => {
  return (
    <Link to={`/influencers/${influencer.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 h-40 md:h-auto">
              <img 
                src={influencer.image} 
                alt={influencer.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{influencer.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{influencer.engagementRate}%</span>
                </div>
              </div>
              <p className="text-sm text-blue-600">{influencer.category}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{influencer.bio}</p>
              
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">
                    {influencer.followers >= 1000000
                      ? `${(influencer.followers / 1000000).toFixed(1)}M`
                      : `${(influencer.followers / 1000).toFixed(0)}K`}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {influencer.platforms.map(platform => (
                    <span 
                      key={platform} 
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const InfluencersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [followerRange, setFollowerRange] = useState([0, 1500000]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };
  
  const filteredInfluencers = influencers.filter(influencer => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === '' || 
      influencer.category === selectedCategory;
    
    // Follower range filter
    const matchesFollowers = 
      influencer.followers >= followerRange[0] && 
      influencer.followers <= followerRange[1];
    
    // Platform filter
    const matchesPlatform = selectedPlatforms.length === 0 || 
      selectedPlatforms.some(platform => influencer.platforms.includes(platform));
    
    return matchesSearch && matchesCategory && matchesFollowers && matchesPlatform;
  });
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Influencers</h1>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Sliders className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search by name, category, or keyword..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {showFilters && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Select 
                        value={selectedCategory} 
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Followers: {followerRange[0] >= 1000000 
                          ? `${(followerRange[0] / 1000000).toFixed(1)}M` 
                          : `${(followerRange[0] / 1000).toFixed(0)}K`} 
                        - {followerRange[1] >= 1000000 
                          ? `${(followerRange[1] / 1000000).toFixed(1)}M` 
                          : `${(followerRange[1] / 1000).toFixed(0)}K`}
                      </label>
                      <Slider 
                        defaultValue={[0, 1500000]} 
                        max={1500000} 
                        step={10000}
                        value={followerRange}
                        onValueChange={setFollowerRange}
                        className="mt-5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Platforms</label>
                      <div className="space-y-2">
                        {platforms.map(platform => (
                          <div key={platform.id} className="flex items-center">
                            <Checkbox 
                              id={platform.id}
                              checked={selectedPlatforms.includes(platform.id)}
                              onCheckedChange={() => togglePlatform(platform.id)}
                            />
                            <label 
                              htmlFor={platform.id}
                              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {platform.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              {filteredInfluencers.length > 0 ? (
                filteredInfluencers.map(influencer => (
                  <InfluencerCard key={influencer.id} influencer={influencer} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No influencers found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InfluencersPage;
