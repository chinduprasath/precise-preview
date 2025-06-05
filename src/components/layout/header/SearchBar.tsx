
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="w-96">
      <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Influencer"
          className="pl-12 pr-6 py-3 w-full text-base rounded-full border-gray-200 focus:border-primary focus:ring-primary"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
