import React from 'react';
import { Loader2, ShieldCheck, ReceiptText } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  formatCurrency?: (value: number) => string;
  showSendButton?: boolean;
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
  formatCurrency = (v: number) => `₹${v}`,
  showSendButton = true,
}) => {
  // Calculate GST (18%)
  const gstAmount = Math.round((packagePrice - couponDiscount + platformFee) * 0.18);
  const totalWithGST = packagePrice - couponDiscount + platformFee + gstAmount;

  // Get platform names as text
  const getPlatformText = () => {
    if (isCustomPackage) {
      return "All Platforms";
    }
    const platform = socialPlatforms.find(p => p.id === selectedSinglePlatform);
    return platform ? platform.name : selectedSinglePlatform;
  };

  const detailRows = [
    { label: "Type", value: selectedOrderType },
    { label: "Content", value: `${selectedContent}${isCustomPackage ? "" : " (30 sec)"}` },
    { label: "Platform", value: getPlatformText() },
  ];

  return (
    <div className="space-y-4">
      {/* Order details */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <ReceiptText className="w-3.5 h-3.5" />
          Order Details
        </div>
        <div className="space-y-1.5">
          {detailRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-foreground text-right">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Base Price</span>
          <span className="font-medium">{formatCurrency(packagePrice)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Platform Fee</span>
          <span className="font-medium">{formatCurrency(platformFee)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Coupon Discount</span>
          <span className={cn(
            "font-medium",
            couponDiscount > 0 ? "text-green-600 dark:text-green-500" : "text-muted-foreground"
          )}>
            {couponDiscount > 0 ? `− ${formatCurrency(couponDiscount)}` : "—"}
            {appliedCoupon && couponDiscount > 0 && (
              <span className="ml-1.5 text-[10px] font-semibold bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                {appliedCoupon.code}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">GST (18%)</span>
          <span className="font-medium">{formatCurrency(gstAmount)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/10 px-3.5 py-3">
        <div>
          <div className="text-xs text-muted-foreground">Total (incl. of taxes)</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">100% held in escrow until delivery</div>
        </div>
        <span className="text-xl font-bold text-primary">{formatCurrency(totalWithGST)}</span>
      </div>

      {/* Escrow note */}
      <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your payment is protected. Funds are released to the influencer only after the content is delivered as agreed.
        </p>
      </div>

      {/* Send request */}
      {showSendButton && (
        <Button
          type="button"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all py-6 text-base font-medium shadow-md shadow-blue-500/20"
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
      )}
    </div>
  );
};

export default OrderSummary;
