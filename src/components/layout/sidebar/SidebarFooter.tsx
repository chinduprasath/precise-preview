
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ThemeToggle, ThemeToggleMinimal } from '@/components/ui/theme-toggle';
import { useTheme } from '@/components/theme-provider';

interface SidebarFooterProps {
  isCollapsed: boolean;
  profilePath: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed,
  profilePath
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <>
      <div className="border-t">
        <div className={cn("p-3", isCollapsed && "flex justify-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 w-full", 
                isCollapsed && "justify-center"
              )}>
                <User size={16} className="text-gray-700 dark:text-gray-200" />
                {!isCollapsed && (
                  <>
                    <span>Account</span>
                    <ChevronDown size={14} className="ml-auto" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={profilePath} className="flex items-center gap-2 cursor-pointer">
                  <User size={14} />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings size={14} />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-700"
              >
                <LogOut size={14} />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className={cn("p-4 border-t", isCollapsed && "hidden")}>
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
      
      {isCollapsed && (
        <div className="p-3 border-t">
          <div className="flex items-center justify-center">
            <ThemeToggleMinimal />
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarFooter;
