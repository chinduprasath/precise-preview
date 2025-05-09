import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, Users, UserPlus, Gift, Wallet, User, Ticket, FileText } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import MetricCard from '@/components/dashboard/MetricCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const AdminDashboard = () => {
  // Sample data for recent business users
  const recentBusinessUsers = [{
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acmecorp.com',
    joinedDate: 'May 7, 2025',
    status: 'active'
  }, {
    id: '2',
    name: 'Global Enterprises',
    email: 'info@global-ent.com',
    joinedDate: 'May 6, 2025',
    status: 'active'
  }, {
    id: '3',
    name: 'Strategic Solutions',
    email: 'hello@strategic.io',
    joinedDate: 'May 5, 2025',
    status: 'pending'
  }, {
    id: '4',
    name: 'InnoTech Labs',
    email: 'support@innotech.co',
    joinedDate: 'May 4, 2025',
    status: 'inactive'
  }, {
    id: '5',
    name: 'Vision Media',
    email: 'admin@visionmedia.com',
    joinedDate: 'May 3, 2025',
    status: 'active'
  }];
  return <div className="flex h-screen bg-gray-50 dark:bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              
            </div>
            
            {/* Platform Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard title="Total Influencers" value="1,245" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30">
                <Users className="h-8 w-8 text-blue-500 dark:text-blue-400 opacity-80" />
              </MetricCard>
              
              <MetricCard title="Business Users" value="873" className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30">
                <User className="h-8 w-8 text-purple-500 dark:text-purple-400 opacity-80" />
              </MetricCard>
              
              <MetricCard title="Team Members" value="14" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30">
                <Users className="h-8 w-8 text-green-500 dark:text-green-400 opacity-80" />
              </MetricCard>
              
              <MetricCard title="Active Support Tickets" value="32" className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800/30">
                <Ticket className="h-8 w-8 text-yellow-500 dark:text-yellow-400 opacity-80" />
              </MetricCard>
              
              <MetricCard title="Total Campaigns" value="326" className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-800/30">
                <FileText className="h-8 w-8 text-pink-500 dark:text-pink-400 opacity-80" />
              </MetricCard>
              
              <MetricCard title="Total Transactions" value="2,143" className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800/30">
                <Wallet className="h-8 w-8 text-indigo-500 dark:text-indigo-400 opacity-80" />
              </MetricCard>
              
              <MetricCard title="Pending Withdrawals" value="12" className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800/30">
                <Wallet className="h-8 w-8 text-red-500 dark:text-red-400 opacity-80" />
              </MetricCard>
            </div>
            
            {/* Recent Business Users Table */}
            <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Recent Business Users</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/admin/business-users">
                    View All
                  </Link>
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBusinessUsers.map(user => <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/10">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.joinedDate}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            
          </div>
        </main>
      </div>
    </div>;
};
export default AdminDashboard;