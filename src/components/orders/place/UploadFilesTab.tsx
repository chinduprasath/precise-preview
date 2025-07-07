
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import DescriptionInput from './DescriptionInput';
import FileUploader from './FileUploader';

interface UploadFilesTabProps {
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
  files: File[];
  isUploading: boolean;
  notesDescription: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDescriptionBlur: () => void;
  onAiEnhance: () => void;
  onSuggestionClick: (suggestion: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const UploadFilesTab: React.FC<UploadFilesTabProps> = ({
  description,
  descriptionError,
  isAiEnhancing,
  dynamicHashtags,
  businessProfiles,
  contextualEmojis,
  files,
  isUploading,
  notesDescription,
  onDescriptionChange,
  onDescriptionBlur,
  onAiEnhance,
  onSuggestionClick,
  onFileChange,
  onRemoveFile,
  onDragOver,
  onDragLeave,
  onDrop,
  onNotesChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Post Description */}
      <DescriptionInput
        description={description}
        descriptionError={descriptionError}
        isAiEnhancing={isAiEnhancing}
        dynamicHashtags={dynamicHashtags}
        businessProfiles={businessProfiles}
        contextualEmojis={contextualEmojis}
        onDescriptionChange={onDescriptionChange}
        onBlur={onDescriptionBlur}
        onAiEnhance={onAiEnhance}
        onSuggestionClick={onSuggestionClick}
      />
      
      {/* Upload Files Section */}
      <FileUploader
        files={files}
        isUploading={isUploading}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
      
      {/* Notes Section */}
      <div className="space-y-4">
        <Label htmlFor="notes-description" className="text-sm mb-1.5 block">
          Notes (Optional)
        </Label>
        <Textarea
          id="notes-description"
          placeholder="Add any additional instructions or notes for the influencer..."
          className="min-h-[100px] resize-none transition-all focus-visible:ring-primary"
          value={notesDescription}
          onChange={onNotesChange}
        />
        <div className="mt-1 text-xs text-right text-muted-foreground">
          {notesDescription.length}/300 characters
        </div>
      </div>
    </div>
  );
};

export default UploadFilesTab;
