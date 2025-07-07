
import React, { useRef } from 'react';
import { Upload, Loader2, Paperclip, X } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ContentDescriptionInput from './ContentDescriptionInput';

interface ProvideContentTabProps {
  contentDescription: string;
  contentDescriptionError: string;
  referenceFiles: File[];
  isUploadingReference: boolean;
  onContentDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onContentDescriptionBlur: () => void;
  onReferenceFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveReferenceFile: (index: number) => void;
}

const ProvideContentTab: React.FC<ProvideContentTabProps> = ({
  contentDescription,
  contentDescriptionError,
  referenceFiles,
  isUploadingReference,
  onContentDescriptionChange,
  onContentDescriptionBlur,
  onReferenceFileChange,
  onRemoveReferenceFile,
}) => {
  const referenceFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* Content Description */}
      <ContentDescriptionInput
        contentDescription={contentDescription}
        contentDescriptionError={contentDescriptionError}
        onContentDescriptionChange={onContentDescriptionChange}
        onBlur={onContentDescriptionBlur}
      />
      
      {/* Reference Files Section */}
      <div className="space-y-4">
        <Label className="text-sm mb-3 block">Reference Files (Optional)</Label>
        
        <div className="border-2 border-dashed border-border rounded-lg p-4 transition-all cursor-pointer hover:bg-accent/30">
          <div className="flex flex-col items-center justify-center text-center">
            {isUploadingReference ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Uploading reference files...</p>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium mb-1">Upload reference files</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Add images, documents, or examples to help guide content creation
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => referenceFileInputRef.current?.click()}
                >
                  Select Reference Files
                </Button>
              </>
            )}
            
            <input
              ref={referenceFileInputRef}
              type="file"
              multiple
              onChange={onReferenceFileChange}
              className="hidden"
            />
          </div>
        </div>
        
        {referenceFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm block">Reference Files ({referenceFiles.length})</Label>
            <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
              {referenceFiles.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-accent/50 p-2 rounded-md text-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onRemoveReferenceFile(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvideContentTab;
