
import React, { useRef } from 'react';
import { Upload, Loader2, Paperclip, X } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  files: File[];
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  isUploading,
  onFileChange,
  onRemoveFile,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Label className="text-sm mb-3 block">Upload Files</Label>
      
      <div
        ref={dropAreaRef}
        className="border-2 border-dashed border-border rounded-lg p-6 transition-all cursor-pointer hover:bg-accent/30"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Uploading files...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-medium mb-1">Drag & drop files here</p>
              <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Select Files
              </Button>
            </>
          )}
          
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            multiple
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <Label className="text-sm block">Selected Files ({files.length})</Label>
          <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
            {files.map((file, index) => (
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
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
  );
};

export default FileUploader;
