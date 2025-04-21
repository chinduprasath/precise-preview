
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, to: "/dashboard/business" },
  { label: "Orders", icon: <ShoppingCart className="w-5 h-5" />, to: "/orders" },
  { label: "Influencers", icon: <Users className="w-5 h-5" />, to: "/influencers" },
  { label: "Campaigns", icon: <Calendar className="w-5 h-5" />, to: "/campaigns" },
  { label: "Settings", icon: <Settings className="w-5 h-5" />, to: "/account/settings" },
];

const BusinessSidebar = () => (
  <aside className="hidden md:flex flex-col w-60 bg-[#1A1F2C] text-white h-screen px-4 py-7 space-y-4">
    <div className="text-2xl font-extrabold mb-6 pl-2 tracking-tight">Influence<span className="text-[#9b87f5]">Connect</span></div>
    <nav className="flex flex-col gap-2 flex-1">
      {sidebarLinks.map(link => (
        <NavLink
          to={link.to}
          key={link.label}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition bg-opacity-10",
              isActive ? "bg-[#9b87f5] text-white font-semibold" : "hover:bg-[#332A57] text-gray-200"
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

export default BusinessSidebar;
