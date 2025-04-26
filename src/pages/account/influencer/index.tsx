
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { Influencer, Country, State, City, Niche } from '@/types/location';
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
        // Get basic influencer data
        const { data, error: influencerError } = await supabase
          .from('influencers')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (influencerError) {
          console.error('Error fetching influencer data:', influencerError);
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

        // Create the influencer object directly with explicit typing
        const influencerData: Influencer = {
          id: data.id,
          name: data.name,
          username: data.username || null,
          bio: data.bio || null,
          country_id: data.country_id || null,
          state_id: data.state_id || null,
          city_id: data.city_id || null,
          niche_id: data.niche_id || null,
          followers_instagram: data.followers_instagram || 0,
          followers_facebook: data.followers_facebook || 0,
          followers_twitter: data.followers_twitter || 0,
          followers_youtube: data.followers_youtube || 0,
          engagement_rate: data.engagement_rate || 0,
          image_url: data.image_url || null,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        
        // Fetch related entities separately
        if (data.country_id) {
          const { data: countryData } = await supabase
            .from('countries')
            .select('*')
            .eq('id', data.country_id)
            .single();
            
          if (countryData) {
            influencerData.country = countryData as Country;
          }
        }
        
        if (data.state_id) {
          const { data: stateData } = await supabase
            .from('states')
            .select('*')
            .eq('id', data.state_id)
            .single();
            
          if (stateData) {
            influencerData.state = stateData as State;
          }
        }
        
        if (data.city_id) {
          const { data: cityData } = await supabase
            .from('cities')
            .select('*')
            .eq('id', data.city_id)
            .single();
            
          if (cityData) {
            influencerData.city = cityData as City;
          }
        }
        
        if (data.niche_id) {
          const { data: nicheData } = await supabase
            .from('niches')
            .select('*')
            .eq('id', data.niche_id)
            .single();
            
          if (nicheData) {
            influencerData.niche = nicheData as Niche;
          }
        }
        
        setInfluencer(influencerData);
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
