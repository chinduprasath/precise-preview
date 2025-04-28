
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
      try {
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

        // Fixed: Avoid deep type instantiation by using explicit type casting
        const { data, error } = await supabase
          .from('influencers')
          .select(`
            id, name, username, bio, 
            country_id, state_id, city_id, niche_id,
            followers_instagram,
            followers_facebook,
            followers_twitter,
            followers_youtube,
            engagement_rate,
            image_url,
            created_at,
            updated_at
          `)
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          // If needed, fetch related data separately
          const countryPromise = data.country_id ? supabase
            .from('countries')
            .select('id, name, code')
            .eq('id', data.country_id)
            .single() : Promise.resolve({ data: null, error: null });
            
          const statePromise = data.state_id ? supabase
            .from('states')
            .select('id, name')
            .eq('id', data.state_id)
            .single() : Promise.resolve({ data: null, error: null });
            
          const cityPromise = data.city_id ? supabase
            .from('cities')
            .select('id, name')
            .eq('id', data.city_id)
            .single() : Promise.resolve({ data: null, error: null });
            
          const nichePromise = data.niche_id ? supabase
            .from('niches')
            .select('id, name')
            .eq('id', data.niche_id)
            .single() : Promise.resolve({ data: null, error: null });
            
          const [countryResult, stateResult, cityResult, nicheResult] = await Promise.all([
            countryPromise, statePromise, cityPromise, nichePromise
          ]);
          
          const influencerData: Influencer = {
            ...data,
            country: countryResult.data,
            state: stateResult.data,
            city: cityResult.data,
            niche: nicheResult.data
          };
          
          setInfluencer(influencerData);
        }
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
