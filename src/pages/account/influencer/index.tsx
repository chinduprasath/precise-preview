
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/influencers/InfluencerProfile';
import { supabase } from '@/integrations/supabase/client';

const InfluencerProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Check auth state
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin');
        return;
      }
      const currentUserType = localStorage.getItem('userType');
      if (!currentUserType || currentUserType !== 'influencer') {
        navigate(`/account/${currentUserType || 'business'}`);
        return;
      }
      setUser(session.user);
    };

    checkUser();
  }, [navigate]);

  if (!user) {
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
      <InfluencerProfile
        id={user.id}
        name={user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
        category="Lifestyle"
        bio="Digital content creator and lifestyle influencer"
        followers={1000000}
        engagementRate={4.5}
        profileImage={user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'}
        coverImage="https://via.placeholder.com/1200x400"
        onRequestService={(serviceData) => {
          // Handle service request
          console.log('Service requested:', serviceData);
        }}
      />
    </Layout>
  );
};

export default InfluencerProfilePage;
