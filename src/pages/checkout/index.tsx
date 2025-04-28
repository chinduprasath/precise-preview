
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Order, CouponCode } from '@/types/order';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  
  // In a real app, this would come from the previous page's state
  const order = location.state?.order as Order;
  
  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No order details found. Please go back and try again.</p>
            <Button className="w-full mt-4" onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validateCoupon = async () => {
    setIsValidating(true);
    try {
      // Mock coupon validation - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (couponCode.toLowerCase() === 'discount20') {
        setAppliedCoupon({ code: couponCode, discount: 20, isValid: true });
        toast({
          title: "Coupon Applied!",
          description: "20% discount has been applied to your order.",
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "Please enter a valid coupon code.",
          variant: "destructive",
        });
        setAppliedCoupon(null);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const calculateTotal = () => {
    if (!order.amount) return 0;
    if (appliedCoupon?.isValid) {
      return order.amount * (1 - appliedCoupon.discount / 100);
    }
    return order.amount;
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { 
      state: { 
        order,
        appliedCoupon 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2">
                <Label>Order ID:</Label>
                <span>{order.orderNumber}</span>
                
                {order.url && (
                  <>
                    <Label>Order URL:</Label>
                    <a href={order.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {order.url}
                    </a>
                  </>
                )}
                
                {order.scheduledDate && (
                  <>
                    <Label>Scheduled Date:</Label>
                    <span>{new Date(order.scheduledDate).toLocaleDateString()}</span>
                  </>
                )}
                
                {order.scheduledTime && (
                  <>
                    <Label>Scheduled Time:</Label>
                    <span>{order.scheduledTime}</span>
                  </>
                )}
                
                <Label>Category:</Label>
                <span>{order.category || 'N/A'}</span>
                
                <Label>Product/Service:</Label>
                <span>{order.productService || 'N/A'}</span>
                
                <Label>Business Status:</Label>
                <span>
                  {order.businessVerified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="secondary">Unverified</Badge>
                  )}
                </span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="coupon">Coupon Code</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="coupon"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button
                        onClick={validateCoupon}
                        disabled={!couponCode || isValidating}
                      >
                        {isValidating ? 'Validating...' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{order.amount?.toFixed(2) || 0}</span>
                  </div>
                  
                  {appliedCoupon?.isValid && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount ({appliedCoupon.discount}%):</span>
                      <span>-₹{((order.amount || 0) * (appliedCoupon.discount / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
