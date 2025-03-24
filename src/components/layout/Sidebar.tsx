
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart, 
  FileText, 
  Settings, 
  ShoppingCart, 
  FileSpreadsheet
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ icon, label, href, isActive }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 group",
        isActive 
          ? "bg-primary text-white" 
          : "text-gray-700 hover:bg-secondary"
      )}
    >
      <div className={cn(
        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
        isActive ? "text-white" : "text-gray-700"
      )}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: <LayoutDashboard className="w-full h-full" />,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: <Users className="w-full h-full" />,
      label: "Influencers",
      href: "/influencers",
    },
    {
      icon: <MessageSquare className="w-full h-full" />,
      label: "Chats",
      href: "/chats",
    },
    {
      icon: <BarChart className="w-full h-full" />,
      label: "Reach",
      href: "/reach",
    },
    {
      icon: <FileText className="w-full h-full" />,
      label: "Services",
      href: "/services",
    },
    {
      icon: <FileSpreadsheet className="w-full h-full" />,
      label: "Reports",
      href: "/reports",
    },
  ];

  const bottomNavItems = [
    {
      icon: <Settings className="w-full h-full" />,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: <ShoppingCart className="w-full h-full" />,
      label: "Orders",
      href: "/orders",
    },
    {
      icon: <FileText className="w-full h-full" />,
      label: "Billing",
      href: "/billing",
    },
  ];

  return (
    <aside className="w-60 h-screen flex flex-col border-r bg-white">
      <div className="p-4">
        <div className="flex items-center gap-2 py-2">
          <div className="text-primary font-bold text-2xl">
            <span className="text-primary">Influence</span>
            <span className="text-gray-800">Connect</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={
              item.href === "/" 
                ? currentPath === "/" 
                : currentPath.startsWith(item.href)
            }
          />
        ))}
      </nav>
      <div className="border-t">
        <nav className="px-3 py-3 space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={currentPath.startsWith(item.href)}
            />
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-4 items-center justify-between">
          <button className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium transition-all duration-300 hover:bg-gray-50">
            Light Mode
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium transition-all duration-300 hover:bg-gray-700">
            Dark Mode
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
