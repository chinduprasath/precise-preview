
import React from 'react';
import { FileText } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ContentSubmissionSelectorProps {
  contentSubmissionMethod: 'upload' | 'describe';
  onContentMethodChange: (method: 'upload' | 'describe') => void;
}

const ContentSubmissionSelector: React.FC<ContentSubmissionSelectorProps> = ({
  contentSubmissionMethod,
  onContentMethodChange,
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary/80" />
        How would you like to provide the content?
      </Label>
      
      <RadioGroup 
        value={contentSubmissionMethod} 
        onValueChange={(value) => onContentMethodChange(value as 'upload' | 'describe')}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upload" id="upload" />
          <Label htmlFor="upload" className="text-sm font-medium cursor-pointer">
            Upload Files
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="describe" id="describe" />
          <Label htmlFor="describe" className="text-sm font-medium cursor-pointer">
            Describe What to Create
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ContentSubmissionSelector;
