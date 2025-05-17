
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define simplified type for the influencer without deep nesting
interface SimpleInfluencer {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  image_url?: string;
  username?: string;
  email?: string;
  user_id?: string;
  followers_instagram?: number;
  followers_facebook?: number;
  followers_youtube?: number;
  followers_twitter?: number;
  engagement_rate?: number;
  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;
  niche_id?: number | null;
  country_name?: string;
  state_name?: string;
  city_name?: string;
  niche_name?: string;
}

const InfluencerProfilePage = () => {
  const navigate = useNavigate();
  const [influencer, setInfluencer] = React.useState<SimpleInfluencer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        
        if (!session) {
          navigate('/signin');
          return;
        }

        const userType = localStorage.getItem('userType');
        if (userType && userType !== 'influencer') {
          navigate('/account/business');
          return;
        }

        // Simplified query to avoid deep nesting issues
        const { data, error } = await supabase
          .from('influencers')
          .select(`
            id, name, bio, image_url, username, user_id, 
            followers_instagram, followers_facebook, followers_youtube, followers_twitter,
            engagement_rate, country_id, state_id, city_id, niche_id
          `)
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Database error:', error);
          
          // For demonstration purposes, provide mock data if no record found
          const mockInfluencer: SimpleInfluencer = {
            id: 'mock-id',
            name: 'Demo Influencer',
            username: '@demoinfluencer',
            email: session.user.email || '',
            user_id: session.user.id,
            bio: 'This is a demo influencer profile',
            image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
            followers_instagram: 150000,
            followers_facebook: 75000,
            followers_youtube: 250000,
            followers_twitter: 100000,
            engagement_rate: 4.5
          };
          
          setInfluencer(mockInfluencer);
          toast({
            title: "Demo Mode",
            description: "Using demo data as no profile was found",
            variant: "default"
          });
          return;
        }
        
        // Add email from session
        if (data) {
          // Explicitly cast country_id, state_id, city_id, and niche_id to ensure TypeScript compatibility
          const influencerData: SimpleInfluencer = {
            id: data.id,
            name: data.name,
            bio: data.bio,
            image_url: data.image_url,
            username: data.username,
            user_id: data.user_id,
            email: session.user.email || '',
            followers_instagram: data.followers_instagram,
            followers_facebook: data.followers_facebook,
            followers_youtube: data.followers_youtube,
            followers_twitter: data.followers_twitter,
            engagement_rate: data.engagement_rate,
            country_id: data.country_id,
            state_id: data.state_id,
            city_id: data.city_id,
            niche_id: data.niche_id,
            // Ensure these are strings in the interface, but null/undefined initially
            country_name: undefined,
            state_name: undefined,
            city_name: undefined,
            niche_name: undefined
          };
          
          setInfluencer(influencerData);
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading your profile",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate, toast]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <InfluencerProfile influencer={influencer} />
    </Layout>
  );
};

export default InfluencerProfilePage;
