
import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import NavItem from './sidebar/NavItem';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarFooter from './sidebar/SidebarFooter';
import { createNavigationItems, isActiveLink } from './sidebar/navigationUtils';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [userType, setUserType] = useState<string>(() => {
    // Initialize from localStorage on mount to prevent hydration issues
    return localStorage.getItem('userType') || 'business';
  });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const isMobile = useIsMobile();

  // Load the collapsed state only once when component mounts
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebar:collapsed');
    if (savedCollapsedState) {
      setIsCollapsed(savedCollapsedState === 'true');
    }
  }, []);

  // Update localStorage whenever isCollapsed changes
  useEffect(() => {
    localStorage.setItem('sidebar:collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  // Set collapsed state for mobile devices
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  // Load user type from Supabase session only if not already in localStorage
  useEffect(() => {
    if (!localStorage.getItem('userType')) {
      const checkUserType = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.user_metadata?.user_type) {
            const type = session.user.user_metadata.user_type;
            setUserType(type);
            localStorage.setItem('userType', type);
          }
        } catch (error) {
          console.error('Error fetching user type:', error);
        }
      };
      checkUserType();
    }
  }, []);

  const dashboardPath = `/dashboard/${userType}`;
  const profilePath = `/account/${userType}`;
  
  // Memoize navigation items to prevent unnecessary re-renders
  const navItems = React.useMemo(() => createNavigationItems(userType), [userType]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Use a stable function for navigation to prevent unnecessary re-renders
  const handleNavigation = useCallback((href: string) => {
    navigate(href);
  }, [navigate]);

  return (
    <aside className={cn(
      "flex flex-col border-r bg-white transition-all duration-300 h-screen", 
      isCollapsed ? "w-16" : "w-60"
    )}>
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
            onClick={() => handleNavigation(item.href)}
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
