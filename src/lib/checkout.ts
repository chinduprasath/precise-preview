import type { CouponCode, Order } from '@/types/order';

export const PLATFORM_FEE_RATE = 0.05;
export const TAX_RATE = 0.18;

export type PaymentMethod = 'upi' | 'card' | 'wallet';

export interface CheckoutTotals {
  subtotal: number;
  discount: number;
  platformFee: number;
  tax: number;
  total: number;
}

export const calculateCheckoutTotals = (
  order: Pick<Order, 'amount'>,
  coupon?: CouponCode | null,
): CheckoutTotals => {
  const subtotal = order.amount ?? 0;
  const discount = coupon?.isValid ? (subtotal * coupon.discount) / 100 : 0;
  const discountedSubtotal = subtotal - discount;
  const platformFee = discountedSubtotal * PLATFORM_FEE_RATE;
  const tax = (discountedSubtotal + platformFee) * TAX_RATE;

  return {
    subtotal,
    discount,
    platformFee,
    tax,
    total: discountedSubtotal + platformFee + tax,
  };
};

export const formatCheckoutCurrency = (value: number) =>
  `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;