
import React from 'react';
import { cn } from "@/lib/utils";

interface SmartSuggestionsProps {
  dynamicHashtags: string[];
  businessProfiles: Array<{
    handle: string;
    platform: string;
    icon: React.ReactNode;
  }>;
  contextualEmojis: string[];
  description: string;
  onSuggestionClick: (suggestion: string) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  dynamicHashtags,
  businessProfiles,
  contextualEmojis,
  description,
  onSuggestionClick,
}) => {
  const getTextContainsItem = (text: string, item: string) => {
    return text.toLowerCase().includes(item.toLowerCase());
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="text-xs text-muted-foreground mb-1">Smart Suggestions:</div>
      
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">Hashtags:</span>
          {dynamicHashtags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "text-xs px-2 py-1 rounded-md cursor-pointer transition-colors",
                getTextContainsItem(description, tag)
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200"
              )}
              onClick={() => {
                if (!getTextContainsItem(description, tag)) {
                  onSuggestionClick(tag);
                }
              }}
            >
              {getTextContainsItem(description, tag) && "✅ "}{tag}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">Profiles:</span>
          {businessProfiles.map((profile) => (
            <span
              key={profile.handle}
              className={cn(
                "text-xs px-2 py-1 rounded-md cursor-pointer transition-colors flex items-center gap-1",
                getTextContainsItem(description, profile.handle)
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200"
              )}
              onClick={() => {
                if (!getTextContainsItem(description, profile.handle)) {
                  onSuggestionClick(profile.handle);
                }
              }}
            >
              {profile.icon}
              {getTextContainsItem(description, profile.handle) && "✅ "}{profile.handle}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">Emojis:</span>
          {contextualEmojis.map((emoji) => (
            <span
              key={emoji}
              className={cn(
                "text-xs px-2 py-1 rounded-md cursor-pointer transition-colors",
                getTextContainsItem(description, emoji)
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200"
              )}
              onClick={() => {
                if (!getTextContainsItem(description, emoji)) {
                  onSuggestionClick(emoji);
                }
              }}
            >
              {getTextContainsItem(description, emoji) && "✅ "}{emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;
