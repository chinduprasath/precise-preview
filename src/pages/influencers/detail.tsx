
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { ServiceType, SocialPlatform } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';

// Sample data for influencers (in a real app, this would come from API)
const sampleInfluencers = [
  {
    id: '1',
    name: 'Alex Johnson',
    category: 'Fashion & Lifestyle',
    bio: 'Fashion blogger sharing the latest trends and style tips for modern professionals.',
    followers: 245000,
    engagementRate: 4.2,
    profileImage: 'https://picsum.photos/id/64/300/300',
    coverImage: 'https://picsum.photos/id/30/1000/300',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    category: 'Beauty & Skincare',
    bio: 'Beauty expert specializing in skincare reviews and makeup tutorials for all skin types.',
    followers: 532000,
    engagementRate: 3.8,
    profileImage: 'https://picsum.photos/id/65/300/300',
    coverImage: 'https://picsum.photos/id/31/1000/300',
  },
  {
    id: '3',
    name: 'Michael Chen',
    category: 'Tech & Gaming',
    bio: 'Tech reviewer covering the latest gadgets, gaming content, and tech industry news.',
    followers: 1200000,
    engagementRate: 5.1,
    profileImage: 'https://picsum.photos/id/91/300/300',
    coverImage: 'https://picsum.photos/id/32/1000/300',
  }
];

const InfluencerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the influencer from our sample data
  const influencer = sampleInfluencers.find(inf => inf.id === id);
  
  if (!influencer) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold">Influencer not found</h1>
              <p className="text-gray-500 mt-2">The influencer you're looking for doesn't exist.</p>
              <button 
                onClick={() => navigate('/influencers')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
              >
                Back to Influencers
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  const handleRequestService = (serviceData: {
    influencerId: string;
    influencerName: string;
    serviceType: ServiceType;
    platform: SocialPlatform;
    description: string;
    price: number;
  }) => {
    // In a real app, this would send the request to the backend
    console.log('Service request submitted:', serviceData);
    
    // In a real implementation, we'd save this to the database
    // For now, we'll just show a toast and save to localStorage
    const requestId = `req-${Date.now()}`;
    const newRequest = {
      id: requestId,
      businessId: 'business-1', // This would be the current user's ID
      businessName: 'Your Business', // This would be the current user's business name
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...serviceData
    };
    
    // Save to localStorage for demo purposes
    const existingRequests = JSON.parse(localStorage.getItem('influencerRequests') || '[]');
    localStorage.setItem('influencerRequests', JSON.stringify([...existingRequests, newRequest]));
    
    toast({
      title: "Request Submitted",
      description: `Your request has been sent to ${influencer.name}. They will review it shortly.`,
    });
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <InfluencerProfile 
            id={influencer.id}
            name={influencer.name}
            category={influencer.category}
            bio={influencer.bio}
            followers={influencer.followers}
            engagementRate={influencer.engagementRate}
            profileImage={influencer.profileImage}
            coverImage={influencer.coverImage}
            onRequestService={handleRequestService}
          />
        </main>
      </div>
    </div>
  );
};

export default InfluencerDetailPage;
