
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/dashboard/MetricCard';
import SalesSummaryCard from '@/components/dashboard/SalesSummaryCard';
import ProductsList from '@/components/dashboard/ProductsList';
import CustomerFulfillment from '@/components/dashboard/CustomerFulfillment';
import VisitorInsights from '@/components/dashboard/VisitorInsights';
import EarningsCard from '@/components/dashboard/EarningsCard';
import LevelChart from '@/components/dashboard/LevelChart';

const Index = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricCard 
              title="Today's Campaigns" 
              value="$567,402" 
              valueClassName="text-indigo-600"
            />
            <MetricCard 
              title="Active Campaigns" 
              value="2,208" 
              valueClassName="text-indigo-600"
            />
            <MetricCard 
              title="Total Orders" 
              value="6023" 
              valueClassName="text-indigo-600"
            />
            <MetricCard 
              title="Today's Campaigns" 
              value="$567,402" 
              valueClassName="text-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <SalesSummaryCard title="Today's Campaigns" />
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LevelChart />
                <ProductsList />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <EarningsCard 
              amount="$6078.76" 
              percentChange={48} 
              period="last Month" 
            />
            <div className="lg:col-span-2">
              <VisitorInsights />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerFulfillment />
            <LevelChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
