
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart, 
  LayoutGrid, 
  FileSpreadsheet, 
  FileText, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  UserPlus 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

const NavItem = ({
  icon,
  label,
  href,
  isActive,
  isCollapsed
}: NavItemProps) => {
  return <Link to={href} className={cn("flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-300 group", isCollapsed ? "justify-center px-2 py-3" : "px-3 py-3", isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-secondary")}>
      <div className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-gray-700")}>
        {icon}
      </div>
      {!isCollapsed && <span>{label}</span>}
    </Link>;
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  
  // Create an array to hold navigation items common to all user types
  const commonNavItems = [
    {
      icon: <LayoutDashboard className="w-full h-full" />,
      label: "Dashboard",
      href: dashboardPath
    },
    {
      icon: <Users className="w-full h-full" />,
      label: "Influencers",
      href: "/influencers"
    },
    {
      icon: <MessageSquare className="w-full h-full" />,
      label: "Chats",
      href: "/chats"
    },
    {
      icon: <BarChart className="w-full h-full" />,
      label: "Reach",
      href: "/reach"
    },
    {
      icon: <LayoutGrid className="w-full h-full" />,
      label: "Services",
      href: "/services"
    },
    {
      icon: <FileSpreadsheet className="w-full h-full" />,
      label: "Reports",
      href: "/reports"
    },
    {
      icon: <ShoppingCart className="w-full h-full" />,
      label: "Orders",
      href: "/orders"
    },
    {
      icon: <FileSpreadsheet className="w-full h-full" />,
      label: "Billing",
      href: "/billing"
    }
  ];
  
  // Create the complete navItems array based on user type
  let navItems = [...commonNavItems];
  
  // Add Onboard menu item only for admin users (at position 1, after Dashboard)
  if (userType === 'admin') {
    navItems.splice(1, 0, {
      icon: <UserPlus className="w-full h-full" />,
      label: "Onboard",
      href: "/onboard"
    });
  }
  
  // Add Requests link only for influencers (before Orders)
  if (userType === 'influencer') {
    // Find the index of Orders to insert Requests right before it
    const ordersIndex = navItems.findIndex(item => item.label === "Orders");
    if (ordersIndex !== -1) {
      navItems.splice(ordersIndex, 0, {
        icon: <FileText className="w-full h-full" />,
        label: "Requests",
        href: "/requests"
      });
    }
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  // Improved function to check if a navigation item is active
  const isActiveLink = (href: string) => {
    // Check exact match first
    if (currentPath === href) {
      return true;
    }
    
    // Special handling for dashboard path
    if (href === dashboardPath && (currentPath === '/' || currentPath === dashboardPath)) {
      return true;
    }
    
    // For other paths, check if current path starts with the href
    // But make sure it's not just a partial string match (e.g., "/on" matching "/onboard")
    if (href !== '/' && href !== dashboardPath) {
      return currentPath.startsWith(href + '/') || currentPath === href;
    }
    
    return false;
  };

  return <aside className={cn("flex flex-col border-r bg-white transition-all duration-300 h-screen", isCollapsed ? "w-16" : "w-60")}>
      <div className={cn("p-4 flex justify-between items-center", isCollapsed && "justify-center")}>
        {!isCollapsed && <Link to={dashboardPath} className="text-primary font-bold text-2xl">
            <span className="text-primary">Influence</span>
            <span className="text-gray-800">Connect</span>
          </Link>}
        
        <button onClick={toggleSidebar} className={cn("flex items-center justify-center w-6 h-6 rounded-full text-gray-500 hover:bg-gray-100 transition-all duration-300", isCollapsed && "mx-auto")} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map(item => <NavItem 
          key={item.href} 
          icon={item.icon} 
          label={item.label} 
          href={item.href} 
          isActive={isActiveLink(item.href)} 
          isCollapsed={isCollapsed} 
        />)}
      </nav>
      
      <div className="border-t">
        <div className={cn("p-3", isCollapsed && "flex justify-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn("flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 w-full", isCollapsed && "justify-center")}>
                <User size={16} className="text-gray-700" />
                {!isCollapsed && (
                  <>
                    <span>Account</span>
                    <ChevronDown size={14} className="ml-auto" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={profilePath} className="flex items-center gap-2 cursor-pointer">
                  <User size={14} />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings size={14} />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-700">
                <LogOut size={14} />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className={cn("p-4 border-t", isCollapsed && "hidden")}>
        <div className="flex gap-4 items-center justify-between">
          <button className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium transition-all duration-300 hover:bg-gray-50">
            Light Mode
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium transition-all duration-300 hover:bg-gray-700">
            Dark Mode
          </button>
        </div>
      </div>
    </aside>;
};

export default Sidebar;
