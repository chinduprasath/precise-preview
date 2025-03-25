
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, Search, Users, BarChart2, DollarSign, 
  TrendingUp, Filter, CalendarDays
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const BusinessDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Business Dashboard</h1>
                <p className="text-gray-500">Manage your influencer marketing campaigns</p>
              </div>
              <Button className="md:w-auto w-full">
                <Plus className="mr-2 h-4 w-4" /> Create Campaign
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Influencers Engaged</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <BarChart2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Campaigns</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Audience Reach</p>
                    <p className="text-2xl font-bold">2.4M</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Campaign Budget</p>
                    <p className="text-2xl font-bold">$15,750</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Find Influencers</h2>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" /> Advanced Filters
                  </Button>
                </div>
                
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name, category, or keyword..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start border rounded-lg p-4">
                      <div className="w-14 h-14 rounded-full bg-gray-200 mr-4 overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://picsum.photos/id/${i + 20}/100/100`} 
                          alt="Influencer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{
                              i === 1 ? 'Alex Johnson' :
                              i === 2 ? 'Sarah Williams' :
                              'Michael Chen'
                            }</h3>
                            <p className="text-sm text-gray-500">{
                              i === 1 ? 'Fashion & Lifestyle' :
                              i === 2 ? 'Beauty & Skincare' :
                              'Tech & Gaming'
                            }</p>
                          </div>
                          <div className="flex items-center mt-2 sm:mt-0">
                            <div className="flex items-center mr-4">
                              <Users className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm">{
                                i === 1 ? '245K' :
                                i === 2 ? '532K' :
                                '1.2M'
                              }</span>
                            </div>
                            <div className="text-sm">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                {i === 1 ? '4.2% Eng.' : i === 2 ? '3.8% Eng.' : '5.1% Eng.'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{
                          i === 1 ? 'Fashion blogger sharing the latest trends and style tips.' :
                          i === 2 ? 'Beauty expert specializing in skincare reviews and tutorials.' :
                          'Tech reviewer covering the latest gadgets and gaming content.'
                        }</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">Rate:</span> ${i * 500} - ${i * 1000} per post
                          </div>
                          <Button size="sm">View Profile</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <Button variant="outline">View More Influencers</Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Campaign Calendar</h2>
                  <Button variant="ghost" size="sm">
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-medium text-primary">
                          {['05', '12', '18', '25'][i - 1]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{
                          i === 1 ? 'Summer Collection Launch' :
                          i === 2 ? 'Product Review Campaign' :
                          i === 3 ? 'Instagram Story Series' :
                          'Brand Ambassador Kickoff'
                        }</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Due: May {['05', '12', '18', '25'][i - 1]}, 2023</span>
                          <span className={`ml-2 px-2 py-0.5 rounded-full ${
                            i === 1 ? 'bg-green-100 text-green-800' :
                            i === 2 ? 'bg-blue-100 text-blue-800' :
                            i === 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {i === 1 ? 'Live' : i === 2 ? 'Planning' : i === 3 ? 'Upcoming' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-6">
                  View Full Calendar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Campaign Performance</h2>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{
                          i === 1 ? 'Spring Collection Campaign' : 'Product Launch'
                        }</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          i === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {i === 1 ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{
                        i === 1 
                          ? 'Campaign with 5 fashion influencers to promote spring collection.' 
                          : 'Product launch campaign with tech influencers.'
                      }</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Engagement</p>
                          <p className="font-semibold">{i === 1 ? '4.5%' : '3.8%'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Impressions</p>
                          <p className="font-semibold">{i === 1 ? '1.2M' : '780K'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Clicks</p>
                          <p className="font-semibold">{i === 1 ? '24K' : '15K'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Conversions</p>
                          <p className="font-semibold">{i === 1 ? '2.3K' : '1.1K'}</p>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline">View Full Report</Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Spring Collection Campaign</p>
                      <p className="text-sm font-medium">$5,000 / $5,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Product Launch</p>
                      <p className="text-sm font-medium">$7,200 / $10,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Summer Campaign (Planned)</p>
                      <p className="text-sm font-medium">$0 / $8,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">Total Budget</p>
                      <p className="font-medium">$23,000</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Used</p>
                      <p>$12,200 (53.0%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessDashboard;
