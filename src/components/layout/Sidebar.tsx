
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import NavItem from './sidebar/NavItem';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarFooter from './sidebar/SidebarFooter';
import { createNavigationItems, isActiveLink } from './sidebar/navigationUtils';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [userType, setUserType] = useState<string>('business');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebar:collapsed');
    if (savedCollapsedState) {
      setIsCollapsed(savedCollapsedState === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar:collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    // Check for userType in localStorage first
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    } else {
      // If not in localStorage, check Supabase session
      const checkUserType = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.user_metadata?.user_type) {
          const type = session.user.user_metadata.user_type;
          setUserType(type);
          localStorage.setItem('userType', type);
        }
      };
      checkUserType();
    }
  }, []);

  const dashboardPath = `/dashboard/${userType}`;
  const profilePath = `/account/${userType}`;
  
  const navItems = createNavigationItems(userType);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={cn("flex flex-col border-r bg-white transition-all duration-300 h-screen", isCollapsed ? "w-16" : "w-60")}>
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        toggleSidebar={toggleSidebar} 
        dashboardPath={dashboardPath} 
      />
      
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map(item => (
          <NavItem 
            key={item.href} 
            icon={item.icon} 
            label={item.label} 
            href={item.href} 
            isActive={isActiveLink(currentPath, item.href, dashboardPath)} 
            isCollapsed={isCollapsed} 
          />
        ))}
      </nav>
      
      <SidebarFooter 
        isCollapsed={isCollapsed} 
        profilePath={profilePath} 
      />
    </aside>
  );
};

export default Sidebar;
