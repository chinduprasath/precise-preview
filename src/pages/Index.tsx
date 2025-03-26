
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const Index = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    // If user is authenticated, redirect to appropriate dashboard
    if (userType) {
      navigate(`/dashboard/${userType}`);
    }
    // If user is not authenticated, redirect to signin page
    else {
      navigate('/signin');
    }
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
