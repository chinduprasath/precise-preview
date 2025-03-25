
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  dashboardPath: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleSidebar,
  dashboardPath
}) => {
  return (
    <div className={cn("p-4 flex justify-between items-center", isCollapsed && "justify-center")}>
      {!isCollapsed && (
        <Link to={dashboardPath} className="text-primary font-bold text-2xl">
          <span className="text-primary">Influence</span>
          <span className="text-gray-800">Connect</span>
        </Link>
      )}
      
      <button 
        onClick={toggleSidebar} 
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full text-gray-500 hover:bg-gray-100 transition-all duration-300", 
          isCollapsed && "mx-auto"
        )} 
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  );
};

export default SidebarHeader;
