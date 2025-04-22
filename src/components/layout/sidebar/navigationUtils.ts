
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
  UserPlus,
  Wallet,
  Activity,
  Shield,
  Settings
} from 'lucide-react';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export const createNavigationItems = (userType: string): NavItem[] => {
  const dashboardPath = `/dashboard/${userType}`;
  
  // Create navigation items based on user type
  if (userType === 'admin') {
    return [
      {
        icon: React.createElement(LayoutDashboard, { className: "w-full h-full" }),
        label: "Dashboard",
        href: dashboardPath
      },
      {
        icon: React.createElement(Activity, { className: "w-full h-full" }),
        label: "Analytics",
        href: "/dashboard/admin/analytics"
      },
      {
        icon: React.createElement(Shield, { className: "w-full h-full" }),
        label: "Team Management",
        href: "/dashboard/admin/team"
      },
      {
        icon: React.createElement(Settings, { className: "w-full h-full" }),
        label: "Site Settings",
        href: "/dashboard/admin/settings"
      },
      {
        icon: React.createElement(UserPlus, { className: "w-full h-full" }),
        label: "Onboard",
        href: "/onboard"
      }
    ];
  }
  
  // For non-admin users, return the common navigation items
  const commonNavItems = [
    {
      icon: React.createElement(LayoutDashboard, { className: "w-full h-full" }),
      label: "Dashboard",
      href: dashboardPath
    },
    {
      icon: React.createElement(Users, { className: "w-full h-full" }),
      label: "Influencers",
      href: "/influencers"
    },
    {
      icon: React.createElement(MessageSquare, { className: "w-full h-full" }),
      label: "Chats",
      href: "/chats"
    },
    {
      icon: React.createElement(BarChart, { className: "w-full h-full" }),
      label: "Reach",
      href: "/reach"
    },
    {
      icon: React.createElement(LayoutGrid, { className: "w-full h-full" }),
      label: "Services",
      href: "/services"
    },
    {
      icon: React.createElement(FileSpreadsheet, { className: "w-full h-full" }),
      label: "Reports",
      href: "/reports"
    },
    {
      icon: React.createElement(ShoppingCart, { className: "w-full h-full" }),
      label: "Orders",
      href: "/orders"
    },
    {
      icon: React.createElement(Wallet, { className: "w-full h-full" }),
      label: "Payments",
      href: userType === 'business' ? '/payments-business' : 
            userType === 'influencer' ? '/payments-influencer' : '/payments'
    },
    {
      icon: React.createElement(FileSpreadsheet, { className: "w-full h-full" }),
      label: "Billing",
      href: "/billing"
    }
  ];
  
  let navItems = [...commonNavItems];
  
  // Add Requests link only for influencers
  if (userType === 'influencer') {
    const ordersIndex = navItems.findIndex(item => item.label === "Orders");
    if (ordersIndex !== -1) {
      navItems.splice(ordersIndex, 0, {
        icon: React.createElement(FileText, { className: "w-full h-full" }),
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
