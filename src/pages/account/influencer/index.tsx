
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { Influencer } from '@/types/location';
import { toast } from '@/components/ui/use-toast';

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

      // Get user type from local storage
      const userType = localStorage.getItem('userType');
      
      if (userType && userType !== 'influencer') {
        navigate('/account/business');
        return;
      }

      setUser(session.user);
      
      try {
        // Fetch influencer data with all related entities in a single query
        const { data: influencerData, error } = await supabase
          .from('influencers')
          .select(`
            *,
            country:countries(*),
            state:states(*),
            city:cities(*),
            niche:niches(*)
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
        
        if (!influencerData) {
          console.error('No influencer data found');
          setLoading(false);
          return;
        }
        
        // Transform the data to match our Influencer type
        // This avoids the deep type inference issue
        setInfluencer({
          id: influencerData.id,
          name: influencerData.name,
          username: influencerData.username || null,
          bio: influencerData.bio || null,
          country_id: influencerData.country_id || null,
          state_id: influencerData.state_id || null,
          city_id: influencerData.city_id || null,
          niche_id: influencerData.niche_id || null,
          followers_instagram: influencerData.followers_instagram,
          followers_facebook: influencerData.followers_facebook,
          followers_twitter: influencerData.followers_twitter,
          followers_youtube: influencerData.followers_youtube,
          engagement_rate: influencerData.engagement_rate,
          image_url: influencerData.image_url || null,
          created_at: influencerData.created_at,
          updated_at: influencerData.updated_at,
          country: influencerData.country || null,
          state: influencerData.state || null,
          city: influencerData.city || null,
          niche: influencerData.niche || null
        });
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
