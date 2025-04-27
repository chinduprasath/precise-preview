
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

      const userType = localStorage.getItem('userType');
      
      if (userType && userType !== 'influencer') {
        navigate('/account/business');
        return;
      }

      setUser(session.user);
      
      try {
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

        // Transform the data into our Influencer type
        const transformedInfluencer: Influencer = {
          id: influencerData.id,
          name: influencerData.name,
          username: influencerData.username,
          bio: influencerData.bio,
          country_id: influencerData.country_id,
          state_id: influencerData.state_id,
          city_id: influencerData.city_id,
          niche_id: influencerData.niche_id,
          followers_instagram: influencerData.followers_instagram || 0,
          followers_facebook: influencerData.followers_facebook || 0,
          followers_twitter: influencerData.followers_twitter || 0,
          followers_youtube: influencerData.followers_youtube || 0,
          engagement_rate: influencerData.engagement_rate || 0,
          image_url: influencerData.image_url,
          created_at: influencerData.created_at,
          updated_at: influencerData.updated_at,
          country: influencerData.country || null,
          state: influencerData.state || null,
          city: influencerData.city || null,
          niche: influencerData.niche || null
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
