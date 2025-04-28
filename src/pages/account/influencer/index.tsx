import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { Influencer } from '@/types/location';
import { toast } from '@/components/ui/use-toast';

interface InfluencerData {
  id: string;
  name: string;
  username: string | null;
  bio: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  niche_id: number | null;
  followers_instagram: number | null;
  followers_facebook: number | null;
  followers_twitter: number | null;
  followers_youtube: number | null;
  engagement_rate: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  country?: { id: number; name: string; code: string | null } | null;
  state?: { id: number; name: string; country_id: number } | null;
  city?: { id: number; name: string; state_id: number } | null;
  niche?: { id: number; name: string } | null;
}

const InfluencerProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [influencer, setInfluencer] = React.useState<Influencer | null>(null);

  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/signin');
        return;
      }

      const userType = localStorage.getItem('userType');
      
      if (userType && userType !== 'influencer') {
        navigate('/account/business');
        return;
      }

      setUser(session.user);
      
      try {
        const { data, error } = await supabase
          .from('influencers')
          .select(`
            id, name, username, bio, country_id, state_id, city_id, niche_id, 
            followers_instagram, followers_facebook, followers_twitter, followers_youtube,
            engagement_rate, image_url, created_at, updated_at,
            country:countries(id, name, code), 
            state:states(id, name, country_id), 
            city:cities(id, name, state_id), 
            niche:niches(id, name)
          `)
          .eq('user_id', session.user.id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setLoading(false);
          return;
        }

        const responseData = data as InfluencerData;
        
        const transformedInfluencer: Influencer = {
          id: responseData.id,
          name: responseData.name,
          username: responseData.username,
          bio: responseData.bio,
          country_id: responseData.country_id,
          state_id: responseData.state_id,
          city_id: responseData.city_id,
          niche_id: responseData.niche_id,
          followers_instagram: responseData.followers_instagram || 0,
          followers_facebook: responseData.followers_facebook || 0,
          followers_twitter: responseData.followers_twitter || 0,
          followers_youtube: responseData.followers_youtube || 0,
          engagement_rate: responseData.engagement_rate || 0,
          image_url: responseData.image_url,
          created_at: responseData.created_at,
          updated_at: responseData.updated_at,
          country: responseData.country,
          state: responseData.state,
          city: responseData.city,
          niche: responseData.niche
        };

        setInfluencer(transformedInfluencer);
      } catch (error) {
        console.error('Exception fetching influencer data:', error);
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
