
import React from 'react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  isActive,
  isCollapsed,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-300 group", 
        isCollapsed ? "justify-center px-2 py-3" : "px-3 py-3", 
        isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-secondary"
      )}
    >
      <div className={cn(
        "w-5 h-5 transition-transform duration-300 group-hover:scale-110", 
        isActive ? "text-white" : "text-gray-700"
      )}>
        {icon}
      </div>
      {!isCollapsed && <span>{label}</span>}
    </a>
  );
};

export default NavItem;
