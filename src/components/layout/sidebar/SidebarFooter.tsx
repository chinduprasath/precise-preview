
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  const {
    resolvedTheme,
    setTheme
  } = useTheme();
  
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
      <div className="border-t border-border mt-auto">
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                <User size={20} className="text-foreground" />
                {!isCollapsed && <span>Profile</span>}
                {!isCollapsed && <ChevronDown className="ml-auto h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(profilePath)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/account/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
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
      
      {isCollapsed && <div className="p-3 border-t border-border">
          <div className="flex items-center justify-center">
            <ThemeToggleMinimal />
          </div>
        </div>}
    </>
  );
};

export default SidebarFooter;
