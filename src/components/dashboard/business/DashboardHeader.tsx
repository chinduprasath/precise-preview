
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
        <p className="text-muted-foreground">Manage your influencer marketing campaigns</p>
      </div>
      <Button className="md:w-auto w-full" onClick={() => navigate('/influencers')}>
        <Plus className="mr-2 h-4 w-4" /> Find Influencers
      </Button>
    </div>
  );
};

export default DashboardHeader;
