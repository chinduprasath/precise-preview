
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

        const { data: influencerData, error } = await supabase
          .from('influencers')
          .select(`
            id, name, username, bio, 
            country:countries(id, name, code), 
            state:states(id, name), 
            city:cities(id, name), 
            niche:niches(id, name),
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
        
        if (influencerData) {
          setInfluencer(influencerData as Influencer);
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
