
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const InfluencersPage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Influencers</h1>
            </div>
            <Button>Add New Influencer</Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-lg text-center py-16 text-gray-500">
                Influencers page content will be displayed here.
                <br />
                This is a placeholder for the influencers page.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default InfluencersPage;
