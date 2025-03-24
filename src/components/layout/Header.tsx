
import React, { useState } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-all duration-300">
              <Avatar>
                <img 
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
            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
