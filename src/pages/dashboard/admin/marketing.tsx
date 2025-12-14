import React, { useState } from 'react';
import { Megaphone, BarChart3 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostOfferTab from '@/components/admin/marketing/PostOfferTab';
import MarketingMetricsTab from '@/components/admin/marketing/MarketingMetricsTab';

const MarketingDashboard = () => {
  const [activeTab, setActiveTab] = useState('post-offer');

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Marketing Dashboard</h1>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 bg-muted">
                <TabsTrigger value="post-offer" className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Post Offer
                </TabsTrigger>
                <TabsTrigger value="marketing-metrics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Marketing Metrics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="post-offer">
                <PostOfferTab />
              </TabsContent>
              
              <TabsContent value="marketing-metrics">
                <MarketingMetricsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketingDashboard;
