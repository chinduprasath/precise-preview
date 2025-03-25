
import React, { useState } from 'react';
import { Bell, BadgeIndianRupee, Search, ChevronDown, Settings, User, FileSpreadsheet, LogOut } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

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
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="w-1/3">
        <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search Influencer"
            className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-primary focus:ring-primary"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/notifications" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-all duration-300">
              <Avatar>
                <AvatarImage 
                  src="https://picsum.photos/id/1005/200/200" 
                  alt="User avatar" 
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div className="text-left">
                <div className="text-sm font-medium">Moni Roy</div>
                <div className="text-xs text-gray-500">Moniroy@gmail.com</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 animate-fade-in" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <User className="h-4 w-4" />
              <Link to="/account/business" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <Link to="/account/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <Link to="/billing" className="w-full">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <BadgeIndianRupee className="h-4 w-4" />
              <Link to="/payments" className="w-full">Payments</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
