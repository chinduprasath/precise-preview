

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Wallet } from 'lucide-react';
import SearchBar from './header/SearchBar';
import NotificationBell from './header/NotificationBell';
import UserProfileMenu from './header/UserProfileMenu';
import { useHeaderData } from '@/hooks/useHeaderData';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const Header = () => {
  const { userData, notificationCount } = useHeaderData();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  const navigateToWallet = () => {
    navigate(`/wallet/${userType}`);
  };

  const navigateToOffers = () => {
    navigate('/offers');
  };

  return (
    <header className="h-16 border-b border-border px-6 flex items-center bg-background">
      <SearchBar />
      <div className="flex-1"></div>
      <div className="flex items-center gap-4 ml-auto">
        {(userType === 'business' || userType === 'influencer') && (
          <>
            <button 
              className="relative cursor-pointer hover:opacity-80 transition-opacity"
              onClick={navigateToOffers}
              title="Offers"
            >
              <Gift className="w-5 h-5 text-primary" />
            </button>
            <button 
              className="relative cursor-pointer hover:opacity-80 transition-opacity"
              onClick={navigateToWallet}
              title="Wallet"
            >
              <Wallet className="w-5 h-5 text-primary" />
            </button>
          </>
        )}
        <NotificationBell count={notificationCount} />
        <UserProfileMenu userData={userData} />
      </div>
    </header>
  );
};

export default Header;

