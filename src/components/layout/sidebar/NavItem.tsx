
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = memo(({
  icon: Icon,
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
        isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-secondary hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={cn(
        "w-5 h-5 transition-transform duration-300 group-hover:scale-110", 
        isActive ? "text-white" : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
      )}>
        <Icon />
      </div>
      {!isCollapsed && <span>{label}</span>}
    </a>
  );
});

NavItem.displayName = 'NavItem';

export default NavItem;
