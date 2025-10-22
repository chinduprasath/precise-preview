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
  Wallet,
  Activity,
  Shield,
  Settings,
  Building,
  User,
  Gift,
  LifeBuoy,
  Inbox,
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
        icon: React.createElement(Building, { className: "w-full h-full" }),
        label: "Business Users",
        href: "/dashboard/admin/business-users"
      },
      {
        icon: React.createElement(User, { className: "w-full h-full" }),
        label: "Influencers",
        href: "/dashboard/admin/influencers"
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
        icon: React.createElement(FileText, { className: "w-full h-full" }),
        label: "Reports",
        href: "/admin/reports"
      },
      {
        icon: React.createElement(LifeBuoy, { className: "w-full h-full" }),
        label: "Support",
        href: "/admin/support"
      },
      {
        icon: React.createElement(Gift, { className: "w-full h-full" }),
        label: "Marketing",
        href: "/dashboard/admin/marketing"
      },
      {
        icon: React.createElement(ShoppingCart, { className: "w-full h-full" }),
        label: "Service Orders",
        href: "/dashboard/admin/service-orders"
      },
      {
        icon: React.createElement(Wallet, { className: "w-full h-full" }),
        label: "Wallet Settings",
        href: "/dashboard/admin/wallet-settings"
      },
      {
        icon: React.createElement(Settings, { className: "w-full h-full" }),
        label: "Site Settings",
        href: "/dashboard/admin/settings"
      }
    ];
  }
  
  // Common navigation items for all user types
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
    }
  ];
  
  let navItems = [...commonNavItems];
  
  // Add influencer-specific menu items
  if (userType === 'influencer') {
    navItems.push({
      icon: React.createElement(Inbox, { className: "w-full h-full" }),
      label: "Requests",
      href: "/requests"
    });
    
    // Remove Influencers and Reports items for influencer users
    navItems = navItems.filter(item => 
      item.label !== "Influencers" && item.label !== "Reports"
    );
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
