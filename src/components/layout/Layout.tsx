import React from 'react';
import Sidebar from './Sidebar';
import ConditionalHeader from './ConditionalHeader';
import { useTheme } from '@/components/theme-provider';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  
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
