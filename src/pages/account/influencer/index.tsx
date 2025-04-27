
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
        const { data: influencerData, error: influencerError } = await supabase
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
        
        if (!influencerData) {
          console.error('No influencer data found');
          setLoading(false);
          return;
        }

        // Initialize the influencer object with explicit types to avoid deep type inference
        const influencerObj = {
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
          country: null as Country | null,
          state: null as State | null,
          city: null as City | null,
          niche: null as Niche | null
        } as Influencer;
        
        // Fetch and assign related entities separately
        if (influencerObj.country_id) {
          const { data: countryData } = await supabase
            .from('countries')
            .select('*')
            .eq('id', influencerObj.country_id)
            .single();
            
          if (countryData) {
            influencerObj.country = countryData as Country;
          }
        }
        
        if (influencerObj.state_id) {
          const { data: stateData } = await supabase
            .from('states')
            .select('*')
            .eq('id', influencerObj.state_id)
            .single();
            
          if (stateData) {
            influencerObj.state = stateData as State;
          }
        }
        
        if (influencerObj.city_id) {
          const { data: cityData } = await supabase
            .from('cities')
            .select('*')
            .eq('id', influencerObj.city_id)
            .single();
            
          if (cityData) {
            influencerObj.city = cityData as City;
          }
        }
        
        if (influencerObj.niche_id) {
          const { data: nicheData } = await supabase
            .from('niches')
            .select('*')
            .eq('id', influencerObj.niche_id)
            .single();
            
          if (nicheData) {
            influencerObj.niche = nicheData as Niche;
          }
        }
        
        // Set the influencer state
        setInfluencer(influencerObj);
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
