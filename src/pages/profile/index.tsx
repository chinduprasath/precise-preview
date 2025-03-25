
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InfluencerProfile from '@/components/profile/InfluencerProfile';
import UserProfile from '@/components/profile/UserProfile';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch the user type from your backend
    // For this demo, we're using localStorage and URL params
    
    if (userId === 'influencer') {
      setUserType('influencer');
    } else if (userId === 'user') {
      setUserType('user');
    } else {
      // Get from local storage if not specified in URL
      const storedType = localStorage.getItem('userType');
      if (storedType) {
        setUserType(storedType);
      } else {
        // Default to user if not found
        setUserType('user');
      }
    }
  }, [userId]);
  
  if (!userType) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="h-full bg-gray-50">
        {userType === 'influencer' ? <InfluencerProfile /> : <UserProfile />}
      </div>
    </Layout>
  );
};

export default ProfilePage;
