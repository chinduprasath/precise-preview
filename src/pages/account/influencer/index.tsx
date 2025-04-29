
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define a simplified influencer type to avoid deep type instantiation
interface SimpleInfluencer {
  id: string;
  user_id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  country?: { id: number; name: string };
  state?: { id: number; name: string };
  city?: { id: number; name: string };
  niche?: { id: number; name: string };
  [key: string]: any;
}

const InfluencerProfilePage = () => {
  const navigate = useNavigate();
  const [influencer, setInfluencer] = React.useState<SimpleInfluencer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        
        if (!session) {
          navigate('/signin');
          return;
        }

        const userType = localStorage.getItem('userType');
        if (userType && userType !== 'influencer') {
          navigate('/account/business');
          return;
        }

        const { data, error } = await supabase
          .from('influencers')
          .select('*, country:countries(*), state:states(*), city:cities(*), niche:niches(*)')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        
        setInfluencer(data as SimpleInfluencer);
      } catch (error) {
        console.error('Error:', error);
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
