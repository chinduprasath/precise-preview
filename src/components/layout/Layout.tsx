import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ConditionalHeader from './ConditionalHeader';
import { useTheme } from '@/components/theme-provider';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const location = useLocation();
  const [userType, setUserType] = useState<string | null>(null);
  
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);
  }, []);

  // Check if the current route is a business route
  const isBusinessRoute = userType === 'business';
  
  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ConditionalHeader />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
