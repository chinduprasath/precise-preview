
import React, { useState, useEffect } from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import SalesSummaryCard from '@/components/dashboard/SalesSummaryCard';
import ProductsList from '@/components/dashboard/ProductsList';
import CustomerFulfillment from '@/components/dashboard/CustomerFulfillment';
import VisitorInsights from '@/components/dashboard/VisitorInsights';
import EarningsCard from '@/components/dashboard/EarningsCard';
import LevelChart from '@/components/dashboard/LevelChart';
import Layout from '@/components/layout/Layout';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error loading dashboard</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Today's Campaigns" 
          value="₹567,402" 
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
          value="₹567,402" 
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
          amount="₹6078.76" 
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
    </Layout>
  );
};

export default Index;
