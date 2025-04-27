
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { Influencer } from '@/types/location';
import { toast } from '@/components/ui/use-toast';

// Define a type for the raw Supabase response to avoid deep type inference
interface InfluencerRawResponse {
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
  country: { id: number; name: string; code: string | null } | null;
  state: { id: number; name: string; country_id: number } | null;
  city: { id: number; name: string; state_id: number } | null;
  niche: { id: number; name: string } | null;
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
        // Use a simple query string with explicit typing to avoid deep inference
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
          
        if (error) {
          console.error('Error fetching influencer data:', error);
          toast({
            title: "Error",
            description: "Could not load your profile data",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        if (!data) {
          console.error('No influencer data found');
          setLoading(false);
          return;
        }

        // Transform the data into our Influencer type, using a simple object literal without type inference
        const transformedInfluencer: Influencer = {
          id: data.id,
          name: data.name,
          username: data.username,
          bio: data.bio,
          country_id: data.country_id,
          state_id: data.state_id,
          city_id: data.city_id,
          niche_id: data.niche_id,
          followers_instagram: data.followers_instagram || 0,
          followers_facebook: data.followers_facebook || 0,
          followers_twitter: data.followers_twitter || 0,
          followers_youtube: data.followers_youtube || 0,
          engagement_rate: data.engagement_rate || 0,
          image_url: data.image_url,
          created_at: data.created_at,
          updated_at: data.updated_at,
          country: data.country,
          state: data.state,
          city: data.city,
          niche: data.niche
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
