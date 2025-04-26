
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const sidebarLinks = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, to: "/dashboard/business" },
  { label: "Orders", icon: <ShoppingCart className="w-5 h-5" />, to: "/orders" },
  { label: "Influencers", icon: <Users className="w-5 h-5" />, to: "/influencers" },
  { label: "Campaigns", icon: <Calendar className="w-5 h-5" />, to: "/campaigns" },
  { label: "Settings", icon: <Settings className="w-5 h-5" />, to: "/account/settings" },
];

const BusinessSidebar = () => {
  const { resolvedTheme } = useTheme();

  return (
    <aside className={cn(
      "hidden md:flex flex-col w-60 h-screen px-4 py-7 space-y-4 border-r border-border",
      resolvedTheme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
    )}>
      <div className="text-2xl font-extrabold mb-6 pl-2 tracking-tight">Influence<span className="text-primary">Connect</span></div>
      <nav className="flex flex-col gap-2 flex-1">
        {sidebarLinks.map(link => (
          <NavLink
            to={link.to}
            key={link.label}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition",
                isActive 
                  ? "bg-primary text-white font-semibold" 
                  : cn(
                      "hover:bg-secondary text-muted-foreground",
                      resolvedTheme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                    )
              )
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default BusinessSidebar;
