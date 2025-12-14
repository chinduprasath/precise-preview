import React, { useState } from 'react';
import { 
  Link, 
  Eye, 
  Heart, 
  Repeat, 
  MessageSquare, 
  Link2, 
  Search, 
  Calendar, 
  Users, 
  Award, 
  RefreshCw, 
  FileText, 
  Check, 
  X, 
  Hourglass, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPromotion } from '@/types/offer';

// Mock data for the marketing dashboard
const mockPromotionData: UserPromotion[] = [
  {
    id: '1',
    userName: 'John Business',
    userType: 'business',
    userProfilePic: 'https://i.pravatar.cc/150?img=1',
    platform: 'Instagram',
    offerId: '1',
    generatedUrl: 'https://inf.co/promo/u123/summer25',
    postTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    timeRemaining: '12h remaining',
    status: 'Live',
    engagement: { views: 245, likes: 56, shares: 12, comments: 8, clicks: 23 },
    rewardStatus: 'Pending'
  },
  {
    id: '2',
    userName: 'Sarah Influencer',
    userType: 'influencer',
    userProfilePic: 'https://i.pravatar.cc/150?img=5',
    platform: 'YouTube',
    offerId: '1',
    generatedUrl: 'https://inf.co/promo/u456/summer25',
    postTime: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    timeRemaining: '4h remaining',
    status: 'Live',
    engagement: { views: 1245, likes: 156, shares: 42, comments: 28, clicks: 93 },
    rewardStatus: 'Pending'
  },
  {
    id: '3',
    userName: 'Mike Business',
    userType: 'business',
    userProfilePic: 'https://i.pravatar.cc/150?img=3',
    platform: 'Facebook',
    offerId: '1',
    generatedUrl: 'https://inf.co/promo/u789/summer25',
    postTime: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    timeRemaining: '0h remaining',
    status: 'Expired',
    engagement: { views: 345, likes: 46, shares: 8, comments: 12, clicks: 31 },
    rewardStatus: 'Given'
  },
  {
    id: '4',
    userName: 'Emma Influencer',
    userType: 'influencer',
    userProfilePic: 'https://i.pravatar.cc/150?img=9',
    platform: 'Instagram',
    offerId: '1',
    generatedUrl: 'https://inf.co/promo/u321/summer25',
    postTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
    timeRemaining: '19h remaining',
    status: 'Live',
    engagement: { views: 845, likes: 156, shares: 32, comments: 48, clicks: 63 },
    rewardStatus: 'Pending'
  },
  {
    id: '5',
    userName: 'David Business',
    userType: 'business',
    userProfilePic: 'https://i.pravatar.cc/150?img=7',
    platform: 'Twitter',
    offerId: '1',
    generatedUrl: 'https://inf.co/promo/u654/summer25',
    postTime: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    timeRemaining: '0h remaining',
    status: 'Removed',
    engagement: { views: 145, likes: 26, shares: 5, comments: 3, clicks: 12 },
    rewardStatus: 'Pending'
  }
];

// Calculate total stats
const totalStats = {
  urlsGenerated: mockPromotionData.length,
  views: mockPromotionData.reduce((sum, item) => sum + item.engagement.views, 0),
  likes: mockPromotionData.reduce((sum, item) => sum + item.engagement.likes, 0),
  shares: mockPromotionData.reduce((sum, item) => sum + item.engagement.shares, 0),
  comments: mockPromotionData.reduce((sum, item) => sum + item.engagement.comments, 0),
  clicks: mockPromotionData.reduce((sum, item) => sum + item.engagement.clicks, 0),
};

