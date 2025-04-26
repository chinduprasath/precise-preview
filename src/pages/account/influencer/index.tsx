
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
        // Completely avoid TypeScript inference by using Record<string, any> for the response
        const response = await supabase
          .from('influencers')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        const { data, error } = response as { data: Record<string, any> | null, error: any };
        
        if (error) {
          console.error('Error fetching influencer data:', error);
        } else if (data) {
          // Create influencer object with explicit typing to avoid type inference issues
          const fullInfluencer: Influencer = {
            id: data.id,
            name: data.name,
            username: data.username,
            bio: data.bio,
            country_id: data.country_id,
            state_id: data.state_id,
            city_id: data.city_id,
            niche_id: data.niche_id,
            followers_instagram: data.followers_instagram,
            followers_facebook: data.followers_facebook,
            followers_twitter: data.followers_twitter,
            followers_youtube: data.followers_youtube,
            engagement_rate: data.engagement_rate,
            image_url: data.image_url,
            created_at: data.created_at,
            updated_at: data.updated_at,
            country: undefined,
            state: undefined,
            city: undefined,
            niche: undefined,
            hashtags: undefined
          };
          
          // Fetch related entities separately using any to avoid type inference issues
          
          // Get country data if available
          if (fullInfluencer.country_id) {
            const countryResponse = await supabase
              .from('countries')
              .select('*')
              .eq('id', fullInfluencer.country_id)
              .single();
              
            const countryData = countryResponse.data as Country | null;
            if (countryData) {
              fullInfluencer.country = countryData;
            }
          }
          
          // Get state data if available
          if (fullInfluencer.state_id) {
            const stateResponse = await supabase
              .from('states')
              .select('*')
              .eq('id', fullInfluencer.state_id)
              .single();
              
            const stateData = stateResponse.data as State | null;
            if (stateData) {
              fullInfluencer.state = stateData;
            }
          }
          
          // Get city data if available
          if (fullInfluencer.city_id) {
            const cityResponse = await supabase
              .from('cities')
              .select('*')
              .eq('id', fullInfluencer.city_id)
              .single();
              
            const cityData = cityResponse.data as City | null;
            if (cityData) {
              fullInfluencer.city = cityData;
            }
          }
          
          // Get niche data if available
          if (fullInfluencer.niche_id) {
            const nicheResponse = await supabase
              .from('niches')
              .select('*')
              .eq('id', fullInfluencer.niche_id)
              .single();
              
            const nicheData = nicheResponse.data as Niche | null;
            if (nicheData) {
              fullInfluencer.niche = nicheData;
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
