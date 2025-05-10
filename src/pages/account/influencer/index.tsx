import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define simplified type for country/state/city objects
type NamedEntity = {
  id: number | string;
  name: string;
};

// Define simplified type for the influencer with mandatory fields only
type SimpleInfluencer = {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  image_url?: string;
  username?: string;
  email?: string;
  user_id?: string;
  followers_instagram?: number;
  followers_facebook?: number;
  followers_youtube?: number;
  followers_twitter?: number;
  engagement_rate?: number;
  country?: NamedEntity;
  state?: NamedEntity;
  city?: NamedEntity;
  niche?: NamedEntity;
};

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

        if (error) {
          console.error('Database error:', error);
          
          // For demonstration purposes, provide mock data if no record found
          const mockInfluencer: SimpleInfluencer = {
            id: 'mock-id',
            name: 'Demo Influencer',
            username: '@demoinfluencer',
            email: session.user.email,
            user_id: session.user.id,
            bio: 'This is a demo influencer profile',
            image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
            followers_instagram: 150000,
            followers_facebook: 75000,
            followers_youtube: 250000,
            followers_twitter: 100000,
            engagement_rate: 4.5
          };
          
          setInfluencer(mockInfluencer);
          toast({
            title: "Demo Mode",
            description: "Using demo data as no profile was found",
            variant: "default"
          });
          return;
        }
        
        // Add email from session and ensure user_id is included
        const influencerData = {
          ...data,
          email: session.user.email,
          user_id: session.user.id
        };
        
        setInfluencer(influencerData);
      } catch (error: any) {
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
  }, [navigate, toast]);

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
