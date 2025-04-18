
import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const {
    setTheme,
    resolvedTheme
  } = useTheme();

  return (
    <div className="border-t border-border">
      {isCollapsed ? (
        <div className="p-3">
          <div className="flex items-center justify-center">
            <ThemeToggleMinimal />
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setTheme('light')}
            >
              <Sun className="h-4 w-4 mr-1" />
              Light
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-4 w-4 mr-1" />
              Dark
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
