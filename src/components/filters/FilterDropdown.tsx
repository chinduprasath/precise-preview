
import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
  label: string;
  placeholder?: string;
  value?: string;
  className?: string;
  onClick?: () => void;
  isOpen?: boolean;
  onClear?: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  placeholder = 'Select', 
  value,
  className,
  onClick,
  isOpen,
  onClear
}) => {
  return (
    <div className={cn("relative", className)}>
      {label && <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>}
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors duration-200"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", isOpen && "rotate-180")} />
      </button>
      {value && onClear && (
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default FilterDropdown;
