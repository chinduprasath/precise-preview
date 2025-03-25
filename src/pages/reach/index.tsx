
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ArrowUp, ArrowDown, BarChart as BarChartIcon, Target, Users, Heart, CircleDollarSign, TrendingUp, Clock } from 'lucide-react';

// Mock data for charts
const mockOrders = [
  { id: '1', name: 'Instagram Campaign - Summer Collection', influencer: 'Christopher Campbell', value: 12500 },
  { id: '2', name: 'TikTok Product Launch - New Tech Gadget', influencer: 'Kelly Sikkema', value: 15800 },
  { id: '3', name: 'YouTube Review Series - Beauty Products', influencer: 'Houcine Ncib', value: 10500 },
  { id: '4', name: 'Instagram Story Series - Fashion Week', influencer: 'Jake Nackos', value: 8700 },
];

const engagementData = [
  { day: 'Mon', likes: 4200, comments: 1500, shares: 800 },
  { day: 'Tue', likes: 3800, comments: 1200, shares: 750 },
  { day: 'Wed', likes: 5100, comments: 2000, shares: 1100 },
  { day: 'Thu', likes: 5800, comments: 2200, shares: 1300 },
  { day: 'Fri', likes: 4900, comments: 1800, shares: 950 },
  { day: 'Sat', likes: 3400, comments: 1100, shares: 600 },
  { day: 'Sun', likes: 3200, comments: 900, shares: 500 },
];

const reachData = [
  { day: 'Mon', impressions: 12000, reach: 9500 },
  { day: 'Tue', impressions: 13500, reach: 10200 },
  { day: 'Wed', impressions: 18200, reach: 15000 },
  { day: 'Thu', impressions: 20500, reach: 16800 },
  { day: 'Fri', impressions: 17800, reach: 14200 },
  { day: 'Sat', impressions: 14200, reach: 11500 },
  { day: 'Sun', impressions: 13800, reach: 10800 },
];

const conversionData = [
  { day: 'Mon', clicks: 520, conversions: 78 },
  { day: 'Tue', clicks: 480, conversions: 65 },
  { day: 'Wed', clicks: 750, conversions: 112 },
  { day: 'Thu', clicks: 820, conversions: 123 },
  { day: 'Fri', clicks: 680, conversions: 102 },
  { day: 'Sat', clicks: 450, conversions: 68 },
  { day: 'Sun', clicks: 420, conversions: 63 },
];

const demographicData = [
  { name: '18-24', value: 35 },
  { name: '25-34', value: 40 },
  { name: '35-44', value: 15 },
  { name: '45-54', value: 7 },
  { name: '55+', value: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const GoalProgressCard = ({ current, goal, title, icon }: { current: number, goal: number, title: string, icon: React.ReactNode }) => {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
            {icon}
          </div>
        </div>
        
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-primary">
            ${current.toLocaleString()}
          </h2>
          <p className="text-sm text-gray-500">
            of ${goal.toLocaleString()} Monthly Goal
          </p>
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                {percentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
            <div style={{ width: `${percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ title, value, change, icon }: { title: string, value: string, change: { value: number, isPositive: boolean }, icon: React.ReactNode }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
            {icon}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
          <div className={`flex items-center text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change.isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {change.value}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReachPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<string>("1");
  
  const currentOrder = mockOrders.find(order => order.id === selectedOrder) || mockOrders[0];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Order selector */}
            <div className="mb-6 max-w-xs">
              <Select 
                value={selectedOrder} 
                onValueChange={(value) => setSelectedOrder(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Order" />
                </SelectTrigger>
                <SelectContent>
                  {mockOrders.map(order => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Top row metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <GoalProgressCard 
                current={currentOrder.value} 
                goal={20000} 
                title="Campaign Revenue" 
                icon={<CircleDollarSign className="h-5 w-5" />} 
              />
              <MetricCard 
                title="Total Impressions" 
                value="125.4K" 
                change={{ value: 12.5, isPositive: true }}
                icon={<Users className="h-5 w-5" />}
              />
              <MetricCard 
                title="Engagement Rate" 
                value="8.2%" 
                change={{ value: 3.1, isPositive: true }}
                icon={<Heart className="h-5 w-5" />}
              />
              <MetricCard 
                title="Conversion Rate" 
                value="3.6%" 
                change={{ value: 1.2, isPositive: true }}
                icon={<Target className="h-5 w-5" />}
              />
            </div>
            
            {/* Middle row charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Engagement Overview</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="likes" fill="#0088FE" name="Likes" />
                        <Bar dataKey="comments" fill="#00C49F" name="Comments" />
                        <Bar dataKey="shares" fill="#FFBB28" name="Shares" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Reach & Impressions</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reachData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="impressions" stroke="#8884d8" fill="#8884d8" name="Impressions" />
                        <Area type="monotone" dataKey="reach" stroke="#82ca9d" fill="#82ca9d" name="Reach" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Bottom row charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Clicks & Conversions</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={conversionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#0088FE" name="Clicks" />
                        <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#00C49F" name="Conversions" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {demographicData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Campaign Performance Metrics</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">ROI</span>
                        <span>245%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">CTR</span>
                        <span>5.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Completion Rate</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Cost per Acquisition</span>
                        <span>$12.47</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '63%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Brand Sentiment</span>
                        <span>Positive (78%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReachPage;
