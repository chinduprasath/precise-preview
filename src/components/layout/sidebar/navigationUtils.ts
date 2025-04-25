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
  Activity,
  Shield,
  Settings,
  Building,
  User,
  LifeBuoy,
} from 'lucide-react';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export const createNavigationItems = (userType: string): NavItem[] => {
  const dashboardPath = `/dashboard/${userType}`;
  
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
        icon: React.createElement(Gift, { className: "w-full h-full" }),
        label: "Marketing",
        href: "/dashboard/admin/marketing"
      },
      {
        icon: React.createElement(Wallet, { className: "w-full h-full" }),
        label: "Wallet Settings",
        href: "/dashboard/admin/wallet-settings"
      },
      {
        icon: React.createElement(FileSpreadsheet, { className: "w-full h-full" }),
        label: "Wallet Transactions",
        href: "/dashboard/admin/wallet-transactions"
      },
      {
        icon: React.createElement(LifeBuoy, { className: "w-full h-full" }),
        label: "Support",
        href: "/admin/support"
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
      icon: React.createElement(LifeBuoy, { className: "w-full h-full" }),
      label: "Support",
      href: "/support"
    },
    {
      icon: React.createElement(FileSpreadsheet, { className: "w-full h-full" }),
      label: "Billing",
      href: "/billing"
    }
  ];
  
  let navItems = [...commonNavItems];
  
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

export const isActiveLink = (currentPath: string, href: string, dashboardPath: string): boolean => {
  if (currentPath === href) {
    return true;
  }
  
  if (href === dashboardPath && (currentPath === '/' || currentPath === dashboardPath)) {
    return true;
  }
  
  if (href !== '/' && href !== dashboardPath) {
    return currentPath.startsWith(href + '/') || currentPath === href;
  }
  
  return false;
};
