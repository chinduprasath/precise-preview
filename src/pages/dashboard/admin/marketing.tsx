import React, { useState } from 'react';
import { Megaphone, BarChart3, RefreshCw, FileText } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PostOfferTab from '@/components/admin/marketing/PostOfferTab';
import MarketingMetricsTab from '@/components/admin/marketing/MarketingMetricsTab';

const MarketingDashboard = () => {
  const [activeTab, setActiveTab] = useState('marketing-metrics');

  const handleRefresh = () => {
    // Trigger refresh in MarketingMetricsTab
    window.dispatchEvent(new CustomEvent('marketing-refresh'));
  };

  const handleExport = () => {
    // Trigger export in MarketingMetricsTab
    window.dispatchEvent(new CustomEvent('marketing-export'));
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-foreground">Marketing Dashboard</h1>
              {activeTab === 'marketing-metrics' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <FileText className="w-4 h-4 mr-2" /> Export
                  </Button>
                </div>
              )}
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 bg-muted">
                <TabsTrigger value="marketing-metrics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Marketing Metrics
                </TabsTrigger>
                <TabsTrigger value="post-offer" className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Post Offer
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="marketing-metrics" className="mt-0">
                <MarketingMetricsTab />
              </TabsContent>
              
              <TabsContent value="post-offer" className="mt-0">
                <PostOfferTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketingDashboard;
