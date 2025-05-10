
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  PieChart, 
  UsersRound, 
  LineChart, 
  Wallet, 
  ShoppingBag, 
  LifeBuoy, 
  MessageSquare,
  BadgeIndianRupee,
  User,
  Bell
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export const createNavigationItems = (userType: string | null): NavItem[] => {
  switch(userType) {
    case "admin":
      return [
        { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Analytics", href: "/dashboard/admin/analytics", icon: PieChart },
        { label: "Business Users", href: "/dashboard/admin/business-users", icon: Users },
        { label: "Influencers", href: "/dashboard/admin/influencers", icon: UsersRound },
        { label: "Service Orders", href: "/dashboard/admin/service-orders", icon: ShoppingBag },
        { label: "Marketing", href: "/dashboard/admin/marketing", icon: LineChart },
        { label: "Team", href: "/dashboard/admin/team", icon: Users },
        { label: "Wallet Settings", href: "/dashboard/admin/wallet-settings", icon: Wallet },
        { label: "Transactions", href: "/dashboard/admin/wallet-transactions", icon: BadgeIndianRupee },
        { label: "Support", href: "/admin/support", icon: LifeBuoy },
        { label: "Profile", href: "/dashboard/admin/profile", icon: User },
        { label: "Notifications", href: "/notifications", icon: Bell },
        { label: "Site Settings", href: "/dashboard/admin/settings", icon: Settings },
      ];
    case "influencer":
      return [
        { label: "Dashboard", href: "/dashboard/influencer", icon: LayoutDashboard },
        { label: "Orders", href: "/orders", icon: ShoppingBag },
        { label: "Messages", href: "/chats", icon: MessageSquare },
        { label: "Wallet", href: "/wallet/influencer", icon: Wallet },
        { label: "Profile", href: "/account/influencer", icon: User },
        { label: "Notifications", href: "/notifications", icon: Bell },
        { label: "Settings", href: "/account/settings", icon: Settings },
      ];
    case "business":
    default:
      return [
        { label: "Dashboard", href: "/dashboard/business", icon: LayoutDashboard },
        { label: "Influencers", href: "/influencers", icon: UsersRound },
        { label: "Orders", href: "/orders", icon: ShoppingBag },
        { label: "Messages", href: "/chats", icon: MessageSquare },
        { label: "Wallet", href: "/wallet/business", icon: Wallet },
        { label: "Profile", href: "/account/business", icon: User },
        { label: "Notifications", href: "/notifications", icon: Bell },
        { label: "Settings", href: "/account/settings", icon: Settings },
      ];
  }
};

export const isActiveLink = (currentPath: string, linkPath: string, dashboardPath: string): boolean => {
  // Special case for dashboard index routes
  if (linkPath === dashboardPath && currentPath === dashboardPath) {
    return true;
  }
  
  // For all other routes, check if currentPath starts with linkPath
  // But only if linkPath is not the dashboard path (to avoid matching all dashboard subroutes)
  if (linkPath !== dashboardPath) {
    return currentPath.startsWith(linkPath);
  }
  
  return false;
};
