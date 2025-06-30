
import React from 'react';
import { Check } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderTypeSelectorProps {
  selectedOrderType: string;
  selectedContent: string;
  selectedSinglePlatform: string;
  onOrderTypeChange: (orderType: string) => void;
  onContentChange: (content: string) => void;
  onPlatformChange: (platform: string) => void;
  contentTypesByOrder: Record<string, string[]>;
  socialPlatforms: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
  }>;
}

const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  selectedOrderType,
  selectedContent,
  selectedSinglePlatform,
  onOrderTypeChange,
  onContentChange,
  onPlatformChange,
  contentTypesByOrder,
  socialPlatforms,
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold flex items-center gap-2">
        <Check className="w-5 h-5 text-primary/80" />
        Selected Order
      </Label>
      <Card className="p-4 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Order Type</Label>
            <Select value={selectedOrderType} onValueChange={onOrderTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Platform Based">Platform Based</SelectItem>
                <SelectItem value="Custom Package">Custom Package</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Content</Label>
            <Select value={selectedContent} onValueChange={onContentChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypesByOrder[selectedOrderType].map((content) => (
                  <SelectItem key={content} value={content}>{content}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedOrderType !== "Custom Package" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Platform</Label>
              <Select value={selectedSinglePlatform} onValueChange={onPlatformChange}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
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
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OrderTypeSelector;
