
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderSummaryProps {
  selectedOrderType: string;
  selectedContent: string;
  selectedSinglePlatform: string;
  contentSubmissionMethod: 'upload' | 'describe';
  packagePrice: number;
  platformFee: number;
  couponDiscount: number;
  appliedCoupon: {code: string, discount: number, type: string} | null;
  total: number;
  isSubmitting: boolean;
  socialPlatforms: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
  }>;
  onPlatformChange: (platform: string) => void;
  onSendRequest: (e: React.FormEvent) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedOrderType,
  selectedContent,
  selectedSinglePlatform,
  contentSubmissionMethod,
  packagePrice,
  platformFee,
  couponDiscount,
  appliedCoupon,
  total,
  isSubmitting,
  socialPlatforms,
  onPlatformChange,
  onSendRequest,
}) => {
  return (
    <Card className="mt-auto">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold">Order Summary</h3>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Order Details</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium text-foreground">{selectedOrderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Content:</span>
                <span className="font-medium text-foreground">{selectedContent}</span>
              </div>
              {selectedOrderType !== "Custom Package" && (
                <div className="flex justify-between items-center">
                  <span>Platform:</span>
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
          </div>

          {contentSubmissionMethod === 'upload' ? (
            <div className="space-y-1.5 pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className={cn(
                  "transition-all",
                  appliedCoupon ? "text-primary" : "text-muted-foreground"
                )}>
                  Coupon Discount
                </span>
                <span className={cn(
                  appliedCoupon ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {couponDiscount ? `-${couponDiscount}₹` : "—"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="text-muted-foreground">{platformFee}₹</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Posting Fee (Fixed):</span>
                  <span className="font-bold">₹800</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Custom Content Creation Fee:</span>
                  <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-md text-xs font-medium">
                    To be quoted
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md border">
                <div className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Your request will be reviewed by the influencer. A custom quote for content creation will be shared based on your description.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {contentSubmissionMethod === 'upload' && (
        <div className="px-6 py-4 bg-muted/30 border-t">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Total</span>
            <span className="text-xl font-bold">{total}₹</span>
          </div>
        </div>
      )}
      
      <CardFooter className="pt-6">
        <Button
          type="button"
          className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#8b77e5] hover:to-[#6E59AB] transition-all py-6 text-base"
          onClick={onSendRequest}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : contentSubmissionMethod === 'upload' ? (
            "Send Request"
          ) : (
            "Send Request for Quote"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
