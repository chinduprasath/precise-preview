
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
        
        // Start with a simplified influencer object
        let fullInfluencer: Partial<Influencer> = {
          id: influencerData.id,
          name: influencerData.name,
          username: influencerData.username,
          bio: influencerData.bio,
          country_id: influencerData.country_id,
          state_id: influencerData.state_id,
          city_id: influencerData.city_id,
          niche_id: influencerData.niche_id,
          followers_instagram: influencerData.followers_instagram,
          followers_facebook: influencerData.followers_facebook,
          followers_twitter: influencerData.followers_twitter,
          followers_youtube: influencerData.followers_youtube,
          engagement_rate: influencerData.engagement_rate,
          image_url: influencerData.image_url,
          created_at: influencerData.created_at,
          updated_at: influencerData.updated_at
        };
        
        // Fetch country data if available
        if (fullInfluencer.country_id) {
          const { data: countryData } = await supabase
            .from('countries')
            .select('*')
            .eq('id', fullInfluencer.country_id)
            .single();
            
          if (countryData) {
            fullInfluencer.country = countryData as Country;
          }
        }
        
        // Fetch state data if available
        if (fullInfluencer.state_id) {
          const { data: stateData } = await supabase
            .from('states')
            .select('*')
            .eq('id', fullInfluencer.state_id)
            .single();
            
          if (stateData) {
            fullInfluencer.state = stateData as State;
          }
        }
        
        // Fetch city data if available
        if (fullInfluencer.city_id) {
          const { data: cityData } = await supabase
            .from('cities')
            .select('*')
            .eq('id', fullInfluencer.city_id)
            .single();
            
          if (cityData) {
            fullInfluencer.city = cityData as City;
          }
        }
        
        // Fetch niche data if available
        if (fullInfluencer.niche_id) {
          const { data: nicheData } = await supabase
            .from('niches')
            .select('*')
            .eq('id', fullInfluencer.niche_id)
            .single();
            
          if (nicheData) {
            fullInfluencer.niche = nicheData as Niche;
          }
        }
        
        // Set the influencer state with final cast
        setInfluencer(fullInfluencer as Influencer);
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
