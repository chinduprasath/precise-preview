import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, Users, FileText, ShoppingCart, RefreshCcw, Briefcase } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { StatsCard } from '@/components/ui/stats-card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { OrderStatus } from '@/types/serviceOrder';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<string>('30days');
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const [lastUpdated] = useState<Date>(new Date());
  const [orderDateRange, setOrderDateRange] = useState<string>('30days');

  // Mock data
  const userStats = {
    totalBusinessUsers: 873,
    totalInfluencers: 1245,
    activeUsers7Days: 489,
    activeUsers30Days: 1567,
    userGrowthData: [
      { month: 'Jan', influencers: 780, business: 520 },
      { month: 'Feb', influencers: 810, business: 540 },
      { month: 'Mar', influencers: 860, business: 570 },
      { month: 'Apr', influencers: 900, business: 610 },
      { month: 'May', influencers: 950, business: 650 },
      { month: 'Jun', influencers: 1000, business: 690 },
      { month: 'Jul', influencers: 1080, business: 730 },
      { month: 'Aug', influencers: 1120, business: 760 },
      { month: 'Sep', influencers: 1160, business: 810 },
      { month: 'Oct', influencers: 1200, business: 840 },
      { month: 'Nov', influencers: 1230, business: 860 },
      { month: 'Dec', influencers: 1245, business: 873 }
    ],
    subscriptionData: [
      { plan: 'Freemium', influencer: 485, business: 234 },
      { plan: 'Basic', influencer: 356, business: 298 },
      { plan: 'Advanced', influencer: 287, business: 187 },
      { plan: 'Custom', influencer: 117, business: 154 }
    ]
  };

  const orderStats = {
    totalOrders: 3426,
    completedOrders: 2781,
    pendingOrders: 487,
    cancelledOrders: 158,
    orderTrendData: [
      { month: 'Jan', orders: 220 },
      { month: 'Feb', orders: 240 },
      { month: 'Mar', orders: 280 },
      { month: 'Apr', orders: 320 },
      { month: 'May', orders: 350 },
      { month: 'Jun', orders: 310 },
      { month: 'Jul', orders: 290 },
      { month: 'Aug', orders: 330 },
      { month: 'Sep', orders: 380 },
      { month: 'Oct', orders: 400 },
      { month: 'Nov', orders: 420 },
      { month: 'Dec', orders: 360 }
    ],
    topInfluencers: [
      { id: 1, name: 'Sara Johnson', category: 'Fashion', orders: 156, revenue: '₹2,356,000' },
      { id: 2, name: 'Raj Patel', category: 'Technology', orders: 132, revenue: '₹1,987,500' },
      { id: 3, name: 'Ananya Sharma', category: 'Beauty', orders: 121, revenue: '₹1,765,200' },
      { id: 4, name: 'Mike Chen', category: 'Fitness', orders: 108, revenue: '₹1,532,800' },
      { id: 5, name: 'Priya Desai', category: 'Food', orders: 97, revenue: '₹1,345,600' }
    ],
    activeBusinesses: [
      { id: 1, name: 'TechCorp Solutions', industry: 'Technology', orders: 87, spend: '₹1,245,000' },
      { id: 2, name: 'FashionHub', industry: 'Retail', orders: 76, spend: '₹1,120,300' },
      { id: 3, name: 'GreenEats', industry: 'Food', orders: 68, spend: '₹942,700' },
      { id: 4, name: 'FitLife', industry: 'Health & Fitness', orders: 62, spend: '₹875,100' },
      { id: 5, name: 'BeautyBrands', industry: 'Cosmetics', orders: 59, spend: '₹823,500' }
    ]
  };

  const serviceStats = {
    graphicDesigners: {
      totalProjects: 875,
      logoDesigns: 356,
      posterBanners: 519,
      projectsData: [
        { month: 'Aug', logoDesigns: 38, posterBanners: 57 },
        { month: 'Sep', logoDesigns: 42, posterBanners: 63 },
        { month: 'Oct', logoDesigns: 46, posterBanners: 68 },
        { month: 'Nov', logoDesigns: 41, posterBanners: 59 },
        { month: 'Dec', logoDesigns: 36, posterBanners: 52 }
      ]
    },
    socialMedia: {
      totalCampaigns: 1345,
      platforms: {
        googleAds: 245,
        instagram: 387,
        facebook: 298,
        linkedin: 182,
        youtube: 156,
        pinterest: 43,
        snapchat: 22,
        twitter: 12
      },
      platformsData: [
        { name: 'Instagram', value: 387 },
        { name: 'Facebook', value: 298 },
        { name: 'Google Ads', value: 245 },
        { name: 'LinkedIn', value: 182 },
        { name: 'YouTube', value: 156 },
        { name: 'Others', value: 77 }
      ]
    },
    marketing: {
      totalEngagements: 1056,
      services: {
        seo: 387,
        ppc: 298,
        googleAnalytics: 182,
        googleBusinessProfile: 189
      },
      servicesData: [
        { name: 'SEO', value: 387 },
        { name: 'PPC', value: 298 },
        { name: 'Google Analytics', value: 182 },
        { name: 'Google Business', value: 189 }
      ]
    },
    ottCampaigns: {
      totalCampaigns: 567,
      platforms: {
        hotstar: 187,
        amazonPrime: 156,
        jioCinema: 142,
        zee5: 82
      },
      platformsData: [
        { name: 'Hotstar', value: 187 },
        { name: 'Amazon Prime', value: 156 },
        { name: 'Jio Cinema', value: 142 },
        { name: 'Zee5', value: 82 }
      ]
    }
  };

  const teamStats = {
    totalTeamMembers: 48,
    roles: {
      superAdmin: 3,
      operations: 12,
      support: 18,
      moderator: 8,
      finance: 7
    },
    rolesData: [
      { name: 'Super Admin', value: 3 },
      { name: 'Operations', value: 12 },
      { name: 'Support', value: 18 },
      { name: 'Moderator', value: 8 },
      { name: 'Finance', value: 7 }
    ],
    recentActivity: [
      { id: 1, user: 'Amit Kumar', role: 'Super Admin', action: 'Updated platform settings', timestamp: '2 hours ago' },
      { id: 2, user: 'Neha Singh', role: 'Operations', action: 'Approved 15 new influencers', timestamp: '3 hours ago' },
      { id: 3, user: 'Raj Malhotra', role: 'Support', action: 'Resolved 28 support tickets', timestamp: '5 hours ago' },
      { id: 4, user: 'Priya Verma', role: 'Moderator', action: 'Flagged 7 inappropriate posts', timestamp: '6 hours ago' },
      { id: 5, user: 'Vikram Joshi', role: 'Finance', action: 'Processed 42 payments', timestamp: '8 hours ago' }
    ]
  };

  // Mock data for Service Orders Analytics
  const serviceOrderStats = {
    totalOrders: 487,
    ordersByStatus: {
      pending: 156,
      in_progress: 211,
      completed: 98,
      cancelled: 22
    },
    ordersByType: {
      graphics_design: 215,
      digital_marketing: 92,
      social_media: 143,
      ott_campaigns: 37
    },
    ordersTrend: [
      { month: 'Jan', total: 32, graphics_design: 14, digital_marketing: 8, social_media: 7, ott_campaigns: 3 },
      { month: 'Feb', total: 38, graphics_design: 17, digital_marketing: 9, social_media: 9, ott_campaigns: 3 },
      { month: 'Mar', total: 45, graphics_design: 20, digital_marketing: 10, social_media: 12, ott_campaigns: 3 },
      { month: 'Apr', total: 51, graphics_design: 23, digital_marketing: 11, social_media: 13, ott_campaigns: 4 },
      { month: 'May', total: 48, graphics_design: 21, digital_marketing: 11, social_media: 12, ott_campaigns: 4 },
      { month: 'Jun', total: 42, graphics_design: 19, digital_marketing: 9, social_media: 11, ott_campaigns: 3 },
      { month: 'Jul', total: 39, graphics_design: 18, digital_marketing: 8, social_media: 10, ott_campaigns: 3 },
      { month: 'Aug', total: 44, graphics_design: 20, digital_marketing: 9, social_media: 11, ott_campaigns: 4 },
      { month: 'Sep', total: 47, graphics_design: 21, digital_marketing: 10, social_media: 12, ott_campaigns: 4 },
      { month: 'Oct', total: 52, graphics_design: 23, digital_marketing: 11, social_media: 14, ott_campaigns: 4 },
      { month: 'Nov', total: 49, graphics_design: 22, digital_marketing: 10, social_media: 13, ott_campaigns: 4 },
      { month: 'Dec', total: 40, graphics_design: 17, digital_marketing: 9, social_media: 11, ott_campaigns: 3 }
    ],
    teamPerformance: [
      { id: 1, name: "Rahul Sharma", role: "Graphic Designer", completed: 78, inProgress: 12 },
      { id: 2, name: "Priya Singh", role: "Social Media Specialist", completed: 65, inProgress: 15 },
      { id: 3, name: "Vikram Patel", role: "Digital Marketing Expert", completed: 52, inProgress: 9 },
      { id: 4, name: "Divya Gupta", role: "OTT Campaign Manager", completed: 37, inProgress: 6 },
      { id: 5, name: "Amit Kumar", role: "Graphic Designer", completed: 72, inProgress: 14 }
    ]
  };

  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#1A1F2C', '#D6BCFA', '#1EAEDB'];
  const ORDER_STATUS_COLORS = {
    pending: '#FFB347', // Amber
    in_progress: '#6E59A5', // Purple
    completed: '#4CAF50', // Green
    cancelled: '#EF5350'  // Red
  };
  
  const SERVICE_TYPE_COLORS = {
    graphics_design: '#9b87f5',
    digital_marketing: '#1EAEDB',
    social_media: '#7E69AB',
    ott_campaigns: '#D6BCFA'
  };

  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting data in ${format} format`);
    // In a real application, this would generate and download the file
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
    // In a real application, this would fetch fresh data
  };

  // Get last 6 months of user growth data
  const last6MonthsData = userStats.userGrowthData.slice(-6);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleRefresh}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Select>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Export" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv" onClick={() => handleExport('CSV')}>CSV</SelectItem>
                      <SelectItem value="excel" onClick={() => handleExport('Excel')}>Excel</SelectItem>
                      <SelectItem value="pdf" onClick={() => handleExport('PDF')}>PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard 
                title="Total Business Users" 
                value={userStats.totalBusinessUsers.toLocaleString()} 
                color="#9b87f5" 
                graphData={userStats.userGrowthData.map(d => d.business)}
              />
              <StatsCard 
                title="Total Influencers" 
                value={userStats.totalInfluencers.toLocaleString()} 
                color="#7E69AB" 
                graphData={userStats.userGrowthData.map(d => d.influencers)}
              />
              <StatsCard 
                title="Total Orders" 
                value={orderStats.totalOrders.toLocaleString()} 
                color="#6E59A5" 
                graphData={orderStats.orderTrendData.map(d => d.orders)}
              />
              <StatsCard 
                title="Service Orders" 
                value={serviceOrderStats.totalOrders.toLocaleString()} 
                color="#1EAEDB" 
                graphData={serviceOrderStats.ordersTrend.map(d => d.total)}
              />
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="users" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="users" className="px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  User Analytics
                </TabsTrigger>
                <TabsTrigger value="orders" className="px-4 py-2">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Order Analytics
                </TabsTrigger>
                <TabsTrigger value="services" className="px-4 py-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Service Analytics
                </TabsTrigger>
                <TabsTrigger value="team" className="px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Team Analytics
                </TabsTrigger>
                <TabsTrigger value="service_orders" className="px-4 py-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Order Analytics
                </TabsTrigger>
              </TabsList>

              {/* User Analytics Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>User growth over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={last6MonthsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="influencers" 
                            stackId="1" 
                            stroke="#9b87f5" 
                            fill="#9b87f5" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="business" 
                            stackId="1" 
                            stroke="#7E69AB" 
                            fill="#7E69AB" 
                          />
                        </AreaChart>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Count by Role and Subscription Plan</CardTitle>
                      <CardDescription>User segmentation by role and plan type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={userStats.subscriptionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="plan" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="influencer" fill="#9b87f5" name="Influencer" />
                            <Bar dataKey="business" fill="#1EAEDB" name="Business" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Users</CardTitle>
                      <CardDescription>User activity in the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                          <span className="text-4xl font-bold text-primary">
                            {userStats.activeUsers7Days}
                          </span>
                          <span className="text-sm text-gray-500">Last 7 Days</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                          <span className="text-4xl font-bold text-primary">
                            {userStats.activeUsers30Days}
                          </span>
                          <span className="text-sm text-gray-500">Last 30 Days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Retention</CardTitle>
                      <CardDescription>Monthly retention rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={[
                            { month: 'Aug', retention: 78 },
                            { month: 'Sep', retention: 82 },
                            { month: 'Oct', retention: 85 },
                            { month: 'Nov', retention: 87 },
                            { month: 'Dec', retention: 91 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="retention" fill="#9b87f5" name="Retention Rate %" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Order Analytics Tab */}
              <TabsContent value="orders" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Breakdown</CardTitle>
                      <CardDescription>Distribution by status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Completed', value: orderStats.completedOrders },
                                { name: 'Pending', value: orderStats.pendingOrders },
                                { name: 'Cancelled', value: orderStats.cancelledOrders }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: 'Completed', value: orderStats.completedOrders },
                                { name: 'Pending', value: orderStats.pendingOrders },
                                { name: 'Cancelled', value: orderStats.cancelledOrders }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle>Order Trends</CardTitle>
                      <CardDescription>Monthly order trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={orderStats.orderTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#9b87f5" name="Orders" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Influencers</CardTitle>
                      <CardDescription>By total orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderStats.topInfluencers.map((influencer) => (
                            <TableRow key={influencer.id}>
                              <TableCell className="font-medium">{influencer.name}</TableCell>
                              <TableCell>{influencer.category}</TableCell>
                              <TableCell>{influencer.orders}</TableCell>
                              <TableCell>{influencer.revenue}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Most Active Business Users</CardTitle>
                      <CardDescription>By total orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Total Spend</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderStats.activeBusinesses.map((business) => (
                            <TableRow key={business.id}>
                              <TableCell className="font-medium">{business.name}</TableCell>
                              <TableCell>{business.industry}</TableCell>
                              <TableCell>{business.orders}</TableCell>
                              <TableCell>{business.spend}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Service Analytics Tab */}
              <TabsContent value="services" className="space-y-6">
                {/* Service Category Selector */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Service Category Analytics</CardTitle>
                    <CardDescription>Analysis by service type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={serviceCategory} onValueChange={setServiceCategory}>
                      <SelectTrigger className="w-full md:w-[280px] mb-4">
                        <SelectValue placeholder="Select Service Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="graphicDesigners">Graphic Designers</SelectItem>
                        <SelectItem value="socialMedia">Social Media Campaigns</SelectItem>
                        <SelectItem value="marketing">Marketing Services</SelectItem>
                        <SelectItem value="ottCampaigns">OTT Campaigns</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Graphic Designers */}
                    {(serviceCategory === 'all' || serviceCategory === 'graphicDesigners') && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Graphic Designers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg border p-4">
                            <p className="text-sm text-gray-500">Total Projects</p>
                            <p className="text-2xl font-bold">{serviceStats.graphicDesigners.totalProjects}</p>
                          </div>
                          <div className="bg-white rounded-lg border p-4">
                            <p className="text-sm text-gray-500">Logo Designs</p>
                            <p className="text-2xl font-bold">{serviceStats.graphicDesigners.logoDesigns}</p>
                          </div>
                          <div className="bg-white rounded-lg border p-4">
                            <p className="text-sm text-gray-500">Poster/Banner Editors</p>
                            <p className="text-2xl font-bold">{serviceStats.graphicDesigners.posterBanners}</p>
                          </div>
                        </div>
                        
                        <div className="h-60 bg-white rounded-lg border p-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={serviceStats.graphicDesigners.projectsData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="logoDesigns" fill="#9b87f5" name="Logo Designs" />
                              <Bar dataKey="posterBanners" fill="#7E69AB" name="Poster/Banner" />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Social Media Campaigns */}
                    {(serviceCategory === 'all' || serviceCategory === 'socialMedia') && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Social Media Campaigns</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="bg-white rounded-lg border p-4 mb-4">
                              <p className="text-sm text-gray-500">Total Campaigns</p>
                              <p className="text-2xl font-bold">{serviceStats.socialMedia.totalCampaigns}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(serviceStats.socialMedia.platforms).map(([platform, count]) => (
                                <div key={platform} className="bg-white rounded-lg border p-3">
                                  <p className="text-xs text-gray-500 capitalize">{platform}</p>
                                  <p className="text-lg font-bold">{count}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="h-60 bg-white rounded-lg border p-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={serviceStats.socialMedia.platformsData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {serviceStats.socialMedia.platformsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Marketing Services */}
                    {(serviceCategory === 'all' || serviceCategory === 'marketing') && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Marketing Services</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="bg-white rounded-lg border p-4 mb-4">
                              <p className="text-sm text-gray-500">Total Engagements</p>
                              <p className="text-2xl font-bold">{serviceStats.marketing.totalEngagements}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              {Object.entries(serviceStats.marketing.services).map(([service, count]) => (
                                <div key={service} className="bg-white rounded-lg border p-3">
                                  <p className="text-xs text-gray-500 capitalize">
                                    {service === 'seo' ? 'SEO' : 
                                     service === 'ppc' ? 'PPC' : 
                                     service === 'googleAnalytics' ? 'Google Analytics' : 
                                     'Google Business Profile'}
                                  </p>
                                  <p className="text-lg font-bold">{count}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="h-60 bg-white rounded-lg border p-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={serviceStats.marketing.servicesData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {serviceStats.marketing.servicesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OTT Campaigns */}
                    {(serviceCategory === 'all' || serviceCategory === 'ottCampaigns') && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">OTT Campaigns</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="bg-white rounded-lg border p-4 mb-4">
                              <p className="text-sm text-gray-500">Total Campaigns</p>
                              <p className="text-2xl font-bold">{serviceStats.ottCampaigns.totalCampaigns}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              {Object.entries(serviceStats.ottCampaigns.platforms).map(([platform, count]) => (
                                <div key={platform} className="bg-white rounded-lg border p-3">
                                  <p className="text-xs text-gray-500 capitalize">{platform}</p>
                                  <p className="text-lg font-bold">{count}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="h-60 bg-white rounded-lg border p-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={serviceStats.ottCampaigns.platformsData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {serviceStats.ottCampaigns.platformsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Team Analytics Tab */}
              <TabsContent value="team" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle>Team Composition</CardTitle>
                      <CardDescription>Distribution by role</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={teamStats.rolesData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {teamStats.rolesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-1">
                        <p className="text-sm text-center">Total Team Members: <span className="font-bold">{teamStats.totalTeamMembers}</span></p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Team Activity</CardTitle>
                      <CardDescription>Last actions performed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Team Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teamStats.recentActivity.map((activity) => (
                            <TableRow key={activity.id}>
                              <TableCell className="font-medium">{activity.user}</TableCell>
                              <TableCell>{activity.role}</TableCell>
                              <TableCell>{activity.action}</TableCell>
                              <TableCell>{activity.timestamp}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Service Orders Analytics Tab */}
              <TabsContent value="service_orders" className="space-y-6">
                <div className="mb-6">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Service Orders Overview</CardTitle>
                      <CardDescription>Filter by date range</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <Select value={orderDateRange} onValueChange={setOrderDateRange}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Date Range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={handleRefresh}>
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Refresh Data
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Total Orders</p>
                          </div>
                          <p className="text-2xl font-bold">{serviceOrderStats.totalOrders}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Pending</p>
                          </div>
                          <p className="text-2xl font-bold text-amber-500">{serviceOrderStats.ordersByStatus.pending}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">In Progress</p>
                          </div>
                          <p className="text-2xl font-bold text-purple-500">{serviceOrderStats.ordersByStatus.in_progress}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Completed</p>
                          </div>
                          <p className="text-2xl font-bold text-green-500">{serviceOrderStats.ordersByStatus.completed}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Orders by Service Type</CardTitle>
                        <CardDescription>Distribution across categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Graphics Design', value: serviceOrderStats.ordersByType.graphics_design },
                                  { name: 'Digital Marketing', value: serviceOrderStats.ordersByType.digital_marketing },
                                  { name: 'Social Media', value: serviceOrderStats.ordersByType.social_media },
                                  { name: 'OTT Campaigns', value: serviceOrderStats.ordersByType.ott_campaigns }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell fill={SERVICE_TYPE_COLORS.graphics_design} />
                                <Cell fill={SERVICE_TYPE_COLORS.digital_marketing} />
                                <Cell fill={SERVICE_TYPE_COLORS.social_media} />
                                <Cell fill={SERVICE_TYPE_COLORS.ott_campaigns} />
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Orders by Status</CardTitle>
                        <CardDescription>Current status distribution</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={Object.entries(serviceOrderStats.ordersByStatus).map(([key, value]) => ({
                                  name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                                  value: value
                                }))}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {Object.entries(serviceOrderStats.ordersByStatus).map(([key, value]) => (
                                  <Cell 
                                    key={`status-${key}`} 
                                    fill={ORDER_STATUS_COLORS[key as OrderStatus]} 
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Trends Over Time</CardTitle>
                      <CardDescription>Monthly order counts by service type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={serviceOrderStats.ordersTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="graphics_design" name="Graphics Design" fill={SERVICE_TYPE_COLORS.graphics_design} stackId="a" />
                            <Bar dataKey="digital_marketing" name="Digital Marketing" fill={SERVICE_TYPE_COLORS.digital_marketing} stackId="a" />
                            <Bar dataKey="social_media" name="Social Media" fill={SERVICE_TYPE_COLORS.social_media} stackId="a" />
                            <Bar dataKey="ott_campaigns" name="OTT Campaigns" fill={SERVICE_TYPE_COLORS.ott_campaigns} stackId="a" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Service orders handled by team members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Completed Orders</TableHead>
                            <TableHead>In Progress</TableHead>
                            <TableHead>Completion Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviceOrderStats.teamPerformance.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">{member.name}</TableCell>
                              <TableCell>{member.role}</TableCell>
                              <TableCell>{member.completed}</TableCell>
                              <TableCell>{member.inProgress}</TableCell>
                              <TableCell>
                                {Math.round((member.completed / (member.completed + member.inProgress)) * 100)}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
