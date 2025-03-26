
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
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
import { Button } from '@/components/ui/button';

interface SidebarFooterProps {
  isCollapsed: boolean;
  profilePath: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed,
  profilePath
}) => {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();

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
      <div className="border-t border-border">
        <div className={cn("p-3", isCollapsed && "flex justify-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent transition-colors w-full", 
                isCollapsed && "justify-center"
              )}>
                <User size={16} className="flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span>Account</span>
                    <ChevronDown size={14} className="ml-auto" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
              
              {/* Quick theme toggle in dropdown menu */}
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 justify-center gap-1",
                      resolvedTheme === "light" && "bg-primary/10 text-primary"
                    )}
                    onClick={() => setTheme("light")}
                  >
                    <Sun size={14} />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 justify-center gap-1",
                      resolvedTheme === "dark" && "bg-primary/10 text-primary"
                    )}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon size={14} />
                    <span className="text-xs">Dark</span>
                  </Button>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut size={14} />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className={cn("p-4 border-t border-border", isCollapsed && "hidden")}>
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
      
      {isCollapsed && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-center">
            <ThemeToggleMinimal />
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarFooter;
