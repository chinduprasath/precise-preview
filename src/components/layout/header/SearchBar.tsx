
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
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
  );
};

export default SearchBar;
