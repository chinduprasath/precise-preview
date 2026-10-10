import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle,
  Share2,
  Heart,
  Eye,
  MessageSquare,
  LayoutGrid,
  Map as MapIcon,
  Search,
  ExternalLink,
  MapPin,
  Building2,
  Briefcase,
  X,
  SlidersHorizontal,
  Play,
  TrendingUp,
  BarChart3,
  Calendar,
  Check
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MOCK_BUSINESS_USERS, BusinessUser, BusinessUserMediaItem } from '@/data/mockBusinessUsers';
import { toast } from '@/hooks/use-toast';

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const BusinessUsersPage: React.FC = () => {
  const [businessUsers] = useState<BusinessUser[]>(MOCK_BUSINESS_USERS);
  const [selectedUser, setSelectedUser] = useState<BusinessUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'normal' | 'map'>('normal');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'data' | 'gallery'>('services');

  // Applied Filter States
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBusinessStatus, setSelectedBusinessStatus] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [minOrders, setMinOrders] = useState<number>(0);

  // Temporary Filter States inside Right Sidebar
  const [tempCountry, setTempCountry] = useState<string>('all');
  const [tempState, setTempState] = useState<string>('all');
  const [tempCity, setTempCity] = useState<string>('all');
  const [tempCategory, setTempCategory] = useState<string>('all');
  const [tempBusinessStatus, setTempBusinessStatus] = useState<string>('all');
  const [tempServiceType, setTempServiceType] = useState<string>('all');
  const [tempMinOrders, setTempMinOrders] = useState<number>(0);

  // Synchronize temp state when opening filter sidebar
  const handleOpenFilters = () => {
    setTempCountry(selectedCountry);
    setTempState(selectedState);
    setTempCity(selectedCity);
    setTempCategory(selectedCategory);
    setTempBusinessStatus(selectedBusinessStatus);
    setTempServiceType(selectedServiceType);
    setTempMinOrders(minOrders);
    setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
    setSelectedCountry(tempCountry);
    setSelectedState(tempState);
    setSelectedCity(tempCity);
    setSelectedCategory(tempCategory);
    setSelectedBusinessStatus(tempBusinessStatus);
    setSelectedServiceType(tempServiceType);
    setMinOrders(tempMinOrders);
    setIsFilterOpen(false);
    toast({
      title: 'Filters Updated',
      description: 'Business users list updated.'
    });
  };

  const handleResetFilters = () => {
    setTempCountry('all');
    setTempState('all');
    setTempCity('all');
    setTempCategory('all');
    setTempBusinessStatus('all');
    setTempServiceType('all');
    setTempMinOrders(0);

    setSelectedCountry('all');
    setSelectedState('all');
    setSelectedCity('all');
    setSelectedCategory('all');
    setSelectedBusinessStatus('all');
    setSelectedServiceType('all');
    setMinOrders(0);

    toast({
      title: 'Filters Reset',
      description: 'Showing all business users.'
    });
  };

  // Preview Modal for media item
  const [previewMediaItem, setPreviewMediaItem] = useState<BusinessUserMediaItem | null>(null);

  // Proposal / Connect dialog
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [proposalMessage, setProposalMessage] = useState('');

  // Wishlist / Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('businessUser_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id: string, name: string) => {
    const isBookmarked = bookmarkedIds.includes(id);
    const updated = isBookmarked
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('businessUser_bookmarks', JSON.stringify(updated));
    } catch {}

    toast({
      title: isBookmarked ? 'Removed from Bookmarks' : 'Saved to Bookmarks',
      description: `${name} ${isBookmarked ? 'removed from' : 'added to'} your saved businesses.`
    });
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    businessUsers.forEach((u) => set.add(u.category));
    return Array.from(set);
  }, [businessUsers]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    businessUsers.forEach((u) => set.add(u.location.country));
    return Array.from(set);
  }, [businessUsers]);

  const availableStates = useMemo(() => {
    const set = new Set<string>();
    businessUsers
      .filter((u) => tempCountry === 'all' || u.location.country === tempCountry)
      .forEach((u) => set.add(u.location.state));
    return Array.from(set);
  }, [businessUsers, tempCountry]);

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    businessUsers
      .filter((u) => {
        const countryMatch = tempCountry === 'all' || u.location.country === tempCountry;
        const stateMatch = tempState === 'all' || u.location.state === tempState;
        return countryMatch && stateMatch;
      })
      .forEach((u) => set.add(u.location.city));
    return Array.from(set);
  }, [businessUsers, tempCountry, tempState]);

  // Filtered business users
  const filteredUsers = useMemo(() => {
    return businessUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        selectedCountry === 'all' || user.location.country === selectedCountry;

      const matchesState =
        selectedState === 'all' || user.location.state === selectedState;

      const matchesCity =
        selectedCity === 'all' || user.location.city === selectedCity;

      const matchesCategory =
        selectedCategory === 'all' || user.category === selectedCategory;

      const matchesStatus =
        selectedBusinessStatus === 'all' || user.business_status === selectedBusinessStatus;

      const matchesServiceType =
        selectedServiceType === 'all' || user.service_type === selectedServiceType;

      const matchesOrders =
        minOrders === 0 || (user.total_orders || 0) >= minOrders;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesState &&
        matchesCity &&
        matchesCategory &&
        matchesStatus &&
        matchesServiceType &&
        matchesOrders
      );
    });
  }, [
    businessUsers,
    searchTerm,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedCategory,
    selectedBusinessStatus,
    selectedServiceType,
    minOrders
  ]);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    toast({
      title: 'Collaboration Proposal Sent! 🚀',
      description: `Your proposal has been delivered to ${selectedUser.name}.`
    });
    setIsConnectOpen(false);
    setProposalMessage('');
  };

  const renderPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return (
          <div key="ig" className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center shadow-xs">
            <Instagram className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 'facebook':
        return (
          <div key="fb" className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center shadow-xs">
            <Facebook className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 'youtube':
        return (
          <div key="yt" className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center shadow-xs">
            <Youtube className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 'twitter':
        return (
          <div key="tw" className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center shadow-xs">
            <Twitter className="w-3.5 h-3.5 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  // Mock Performance Analytics for Selected User Data Tab
  const engagementData = [
    { month: 'Jan', rate: 5.2, reach: 420 },
    { month: 'Feb', rate: 5.8, reach: 510 },
    { month: 'Mar', rate: 6.4, reach: 580 },
    { month: 'Apr', rate: 6.9, reach: 640 },
    { month: 'May', rate: 7.5, reach: 720 },
    { month: 'Jun', rate: selectedUser?.metrics.engagement_rate || 7.8, reach: 810 }
  ];

  const platformDistribution = [
    { name: 'Instagram', value: 45, color: '#e1306c' },
    { name: 'YouTube', value: 30, color: '#ff0000' },
    { name: 'Facebook', value: 15, color: '#1877f2' },
    { name: 'Twitter', value: 10, color: '#1da1f2' }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 relative">
          {/* Top Bar: Filter Chips & View Mode Buttons (matching Image 2) */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            {/* Left Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedCountry !== 'all' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-foreground text-xs rounded-full border border-border">
                  <span>Country: {selectedCountry}</span>
                  <button
                    onClick={() => setSelectedCountry('all')}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedState !== 'all' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-foreground text-xs rounded-full border border-border">
                  <span>State: {selectedState}</span>
                  <button
                    onClick={() => setSelectedState('all')}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedCity !== 'all' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-foreground text-xs rounded-full border border-border">
                  <span>City: {selectedCity}</span>
                  <button
                    onClick={() => setSelectedCity('all')}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedCategory !== 'all' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-foreground text-xs rounded-full border border-border">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedBusinessStatus !== 'all' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-foreground text-xs rounded-full border border-border">
                  <span>Status: {selectedBusinessStatus === 'registered' ? 'Registered' : 'Not Registered'}</span>
                  <button
                    onClick={() => setSelectedBusinessStatus('all')}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedServiceType !== 'all' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-foreground text-xs rounded-full border border-border">
                  <span>Service: {selectedServiceType}</span>
                  <button
                    onClick={() => setSelectedServiceType('all')}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {minOrders > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-foreground text-xs rounded-full border border-border">
                  <span>Orders ≥ {minOrders}</span>
                  <button
                    onClick={() => setMinOrders(0)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {searchTerm && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-foreground text-xs rounded-full border border-border">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {(selectedCountry !== 'all' ||
                selectedState !== 'all' ||
                selectedCity !== 'all' ||
                selectedCategory !== 'all' ||
                selectedBusinessStatus !== 'all' ||
                selectedServiceType !== 'all' ||
                minOrders > 0 ||
                searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleResetFilters}
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Right: Normal View / Map View Toggle & Filter Button (matching Image 2) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <div className="flex items-center bg-muted/70 p-1 rounded-lg border border-border">
                <Button
                  size="sm"
                  variant={viewMode === 'normal' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('normal')}
                  className="h-8 px-3 gap-1.5 text-xs font-medium"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Normal View</span>
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('map')}
                  className="h-8 px-3 gap-1.5 text-xs font-medium"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </Button>
              </div>

              <Button
                onClick={handleOpenFilters}
                className="shrink-0 h-8 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          {/* Map View Alternative */}
          {viewMode === 'map' ? (
            <div className="bg-card rounded-xl border border-border p-6 h-[calc(100vh-180px)] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Business Users Headquarters Map</h3>
                <span className="text-xs text-muted-foreground">
                  Showing {filteredUsers.length} business locations
                </span>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-border relative overflow-hidden flex items-center justify-center p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl z-10">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setViewMode('normal');
                      }}
                      className="bg-card p-4 rounded-xl border border-border shadow-md hover:shadow-lg cursor-pointer transition-all hover:scale-105"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <img src={user.avatar_url} alt={user.name} className="object-cover" />
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">{user.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            {user.location.city}, {user.location.country}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {user.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Main Normal View Master-Detail Grid (matching Image 2 & 3) */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
              {/* LEFT COLUMN: Business Users List (matching Image 2) */}
              <div className="bg-card rounded-xl shadow-xs border border-border flex flex-col h-full overflow-hidden">
                {/* Search Header */}
                <div className="p-4 border-b border-border space-y-3">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Business Users
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 text-xs bg-muted/40"
                    />
                  </div>
                </div>

                {/* List of Business Cards */}
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                  {filteredUsers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No business users match your search.
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected = selectedUser?.id === user.id;
                      return (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          role="button"
                          tabIndex={0}
                          className={`p-4 transition-all duration-150 cursor-pointer flex items-start gap-3 text-left hover:bg-muted/50 ${
                            isSelected
                              ? 'bg-primary/10 border-l-4 border-l-primary shadow-xs'
                              : ''
                          }`}
                        >
                          <Avatar className="h-12 w-12 shrink-0 border border-border/80">
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground truncate leading-snug">
                              {user.handle}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.category}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Business User Details (matching Image 2 empty state & Image 3 tabs) */}
              <div className="md:col-span-2 h-full flex flex-col overflow-hidden">
                {!selectedUser ? (
                  /* Exact Empty State matching Image 2 */
                  <div className="bg-card rounded-xl shadow-xs border border-border p-6 flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-sm font-medium">
                      Select a business user to view their profile
                    </p>
                  </div>
                ) : (
                  /* Selected Business Profile Panel */
                  <div className="bg-card rounded-xl shadow-xs border border-border p-6 flex-1 overflow-y-auto flex flex-col">
                    {/* Header: Title & Action Button */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/80">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Business Profile</h2>
                        <p className="text-xs text-muted-foreground">
                          {selectedUser.company_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setIsConnectOpen(true)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 h-9 text-xs font-semibold shadow-xs"
                        >
                          Send Proposal
                        </Button>
                      </div>
                    </div>

                    {/* Business User Identity & Social Icons */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 ring-2 ring-border shadow-xs">
                          <img
                            src={selectedUser.avatar_url}
                            alt={selectedUser.name}
                            className="h-full w-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-foreground">
                              {selectedUser.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleBookmark(selectedUser.id, selectedUser.name)}
                              className="h-8 w-8"
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  bookmarkedIds.includes(selectedUser.id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setIsConnectOpen(true)}
                              className="h-8 w-8"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                            <span className="font-medium text-foreground">
                              {selectedUser.category}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary" />
                              {selectedUser.location.city}, {selectedUser.location.state}
                            </span>
                            {selectedUser.website && (
                              <>
                                <span>•</span>
                                <a
                                  href={selectedUser.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                                >
                                  website <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right-aligned Social Icons only (no counts) */}
                      <div className="flex items-center gap-3 sm:self-center shrink-0">
                        {selectedUser.followers.instagram && (
                          <div className="p-2 rounded-full bg-muted/60 hover:bg-muted transition-colors" title="Instagram">
                            <Instagram className="h-5 w-5 text-social-instagram" />
                          </div>
                        )}
                        {selectedUser.followers.facebook && (
                          <div className="p-2 rounded-full bg-muted/60 hover:bg-muted transition-colors" title="Facebook">
                            <Facebook className="h-5 w-5 text-social-facebook" />
                          </div>
                        )}
                        {selectedUser.followers.youtube && (
                          <div className="p-2 rounded-full bg-muted/60 hover:bg-muted transition-colors" title="YouTube">
                            <Youtube className="h-5 w-5 text-social-youtube" />
                          </div>
                        )}
                        {selectedUser.followers.twitter && (
                          <div className="p-2 rounded-full bg-muted/60 hover:bg-muted transition-colors" title="Twitter">
                            <Twitter className="h-5 w-5 text-social-twitter" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* TABS: Services | Data | Gallery (matching Image 3) */}
                    <Tabs
                      value={activeTab}
                      onValueChange={(val) => setActiveTab(val as any)}
                      className="w-full flex-1 flex flex-col"
                    >
                      <TabsList className="grid w-full grid-cols-3 bg-muted/70 p-1 rounded-xl mb-4">
                        <TabsTrigger
                          value="services"
                          className="data-[state=active]:bg-background data-[state=active]:text-foreground font-semibold text-xs py-2 rounded-lg"
                        >
                          Services
                        </TabsTrigger>
                        <TabsTrigger
                          value="data"
                          className="data-[state=active]:bg-background data-[state=active]:text-foreground font-semibold text-xs py-2 rounded-lg"
                        >
                          Data
                        </TabsTrigger>
                        <TabsTrigger
                          value="gallery"
                          className="data-[state=active]:bg-background data-[state=active]:text-foreground font-semibold text-xs py-2 rounded-lg"
                        >
                          Gallery
                        </TabsTrigger>
                      </TabsList>

                      {/* TAB 1: Services (Exact 3-column media cards matching Image 3) */}
                      <TabsContent value="services" className="m-0 flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(selectedUser.services.length > 0
                            ? selectedUser.services
                            : MOCK_BUSINESS_USERS[0].services
                          ).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => setPreviewMediaItem(item)}
                              role="button"
                              tabIndex={0}
                              className="group cursor-pointer rounded-xl overflow-hidden bg-card border border-border shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
                            >
                              {/* Media Thumbnail Container with Social Badges */}
                              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                                <img
                                  src={item.media_url}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {item.media_type === 'video' && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                      <Play className="w-4 h-4 fill-white ml-0.5" />
                                    </div>
                                  </div>
                                )}

                                {/* Top-Right Social Badges matching Image 3 */}
                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                                  {item.platforms.map((p) => renderPlatformBadge(p))}
                                </div>
                              </div>

                              {/* Bottom Engagement Counters matching Image 3 */}
                              <div className="px-3.5 py-3 bg-card border-t border-border flex items-center justify-between text-muted-foreground text-xs">
                                <div className="flex items-center gap-1" title="Likes">
                                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                                  <span className="font-semibold text-foreground">
                                    {formatNumber(item.metrics.likes)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1" title="Comments">
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="font-semibold text-foreground">
                                    {formatNumber(item.metrics.comments)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1" title="Shares">
                                  <Share2 className="w-3.5 h-3.5 text-blue-500" />
                                  <span className="font-semibold text-foreground">
                                    {formatNumber(item.metrics.shares)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1" title="Views">
                                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="font-semibold text-foreground">
                                    {formatNumber(item.metrics.views)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* TAB 2: Data (Analytics & Performance Metrics) */}
                      <TabsContent value="data" className="m-0 flex-1 space-y-5">
                        {/* 4 Metric Highlights */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-muted/40 rounded-xl p-3.5 border border-border text-center">
                            <span className="text-2xl font-black text-foreground block">
                              {selectedUser.metrics.total_campaigns}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Total Campaigns
                            </span>
                          </div>
                          <div className="bg-muted/40 rounded-xl p-3.5 border border-border text-center">
                            <span className="text-2xl font-black text-foreground block">
                              {selectedUser.metrics.engagement_rate}%
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Avg Engagement
                            </span>
                          </div>
                          <div className="bg-muted/40 rounded-xl p-3.5 border border-border text-center">
                            <span className="text-2xl font-black text-foreground block">
                              {formatNumber(selectedUser.metrics.avg_reach)}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Avg Reach
                            </span>
                          </div>
                          <div className="bg-muted/40 rounded-xl p-3.5 border border-border text-center">
                            <span className="text-2xl font-black text-foreground block">
                              {selectedUser.metrics.impact_score}/100
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Impact Score
                            </span>
                          </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Engagement Rate Trend */}
                          <div className="bg-card p-4 rounded-xl border border-border">
                            <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              Engagement Rate Trend (%)
                            </h4>
                            <div className="h-44 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={engagementData}>
                                  <defs>
                                    <linearGradient id="engColor" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                                  <YAxis stroke="#888888" fontSize={11} domain={[0, 10]} />
                                  <Tooltip />
                                  <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#engColor)"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Platform Performance Breakdown */}
                          <div className="bg-card p-4 rounded-xl border border-border">
                            <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-primary" />
                              Platform Collaboration Distribution
                            </h4>
                            <div className="h-44 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={platformDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={3}
                                    dataKey="value"
                                  >
                                    {platformDistribution.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* TAB 3: Gallery (Visual Creative Portfolio matching Image 3) */}
                      <TabsContent value="gallery" className="m-0 flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(selectedUser.gallery.length > 0
                            ? selectedUser.gallery
                            : MOCK_BUSINESS_USERS[0].gallery
                          ).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => setPreviewMediaItem(item)}
                              role="button"
                              tabIndex={0}
                              className="group cursor-pointer rounded-xl overflow-hidden bg-card border border-border shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
                            >
                              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                                <img
                                  src={item.media_url}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                                  {item.platforms.map((p) => renderPlatformBadge(p))}
                                </div>
                              </div>
                              <div className="px-3.5 py-3 bg-card border-t border-border flex items-center justify-between text-muted-foreground text-xs">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                                  <span className="font-semibold text-foreground">
                                    {formatNumber(item.metrics.likes)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="font-semibold text-foreground">
                                    {formatNumber(item.metrics.comments)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="w-3.5 h-3.5 text-blue-500" />
                                  <span className="font-semibold text-foreground">
                                    {formatNumber(item.metrics.shares)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="font-semibold text-foreground">
                                    {formatNumber(item.metrics.views)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* RIGHT SIDEBAR FILTER SHEET (matching media_1791613315681.png) */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent
          side="right"
          className="sm:max-w-[390px] w-full p-0 flex flex-col justify-between bg-background border-l border-border shadow-2xl"
        >
          {/* Header matching image */}
          <div className="p-5 pb-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Filters</h2>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs h-8 px-3 rounded-lg font-semibold hover:bg-muted"
            >
              Reset Filters
            </Button>
          </div>

          {/* Form / Filter Options Only (Location, Category, Business status, Service type, Total orders) */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* 1. Location */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Location</h3>
              <div className="space-y-3">
                <select
                  value={tempCountry}
                  onChange={(e) => {
                    setTempCountry(e.target.value);
                    setTempState('all');
                    setTempCity('all');
                  }}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value="all">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={tempState}
                  onChange={(e) => {
                    setTempState(e.target.value);
                    setTempCity('all');
                  }}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value="all">Select State</option>
                  {availableStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={tempCity}
                  onChange={(e) => setTempCity(e.target.value)}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value="all">Select City</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Category */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Category</h3>
              <select
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="all">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* 3. Business Status (registered/NotRegistered) */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Business status</h3>
              <select
                value={tempBusinessStatus}
                onChange={(e) => setTempBusinessStatus(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="all">Select Business Status</option>
                <option value="registered">Registered</option>
                <option value="not_registered">Not Registered</option>
              </select>
            </div>

            {/* 4. Service Type (Online/offline/both) */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Service type</h3>
              <select
                value={tempServiceType}
                onChange={(e) => setTempServiceType(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="all">Select Service Type</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* 5. Total Orders as progress bar */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Total orders</h3>
              <div className="pt-2 pb-1 px-1">
                <Slider
                  value={[tempMinOrders]}
                  onValueChange={(val) => setTempMinOrders(val[0])}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 font-medium">
                <span>0</span>
                <span>{tempMinOrders > 0 ? `${tempMinOrders}+ Orders` : '0'}</span>
              </div>
            </div>
          </div>

          {/* Footer matching media_1791613315681.png */}
          <div className="p-4 px-6 border-t border-border flex items-center justify-between bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFilterOpen(false)}
              className="px-5 py-2 h-10 rounded-xl text-xs font-semibold hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApplyFilters}
              className="px-6 py-2 h-10 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs"
            >
              Update
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* CONNECT / PROPOSAL DIALOG */}
      <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
        <DialogContent className="sm:max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Collaborate with {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendProposal} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold block mb-1.5">Proposal Message</label>
              <textarea
                rows={4}
                required
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                placeholder="Introduce yourself and outline your collaboration concept, deliverables, and estimated reach..."
                className="w-full rounded-md border border-input bg-background p-3 text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsConnectOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                Submit Proposal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MEDIA PREVIEW LIGHTBOX DIALOG */}
      {previewMediaItem && (
        <Dialog
          open={!!previewMediaItem}
          onOpenChange={(open) => !open && setPreviewMediaItem(null)}
        >
          <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-black text-white border-0 shadow-2xl">
            <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center">
              <img
                src={previewMediaItem.media_url}
                alt={previewMediaItem.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {previewMediaItem.platforms.map((p) => renderPlatformBadge(p))}
              </div>
            </div>
            <div className="p-4 bg-slate-950">
              <h3 className="font-bold text-sm text-white mb-2">{previewMediaItem.title}</h3>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>{formatNumber(previewMediaItem.metrics.likes)} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>{formatNumber(previewMediaItem.metrics.comments)} comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span>{formatNumber(previewMediaItem.metrics.shares)} shares</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>{formatNumber(previewMediaItem.metrics.views)} views</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BusinessUsersPage;
