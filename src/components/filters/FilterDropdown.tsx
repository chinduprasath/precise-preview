
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
  label: string;
  placeholder?: string;
  value?: string;
  className?: string;
  onClick?: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  placeholder = 'Select', 
  value,
  className,
  onClick
}) => {
  return (
    <div className={cn("relative", className)}>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-200"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export default FilterDropdown;
