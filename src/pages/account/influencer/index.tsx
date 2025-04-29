
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define a simplified influencer type as a regular interface instead of using deep type instantiation
interface SimpleInfluencer {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  image_url?: string;
  username?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  niche_id?: number;
  followers_instagram?: number;
  followers_facebook?: number;
  followers_youtube?: number;
  followers_twitter?: number;
  engagement_rate?: number;
  country?: { id: number; name: string };
  state?: { id: number; name: string };
  city?: { id: number; name: string };
  niche?: { id: number; name: string };
  [key: string]: any; // Allow any additional properties to avoid TS errors
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

        const { data, error } = await supabase
          .from('influencers')
          .select('*, country:countries(*), state:states(*), city:cities(*), niche:niches(*)')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        
        // Explicitly cast the data to SimpleInfluencer to avoid TS errors
        setInfluencer(data as SimpleInfluencer);
      } catch (error) {
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
  }, [navigate]);

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
