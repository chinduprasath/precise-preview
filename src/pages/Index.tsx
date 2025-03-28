
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    // Check if user is authenticated with Supabase
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session && userType) {
        // If user is authenticated, redirect to appropriate dashboard
        navigate(`/dashboard/${userType}`);
      } else {
        // If user is not authenticated, redirect to landing page
        localStorage.removeItem('userType'); // Ensure userType is cleared if no session
        navigate('/landing');
      }
    };
    
    checkAuth();
  }, [userType, navigate]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </Layout>
  );
};

export default Index;
