
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HashtagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const HashtagInput: React.FC<HashtagInputProps> = ({
  label,
  tags,
  onChange,
  placeholder = 'Enter Hashtags',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">{label}</label>
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full"
        />
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <div 
              key={tag} 
              className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm"
            >
              <span className="mr-1">#{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HashtagInput;
