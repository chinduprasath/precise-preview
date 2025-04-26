
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { Influencer } from '@/types/location';

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
        // Using type assertion for the initial influencer data to avoid deep typing
        type BasicInfluencer = Omit<Influencer, 'country' | 'state' | 'city' | 'niche'>;
        
        // First, fetch the basic influencer record
        const { data, error } = await supabase
          .from('influencers')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching influencer data:', error);
        } else if (data) {
          const influencerData = data as BasicInfluencer;
          const fullInfluencer: Influencer = {
            ...influencerData,
            country: undefined,
            state: undefined,
            city: undefined,
            niche: undefined
          };
          
          // Get country data if available
          if (influencerData.country_id) {
            const { data: countryData } = await supabase
              .from('countries')
              .select('*')
              .eq('id', influencerData.country_id)
              .single();
            
            if (countryData) {
              fullInfluencer.country = countryData;
            }
          }
          
          // Get state data if available
          if (influencerData.state_id) {
            const { data: stateData } = await supabase
              .from('states')
              .select('*')
              .eq('id', influencerData.state_id)
              .single();
              
            if (stateData) {
              fullInfluencer.state = stateData;
            }
          }
          
          // Get city data if available
          if (influencerData.city_id) {
            const { data: cityData } = await supabase
              .from('cities')
              .select('*')
              .eq('id', influencerData.city_id)
              .single();
              
            if (cityData) {
              fullInfluencer.city = cityData;
            }
          }
          
          // Get niche data if available
          if (influencerData.niche_id) {
            const { data: nicheData } = await supabase
              .from('niches')
              .select('*')
              .eq('id', influencerData.niche_id)
              .single();
              
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
