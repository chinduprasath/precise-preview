
import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SmartSuggestions from './SmartSuggestions';

interface DescriptionInputProps {
  description: string;
  descriptionError: string;
  isAiEnhancing: boolean;
  dynamicHashtags: string[];
  businessProfiles: Array<{
    handle: string;
    platform: string;
    icon: React.ReactNode;
  }>;
  contextualEmojis: string[];
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  onAiEnhance: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  description,
  descriptionError,
  isAiEnhancing,
  dynamicHashtags,
  businessProfiles,
  contextualEmojis,
  onDescriptionChange,
  onBlur,
  onAiEnhance,
  onSuggestionClick,
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex justify-between items-center">
        <Label 
          htmlFor="description" 
          className={cn(
            "text-base font-semibold",
            descriptionError && "text-destructive"
          )}
        >
          Description {descriptionError && `(${descriptionError})`}
        </Label>
      </div>
      
      <div className="relative">
        <Textarea
          id="description"
          placeholder="Add any specific instructions or details about your request..."
          className={cn(
            "min-h-[120px] resize-none transition-all focus-visible:ring-primary pr-12",
            descriptionError && "border-destructive focus-visible:ring-destructive"
          )}
          value={description}
          onChange={onDescriptionChange}
          onBlur={onBlur}
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={onAiEnhance}
          disabled={isAiEnhancing}
          title="Enhance with AI"
        >
          {isAiEnhancing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </Button>
        
        <SmartSuggestions
          dynamicHashtags={dynamicHashtags}
          businessProfiles={businessProfiles}
          contextualEmojis={contextualEmojis}
          description={description}
          onSuggestionClick={onSuggestionClick}
        />
      </div>
      
      <div className="mt-1 text-xs text-right text-muted-foreground">
        {description.length}/500 characters
      </div>
    </div>
  );
};

export default DescriptionInput;
