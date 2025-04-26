
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ConditionalHeader from './ConditionalHeader';
import { useTheme } from '@/components/theme-provider';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

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

  const isBusinessRoute = userType === 'business';
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-background border-l border-border">
        <ConditionalHeader />
        <main className="flex-1 overflow-y-auto p-4 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
