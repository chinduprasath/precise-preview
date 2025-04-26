
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { Influencer, Country, State, City, Niche } from '@/types/location';
import { toast } from '@/components/ui/use-toast';

// Define simplified interface for database data
interface RawInfluencerData {
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

      // Get user type from local storage
      const userType = localStorage.getItem('userType');
      
      if (userType && userType !== 'influencer') {
        navigate('/account/business');
        return;
      }

      setUser(session.user);
      
      try {
        // Use explicit typing and avoid inference issues
        const { data, error } = await supabase
          .from('influencers')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching influencer data:', error);
          toast({
            title: "Error",
            description: "Could not load your profile data",
            variant: "destructive"
          });
        } else if (data) {
          // Use explicit type assertion to avoid deep inference
          const rawData = data as RawInfluencerData;
          
          // Create a base influencer object with explicit properties
          const baseInfluencer: Partial<Influencer> = {
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
          };
          
          // Fetch related entities separately with explicit typing
          
          // Get country data if available
          if (baseInfluencer.country_id) {
            const { data: countryData } = await supabase
              .from('countries')
              .select('*')
              .eq('id', baseInfluencer.country_id)
              .single();
              
            if (countryData) {
              baseInfluencer.country = countryData as Country;
            }
          }
          
          // Get state data if available
          if (baseInfluencer.state_id) {
            const { data: stateData } = await supabase
              .from('states')
              .select('*')
              .eq('id', baseInfluencer.state_id)
              .single();
              
            if (stateData) {
              baseInfluencer.state = stateData as State;
            }
          }
          
          // Get city data if available
          if (baseInfluencer.city_id) {
            const { data: cityData } = await supabase
              .from('cities')
              .select('*')
              .eq('id', baseInfluencer.city_id)
              .single();
              
            if (cityData) {
              baseInfluencer.city = cityData as City;
            }
          }
          
          // Get niche data if available
          if (baseInfluencer.niche_id) {
            const { data: nicheData } = await supabase
              .from('niches')
              .select('*')
              .eq('id', baseInfluencer.niche_id)
              .single();
              
            if (nicheData) {
              baseInfluencer.niche = nicheData as Niche;
            }
          }
          
          // Cast the complete object to Influencer type
          setInfluencer(baseInfluencer as Influencer);
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
