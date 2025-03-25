
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Bell, BarChart2, Users, DollarSign } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const InfluencerDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Influencer Dashboard</h1>
              <p className="text-gray-500">Welcome back, Alex! Here's what's happening with your account.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Requests</p>
                    <p className="text-2xl font-bold">12</p>
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
                    <p className="text-2xl font-bold">5</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profile Views</p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Earnings (This Month)</p>
                    <p className="text-2xl font-bold">$4,890</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Request Queue</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{
                            i === 1 ? 'Fashion Brand Promotion' :
                            i === 2 ? 'Tech Gadget Review' :
                            'Fitness Product Showcase'
                          }</h3>
                          <p className="text-sm text-gray-500">{
                            i === 1 ? 'FashionCo Inc.' :
                            i === 2 ? 'TechGadgets LLC' :
                            'FitLife Products'
                          }</p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">
                          Pending
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{
                        i === 1 ? 'Create a lifestyle post featuring our new summer collection. We\'ll provide the products.' :
                        i === 2 ? 'Review our latest smartphone and share your honest opinion with your followers.' :
                        'Create a workout video showcasing how to use our resistance bands effectively.'
                      }</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Budget: <span className="font-medium">${i * 500}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-1" /> Decline
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" /> Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Campaign Calendar</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-medium text-primary">
                          {['10', '15', '22', '28'][i - 1]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{
                          i === 1 ? 'Beauty Product Review' :
                          i === 2 ? 'Fashion Haul Video' :
                          i === 3 ? 'Sponsored Story' :
                          'Product Unboxing'
                        }</p>
                        <p className="text-xs text-gray-500">Due: May {['10', '15', '22', '28'][i - 1]}, 2023</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-6">
                  View Full Calendar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Engagement Rate</p>
                      <p className="text-sm font-medium">4.8%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Response Rate</p>
                      <p className="text-sm font-medium">92%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">On-time Delivery</p>
                      <p className="text-sm font-medium">98%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Top Performing Content</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-14 h-14 rounded bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
                        <img 
                          src={`https://picsum.photos/id/${i + 10}/100/100`} 
                          alt="Content thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{
                          i === 1 ? 'Summer Fashion Haul' :
                          i === 2 ? 'Morning Routine' :
                          'Travel Vlog: Paris'
                        }</p>
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span>Likes: {i * 5}K</span>
                          <span>Comments: {i * 800}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">New Opportunities</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b pb-3 last:border-0 last:pb-0">
                      <p className="font-medium text-sm">{
                        i === 1 ? 'Fitness Brand Partnership' :
                        i === 2 ? 'Food Delivery Campaign' :
                        'Travel Agency Collaboration'
                      }</p>
                      <p className="text-xs text-gray-500 mb-2">{
                        i === 1 ? 'Looking for fitness influencers' :
                        i === 2 ? 'Promote our new app features' :
                        'Content creators for summer destinations'
                      }</p>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