const MarketingMetricsTab: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    dateRange: { from: undefined, to: undefined } as { from: Date | undefined, to: Date | undefined },
    platform: '',
    userType: '',
    rewardStatus: ''
  });
  
  const [promotions, setPromotions] = useState<UserPromotion[]>(mockPromotionData);
  
  const refreshData = () => {
    setPromotions([...mockPromotionData]);
  };
  
  const exportData = () => {
    alert('Exporting data to CSV... (This would download a file in a real app)');
  };
  
  const filteredPromotions = promotions.filter(promo => {
    if (filters.search && !promo.userName?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.platform && filters.platform !== 'all' && promo.platform !== filters.platform) {
      return false;
    }
    if (filters.userType && filters.userType !== 'all' && promo.userType !== filters.userType) {
      return false;
    }
    if (filters.rewardStatus && filters.rewardStatus !== 'all' && promo.rewardStatus !== filters.rewardStatus) {
      return false;
    }
    if (filters.dateRange.from && filters.dateRange.to) {
      const postDate = new Date(promo.postTime || '');
      if (postDate < filters.dateRange.from || postDate > filters.dateRange.to) {
        return false;
      }
    }
    return true;
  });
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'Facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'YouTube':
        return <Youtube className="w-4 h-4 text-red-600" />;
      case 'Twitter':
        return <Twitter className="w-4 h-4 text-blue-400" />;
      default:
        return <Link className="w-4 h-4" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" /> Live</Badge>;
      case 'Removed':
        return <Badge className="bg-red-500"><X className="w-3 h-3 mr-1" /> Removed</Badge>;
      case 'Expired':
        return <Badge className="bg-muted text-muted-foreground"><Hourglass className="w-3 h-3 mr-1" /> Expired</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={refreshData}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
        <Button variant="outline" onClick={exportData}>
          <FileText className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-blue-500 p-2 rounded-full mb-2">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-muted-foreground">URLs Generated</p>
            <p className="text-xl font-bold text-foreground">{totalStats.urlsGenerated}</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-green-500 p-2 rounded-full mb-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-muted-foreground">Total Views</p>
            <p className="text-xl font-bold text-foreground">{formatNumber(totalStats.views)}</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-red-500 p-2 rounded-full mb-2">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-muted-foreground">Total Likes</p>
            <p className="text-xl font-bold text-foreground">{formatNumber(totalStats.likes)}</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-purple-500 p-2 rounded-full mb-2">
              <Repeat className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-muted-foreground">Total Shares</p>
            <p className="text-xl font-bold text-foreground">{formatNumber(totalStats.shares)}</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50 border-yellow-200 dark:border-yellow-800">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-yellow-500 p-2 rounded-full mb-2">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-muted-foreground">Total Comments</p>
            <p className="text-xl font-bold text-foreground">{formatNumber(totalStats.comments)}</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 border-indigo-200 dark:border-indigo-800">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-indigo-500 p-2 rounded-full mb-2">
              <Link className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-muted-foreground">Total Clicks</p>
            <p className="text-xl font-bold text-foreground">{formatNumber(totalStats.clicks)}</p>
          </div>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by user name..." 
              className="pl-10 bg-background"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full md:w-auto justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                selected={{
                  from: filters.dateRange.from,
                  to: filters.dateRange.to,
                }}
                onSelect={(range) => 
                  setFilters({
                    ...filters, 
                    dateRange: { 
                      from: range?.from, 
                      to: range?.to 
                    }
                  })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Select 
            value={filters.platform} 
            onValueChange={(value) => setFilters({...filters, platform: value})}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-background">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.userType} 
            onValueChange={(value) => setFilters({...filters, userType: value})}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-background">
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="influencer">Influencer</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.rewardStatus} 
            onValueChange={(value) => setFilters({...filters, rewardStatus: value})}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-background">
              <SelectValue placeholder="Reward Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Given">Reward Given</SelectItem>
              <SelectItem value="Pending">Reward Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">User</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Generated URL</TableHead>
              <TableHead>Post Time</TableHead>
              <TableHead>Time Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Engagement</TableHead>
              <TableHead>Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromotions.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {promo.userProfilePic ? (
                      <img 
                        src={promo.userProfilePic} 
                        alt={promo.userName} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Users className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{promo.userName}</p>
                      <Badge variant="outline" className="text-xs">
                        {promo.userType === 'business' ? 'Business' : 'Influencer'}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getPlatformIcon(promo.platform)}
                    <span className="ml-2">{promo.platform}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <a 
                    href={promo.generatedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm truncate max-w-[150px] inline-block"
                  >
                    {promo.generatedUrl}
                  </a>
                </TableCell>
                <TableCell>
                  {promo.postTime && (
                    <>
                      {new Date(promo.postTime).toLocaleDateString()} {new Date(promo.postTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {promo.timeRemaining}
                </TableCell>
                <TableCell>
                  {getStatusBadge(promo.status)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-3 text-xs">
                    <div className="flex items-center" title="Views">
                      <Eye className="w-3 h-3 mr-1 text-muted-foreground" />
                      <span>{promo.engagement.views}</span>
                    </div>
                    <div className="flex items-center" title="Likes">
                      <Heart className="w-3 h-3 mr-1 text-red-500" />
                      <span>{promo.engagement.likes}</span>
                    </div>
                    <div className="flex items-center" title="Shares">
                      <Repeat className="w-3 h-3 mr-1 text-green-500" />
                      <span>{promo.engagement.shares}</span>
                    </div>
                    <div className="flex items-center" title="Comments">
                      <MessageSquare className="w-3 h-3 mr-1 text-blue-500" />
                      <span>{promo.engagement.comments}</span>
                    </div>
                    <div className="flex items-center" title="Clicks">
                      <Link className="w-3 h-3 mr-1 text-purple-500" />
                      <span>{promo.engagement.clicks}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={promo.rewardStatus === 'Given' 
                      ? "bg-green-500" 
                      : "bg-yellow-500"
                    }
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {promo.rewardStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredPromotions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-border flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPromotions.length} of {promotions.length} promotions
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingMetricsTab;
