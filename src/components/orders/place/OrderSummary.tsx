
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
  isCustomPackage?: boolean;
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
  isCustomPackage = false,
}) => {
  // Calculate GST (18%)
  const gstAmount = Math.round((packagePrice - couponDiscount + platformFee) * 0.18);
  const totalWithGST = packagePrice - couponDiscount + platformFee + gstAmount;
  
  // Get platform names as text
  const getPlatformText = () => {
    if (isCustomPackage) {
      return "Facebook,Instagram,Youtube,Twitter";
    }
    const platform = socialPlatforms.find(p => p.id === selectedSinglePlatform);
    return platform ? platform.name : selectedSinglePlatform;
  };

  return (
    <Card className="mt-auto">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold">Order Summary</h3>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          {/* Order Details Section */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Order Details</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium text-foreground">{selectedOrderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Content:</span>
                <span className="font-medium text-foreground">{selectedContent} (30 sec)</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span className="font-medium text-foreground">{getPlatformText()}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Cost Breakdown Section */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Base Price:</span>
              <span>₹{packagePrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Platform Fee:</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Coupon Discount:</span>
              <span className={couponDiscount > 0 ? "text-green-600" : ""}>
                - ₹{couponDiscount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST (18%):</span>
              <span>₹{gstAmount}</span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Total Section */}
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Total (Inclusive of taxes):</span>
            <span className="text-xl font-bold">₹{totalWithGST}</span>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />
        </div>
      </CardContent>
      
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
          ) : (
            "Send Request"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
