
import React from 'react';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContentDescriptionInputProps {
  contentDescription: string;
  contentDescriptionError: string;
  onContentDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
}

const ContentDescriptionInput: React.FC<ContentDescriptionInputProps> = ({
  contentDescription,
  contentDescriptionError,
  onContentDescriptionChange,
  onBlur,
}) => {
  return (
    <div>
      <Label 
        htmlFor="content-description" 
        className={cn(
          "text-sm mb-1.5 block",
          contentDescriptionError && "text-destructive"
        )}
      >
        Content Description {contentDescriptionError && `(${contentDescriptionError})`}
      </Label>
      <Textarea
        id="content-description"
        placeholder="Describe what kind of content you want the influencer to create. E.g., 'Create a video story promoting our eco-friendly shoes. Include discount, brand colors, and a call to action.'"
        className={cn(
          "min-h-[120px] resize-none transition-all focus-visible:ring-primary",
          contentDescriptionError && "border-destructive focus-visible:ring-destructive"
        )}
        value={contentDescription}
        onChange={onContentDescriptionChange}
        onBlur={onBlur}
      />
      <div className="mt-1 text-xs text-right text-muted-foreground">
        {contentDescription.length}/500 characters
      </div>
    </div>
  );
};

export default ContentDescriptionInput;
