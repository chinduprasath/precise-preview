
import React from 'react';
import SearchBar from './header/SearchBar';
import NotificationBell from './header/NotificationBell';
import UserProfileMenu from './header/UserProfileMenu';
import { useHeaderData } from '@/hooks/useHeaderData';

const Header = () => {
  const { userData, notificationCount } = useHeaderData();

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <SearchBar />
      <div className="flex items-center gap-4">
        <NotificationBell count={notificationCount} />
        <UserProfileMenu userData={userData} />
      </div>
    </header>
  );
};

export default Header;
