
import React from 'react';
import Header from './Header';
import { ThemeToggleMinimal } from '@/components/ui/theme-toggle';

const ConditionalHeader = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <Header />
      <div className="pr-6">
        <ThemeToggleMinimal />
      </div>
    </div>
  );
};

export default ConditionalHeader; 
