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
  return <>
      <div className="border-t border-border mt-auto">
        
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
    </>;
};
export default SidebarFooter;