import React from 'react';
import BusinessOrdersPage from './business';
import InfluencerOrdersPage from './influencer';

const OrdersPage: React.FC = () => {
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : 'business';
  
  if (userType === 'influencer') {
    return <InfluencerOrdersPage />;
  }
  
  return <BusinessOrdersPage />;
};

export default OrdersPage;
