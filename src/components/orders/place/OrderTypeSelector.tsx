
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface OrderTypeSelectorProps {
  selectedOrderType: string;
  selectedContent: string;
  selectedSinglePlatform: string;
  selectedMultiplePlatforms: string[];
  onOrderTypeChange: (orderType: string) => void;
  onContentChange: (content: string) => void;
  onPlatformChange: (platform: string) => void;
  onMultiplePlatformsChange: (platforms: string[]) => void;
  contentTypesByOrder: Record<string, string[]>;
  socialPlatforms: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
  }>;
  isCustomPackage: boolean;
  isVisitPromote: boolean;
}

const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  selectedOrderType,
  selectedContent,
  selectedSinglePlatform,
  selectedMultiplePlatforms,
  onOrderTypeChange,
  onContentChange,
  onPlatformChange,
  onMultiplePlatformsChange,
  contentTypesByOrder,
  socialPlatforms,
  isCustomPackage,
  isVisitPromote,
}) => {
  const handlePlatformToggle = (platformId: string) => {
    const updatedPlatforms = selectedMultiplePlatforms.includes(platformId)
      ? selectedMultiplePlatforms.filter(id => id !== platformId)
      : [...selectedMultiplePlatforms, platformId];
    
    onMultiplePlatformsChange(updatedPlatforms);
  };

  return (
    <div className="space-y-6">
      {/* Order Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Order Type</Label>
        <Select value={selectedOrderType} onValueChange={onOrderTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select order type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(contentTypesByOrder).map((orderType) => (
              <SelectItem key={orderType} value={orderType}>
                {orderType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Content Type</Label>
        <Select value={selectedContent} onValueChange={onContentChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            {contentTypesByOrder[selectedOrderType as keyof typeof contentTypesByOrder]?.map((content) => (
              <SelectItem key={content} value={content}>
                {content}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Platform Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">
          {isVisitPromote ? "Platforms (Multi-select)" : "Platform"}
        </Label>
        
        {isVisitPromote ? (
          /* Multi-select for Visit & Promote */
          <div className="space-y-3">
            {socialPlatforms.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-3">
                <Checkbox
                  id={platform.id}
                  checked={selectedMultiplePlatforms.includes(platform.id)}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                />
                <label
                  htmlFor={platform.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className={platform.color}>{platform.icon}</span>
                  <span className="font-medium">{platform.name}</span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          /* Single select for other content types */
          <Select 
            value={selectedSinglePlatform} 
            onValueChange={onPlatformChange}
            disabled={isCustomPackage}
          >
            <SelectTrigger className={cn("w-full", isCustomPackage && "opacity-50 cursor-not-allowed")}>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {socialPlatforms.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  <div className="flex items-center gap-2">
                    <span className={platform.color}>{platform.icon}</span>
                    {platform.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default OrderTypeSelector;
