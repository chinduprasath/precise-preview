
import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake } from "lucide-react";

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
  isCustomPackage?: boolean;
  includeCollaborate?: boolean;
  onCollaborateChange?: (checked: boolean) => void;
  collaborateFee?: number;
  formatCurrency?: (value: number) => string;
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
  isCustomPackage = false,
  includeCollaborate = false,
  onCollaborateChange,
  collaborateFee = 500,
  formatCurrency = (v: number) => `₹${v}`,
}) => {
  return (
    <div className="space-y-4">
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
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Platform</Label>
            <Select 
              value={selectedSinglePlatform} 
              onValueChange={onPlatformChange}
              disabled={isCustomPackage}
            >
              <SelectTrigger 
                className={`w-32 h-8 text-xs ${isCustomPackage ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
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
        </div>

        {/* Collaborate section */}
        <div className="mt-4 pt-3.5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
            <Checkbox
              checked={includeCollaborate}
              onCheckedChange={(checked) => onCollaborateChange && onCollaborateChange(!!checked)}
              className="mt-0.5 sm:mt-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <Handshake className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Collaborate</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Collaborate directly with the influencer for customized campaign delivery
              </p>
            </div>
          </label>
          <div className="flex items-center gap-2 pl-7 sm:pl-0 shrink-0">
            <span className="text-xs text-muted-foreground">Influencer Price:</span>
            <span className="text-sm font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
              {formatCurrency(collaborateFee)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderTypeSelector;
