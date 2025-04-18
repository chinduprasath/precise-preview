
import React from 'react';
import SearchBar from './header/SearchBar';
import NotificationBell from './header/NotificationBell';
import UserProfileMenu from './header/UserProfileMenu';
import { useHeaderData } from '@/hooks/useHeaderData';
import { useTheme } from '@/components/theme-provider';

const Header = () => {
  const { userData, notificationCount } = useHeaderData();
  const { resolvedTheme } = useTheme();

  return (
    <header className={`h-16 border-b border-border px-6 flex items-center justify-between ${
      resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <SearchBar />
      <div className="flex items-center gap-4">
        <NotificationBell count={notificationCount} />
        <UserProfileMenu userData={userData} />
      </div>
    </header>
  );
};

export default Header;
