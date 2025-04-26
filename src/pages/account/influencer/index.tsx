
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { Influencer, Country, State, City, Niche } from '@/types/location';

// We'll define a simpler type for raw database data to avoid deep type inference issues
type RawInfluencerData = {
  id: string;
  name: string;
  username: string | null;
  bio: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  niche_id: number | null;
  followers_instagram: number;
  followers_facebook: number;
  followers_twitter: number;
  followers_youtube: number;
  engagement_rate: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

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
        // Use a type assertion for the response data to avoid TypeScript depth issues
        const { data, error } = await supabase
          .from('influencers')
          .select('*')
          .eq('user_id', session.user.id)
          .single() as { data: unknown, error: any };
          
        if (error) {
          console.error('Error fetching influencer data:', error);
        } else if (data) {
          // Cast data to our simple type to avoid complex type inference
          const rawData = data as RawInfluencerData;
          
          // Manually construct the influencer object with explicit types
          const fullInfluencer: Influencer = {
            id: rawData.id,
            name: rawData.name,
            username: rawData.username,
            bio: rawData.bio,
            country_id: rawData.country_id,
            state_id: rawData.state_id,
            city_id: rawData.city_id,
            niche_id: rawData.niche_id,
            followers_instagram: rawData.followers_instagram,
            followers_facebook: rawData.followers_facebook,
            followers_twitter: rawData.followers_twitter,
            followers_youtube: rawData.followers_youtube,
            engagement_rate: rawData.engagement_rate,
            image_url: rawData.image_url,
            created_at: rawData.created_at,
            updated_at: rawData.updated_at,
            country: undefined,
            state: undefined,
            city: undefined,
            niche: undefined,
            hashtags: undefined
          };
          
          // Fetch related entities separately
          
          // Get country data if available
          if (fullInfluencer.country_id) {
            const { data: countryData } = await supabase
              .from('countries')
              .select('*')
              .eq('id', fullInfluencer.country_id)
              .single() as { data: Country | null, error: any };
            
            if (countryData) {
              fullInfluencer.country = countryData as Country;
            }
          }
          
          // Get state data if available
          if (fullInfluencer.state_id) {
            const { data: stateData } = await supabase
              .from('states')
              .select('*')
              .eq('id', fullInfluencer.state_id)
              .single() as { data: State | null, error: any };
              
            if (stateData) {
              fullInfluencer.state = stateData as State;
            }
          }
          
          // Get city data if available
          if (fullInfluencer.city_id) {
            const { data: cityData } = await supabase
              .from('cities')
              .select('*')
              .eq('id', fullInfluencer.city_id)
              .single() as { data: City | null, error: any };
              
            if (cityData) {
              fullInfluencer.city = cityData as City;
            }
          }
          
          // Get niche data if available
          if (fullInfluencer.niche_id) {
            const { data: nicheData } = await supabase
              .from('niches')
              .select('*')
              .eq('id', fullInfluencer.niche_id)
              .single() as { data: Niche | null, error: any };
              
            if (nicheData) {
              fullInfluencer.niche = nicheData as Niche;
            }
          }
          
          setInfluencer(fullInfluencer);
        }
      } catch (error) {
        console.error('Exception fetching influencer data:', error);
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
