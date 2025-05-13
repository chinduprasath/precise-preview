import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Pencil, CheckCircle, AlertTriangle } from 'lucide-react';

interface SimpleInfluencer {
  id: string;
  name: string;
  bio: string;
  image_url: string;
  username: string;
  user_id: string;
  email: string;
  followers_instagram: number;
  followers_facebook: number;
  followers_youtube: number;
  followers_twitter: number;
  engagement_rate: number;
  country_id: string | null;
  state_id: string | null;
  city_id: string | null;
  niche_id: string | null;
}

const InfluencerProfile = () => {
  const navigate = useNavigate();
  const [influencer, setInfluencer] = useState<SimpleInfluencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInfluencerData();
  }, []);

  const fetchInfluencerData = async () => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (session && session.session?.user) {
        const { data, error } = await supabase
          .from('influencers')
          .select('*')
          .eq('user_id', session.session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching influencer data:", error);
          setError("Failed to fetch your profile data.");
          setLoading(false);
          return;
        }
        
        if (data) {
          // Create a properly typed influencer object
          const influencerData: SimpleInfluencer = {
            id: data.id || '',
            name: data.name || '',
            bio: data.bio || '',
            image_url: data.image_url || '',
            username: data.username || '',
            user_id: data.user_id || '',
            email: session.session.user.email || '',
            followers_instagram: data.followers_instagram || 0,
            followers_facebook: data.followers_facebook || 0,
            followers_youtube: data.followers_youtube || 0,
            followers_twitter: data.followers_twitter || 0,
            engagement_rate: data.engagement_rate || 0,
            country_id: data.country_id || null,
            state_id: data.state_id || null,
            city_id: data.city_id || null,
            niche_id: data.niche_id || null
          };
          
          setInfluencer(influencerData);
        } else {
          setError("Influencer profile not found. Please complete your profile setup.");
        }
      } else {
        setError("Please sign in to view your profile.");
        navigate('/signin');
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">
            <AlertTriangle className="mr-2 inline-block" />
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  if (!influencer) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted-foreground">
            No profile data found. Please complete your profile setup.
          </p>
          <Button onClick={() => navigate('/account/settings')} className="mt-4">
            <Pencil className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto mt-8 p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold mb-6">Your Influencer Profile</h1>

        {influencer.image_url && (
          <div className="mb-4">
            <img
              src={influencer.image_url}
              alt={influencer.name}
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          </div>
        )}

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Name:</strong>
          <span>{influencer.name}</span>
        </div>

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Username:</strong>
          <span>{influencer.username}</span>
        </div>

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Email:</strong>
          <span>{influencer.email}</span>
        </div>

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Bio:</strong>
          <span>{influencer.bio}</span>
        </div>

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Instagram Followers:</strong>
          <span>{influencer.followers_instagram}</span>
        </div>

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Facebook Followers:</strong>
          <span>{influencer.followers_facebook}</span>
        </div>

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">YouTube Followers:</strong>
          <span>{influencer.followers_youtube}</span>
        </div>

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Twitter Followers:</strong>
          <span>{influencer.followers_twitter}</span>
        </div>

        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Engagement Rate:</strong>
          <span>{influencer.engagement_rate}</span>
        </div>

        <Button onClick={() => navigate('/account/settings')}>
          <Pencil className="mr-2" />
          Edit Profile
        </Button>
      </div>
    </Layout>
  );
};

export default InfluencerProfile;
