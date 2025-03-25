
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
  
  const navItems = [{
    icon: <LayoutDashboard className="w-full h-full" />,
    label: "Dashboard",
    href: dashboardPath
  }];
  
  // Add Onboard menu item only for admin users
  if (userType === 'admin') {
    navItems.push({
      icon: <UserPlus className="w-full h-full" />,
      label: "Onboard",
      href: "/onboard"
    });
  }
  
  // Add common menu items
  navItems.push(
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
    }
  );

  // Only show Requests link for influencers
  if (userType === 'influencer') {
    navItems.push({
      icon: <FileText className="w-full h-full" />,
      label: "Requests",
      href: "/requests"
    });
  }

  // Add these items for all user types
  navItems.push(
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
  );

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
          isActive={
            /* Update active item logic to work correctly for single-level paths */
            (item.href === dashboardPath && (currentPath === dashboardPath || currentPath === '/')) || 
            (item.href !== dashboardPath && currentPath === item.href)
          } 
          isCollapsed={isCollapsed} 
        />)}
      </nav>
      
      <div className="border-t">
        
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
