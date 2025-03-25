
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart, 
  LayoutGrid, 
  FileSpreadsheet, 
  FileText, 
  ShoppingCart,
  UserPlus 
} from 'lucide-react';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export const createNavigationItems = (userType: string): NavItem[] => {
  const dashboardPath = `/dashboard/${userType}`;
  
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

  return navItems;
};

// Helper to determine if a navigation item is active
export const isActiveLink = (currentPath: string, href: string, dashboardPath: string): boolean => {
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
