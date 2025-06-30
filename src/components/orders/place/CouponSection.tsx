
import React from 'react';
import { Tag, Check } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CouponSectionProps {
  couponCode: string;
  appliedCoupon: {code: string, discount: number, type: string} | null;
  onCouponCodeChange: (value: string) => void;
  onCouponApply: () => void;
  onRemoveCoupon: () => void;
}

const CouponSection: React.FC<CouponSectionProps> = ({
  couponCode,
  appliedCoupon,
  onCouponCodeChange,
  onCouponApply,
  onRemoveCoupon,
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <Label className="text-base font-semibold flex items-center gap-2">
        <Tag className="w-5 h-5 text-primary/80" />
        Coupon Code
      </Label>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
          disabled={!!appliedCoupon}
          className="flex-1"
        />
        {appliedCoupon ? (
          <Button
            variant="outline"
            className="whitespace-nowrap"
            onClick={onRemoveCoupon}
          >
            Remove
          </Button>
        ) : (
          <Button
            variant="outline"
            className="whitespace-nowrap"
            onClick={onCouponApply}
          >
            Apply
          </Button>
        )}
      </div>
      
      {appliedCoupon && (
        <div className="text-sm text-primary flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          <span>
            Coupon <span className="font-medium">{appliedCoupon.code}</span> applied: 
            {appliedCoupon.type === "percentage" 
              ? ` ${appliedCoupon.discount}% off`
              : ` ${appliedCoupon.discount}₹ off`
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default CouponSection;
