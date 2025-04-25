
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, Users, UserPlus, Gift, Wallet } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/dashboard/admin/business-users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Business Users
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/dashboard/admin/influencers">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Manage Influencers
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/dashboard/admin/marketing">
                    <Gift className="mr-2 h-4 w-4" />
                    Marketing
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/dashboard/admin/wallet-settings">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet Settings
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search influencers..."
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Filter</Button>
                  <Button variant="outline">Export</Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Followers</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Influencer {i}</td>
                        <td className="py-3 px-4">{['Fashion', 'Beauty', 'Fitness', 'Tech', 'Food'][i - 1]}</td>
                        <td className="py-3 px-4">{Math.floor(Math.random() * 1000000)}K</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                            i % 3 === 1 ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">Showing 1-5 of 100 influencers</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Platform Statistics</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Influencers</p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Businesses</p>
                    <p className="text-2xl font-bold">873</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Campaigns</p>
                    <p className="text-2xl font-bold">326</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                      <div>
                        <p className="text-sm">{
                          i === 1 ? 'New influencer registered' :
                          i === 2 ? 'Campaign approved' :
                          i === 3 ? 'New business user joined' :
                          'Payment processed'
                        }</p>
                        <p className="text-xs text-gray-500">
                          {`${i}h ago`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                  <span>Wallet Activity</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/admin/wallet-transactions">
                      View All
                    </Link>
                  </Button>
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <p className="text-2xl font-bold">2,143</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Withdrawals</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/dashboard/admin/wallet-transactions">
                        <Wallet className="mr-2 h-4 w-4" />
                        Manage Transactions
                      </Link>
                    </Button>
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

export default AdminDashboard;
