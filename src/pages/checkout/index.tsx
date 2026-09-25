import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { Order, CouponCode } from '@/types/order';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  Lock,
  MapPin,
  Package,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react';

const PLATFORM_FEE_RATE = 0.05;
const TAX_RATE = 0.18;

const VALID_COUPONS: Record<string, number> = {
  discount20: 20,
  welcome10: 10,
};

/** Sample order so the page always renders a complete, reviewable state. */
const SAMPLE_ORDER: Order = {
  id: 'sample-1',
  orderNumber: 'IC-2048',
  date: new Date().toISOString(),
  url: 'https://brandstore.example.com/summer-collection',
  status: 'pending_checkout',
  scheduledDate: new Date(Date.now() + 5 * 86400000).toISOString(),
  scheduledTime: '11:00 AM - 1:00 PM',
  category: 'Food & Lifestyle',
  productService: 'Summer Brand Launch Campaign',
  orderType: 'visit_promote',
  businessVerified: true,
  username: 'foodieanjali',
  amount: 24000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  visit_promote: 'Visit & Promote',
  provided_content: 'Provide Content',
  polls: 'Polls',
  upload_files: 'Upload Files',
};

const DELIVERABLES = [
  '1 dedicated Instagram Reel (30-60 seconds)',
  '2 Instagram Stories with product link sticker',
  '1 static feed post with brand mention',
  'Usage rights for 30 days across brand channels',
];

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);

  const order = (location.state?.order as Order) || SAMPLE_ORDER;
  const isSample = !location.state?.order;

  const totals = useMemo(() => {
    const subtotal = order.amount || 0;
    const discount = appliedCoupon?.isValid ? (subtotal * appliedCoupon.discount) / 100 : 0;
    const afterDiscount = subtotal - discount;
    const platformFee = afterDiscount * PLATFORM_FEE_RATE;
    const tax = (afterDiscount + platformFee) * TAX_RATE;
    return {
      subtotal,
      discount,
      platformFee,
      tax,
      total: afterDiscount + platformFee + tax,
    };
  }, [order.amount, appliedCoupon]);

  const validateCoupon = async () => {
    setIsValidating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const discount = VALID_COUPONS[couponCode.trim().toLowerCase()];
      if (discount) {
        setAppliedCoupon({ code: couponCode.trim().toUpperCase(), discount, isValid: true });
        toast({
          title: 'Coupon applied',
          description: `${discount}% off has been added to this order.`,
        });
      } else {
        setAppliedCoupon(null);
        toast({
          title: 'Invalid coupon',
          description: 'That code is not recognised. Please check and try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { order, appliedCoupon } });
  };

  const steps = ['Campaign setup', 'Review & checkout', 'Secure payment'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Checkout</h1>
              <p className="text-xs text-muted-foreground">Order #{order.orderNumber}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            Secure encrypted checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8 flex items-center gap-3 overflow-x-auto">
          {steps.map((step, index) => {
            const isDone = index === 0;
            const isActive = index === 1;
            return (
              <div key={step} className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      isDone
                        ? 'bg-primary/15 text-primary'
                        : isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-primary-foreground shadow'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </span>
                  <span
                    className={`text-sm whitespace-nowrap ${
                      isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && <div className="h-px w-8 sm:w-16 bg-border" />}
              </div>
            );
          })}
        </div>

        {isSample && (
          <div className="mb-6 rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Showing a sample campaign. Start checkout from an order to see its real details here.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Creator */}
            <Card className="overflow-hidden border-border/70 shadow-sm">
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-accent text-accent-foreground text-lg font-semibold">
                      {order.username?.slice(0, 2).toUpperCase() || 'IC'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">@{order.username}</h2>
                      {order.businessVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {order.category || 'Creator'} · Collaboration partner
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" /> 128K followers
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> Mumbai, India
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" /> 4.9 rating
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                    {ORDER_TYPE_LABELS[order.orderType || ''] || 'Campaign'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Campaign details */}
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-primary" /> Campaign details
                </CardTitle>
                <CardDescription>Everything included in this order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailRow icon={ReceiptText} label="Order ID" value={`#${order.orderNumber}`} />
                  <DetailRow
                    icon={FileText}
                    label="Product / Service"
                    value={order.productService || 'Not specified'}
                  />
                  <DetailRow
                    icon={CalendarDays}
                    label="Scheduled date"
                    value={
                      order.scheduledDate
                        ? new Date(order.scheduledDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'To be confirmed'
                    }
                  />
                  <DetailRow icon={Clock} label="Time slot" value={order.scheduledTime || 'Flexible'} />
                  <DetailRow icon={Tag} label="Category" value={order.category || 'General'} />
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Business status</p>
                    <div>
                      {order.businessVerified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-0">
                          <BadgeCheck className="h-3.5 w-3.5 mr-1" /> Verified business
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Unverified</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {order.url && (
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      Target link
                    </p>
                    <a
                      href={order.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline break-all"
                    >
                      {order.url}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Deliverables
                </CardTitle>
                <CardDescription>What the creator will publish for this campaign.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {DELIVERABLES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Protection */}
            <Card className="border-primary/20 bg-accent/40 shadow-sm">
              <CardContent className="p-6 flex gap-4">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">Payment protection</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your payment is held safely and released to the creator only after you review and
                    approve the delivered content. If the work is never delivered, you get a full refund.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card className="border-border/70 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Order summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Coupon */}
                  <div>
                    <Label htmlFor="coupon" className="text-xs uppercase tracking-wide text-muted-foreground">
                      Coupon code
                    </Label>
                    {appliedCoupon?.isValid ? (
                      <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                        <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                          <Tag className="h-4 w-4" />
                          {appliedCoupon.code} · {appliedCoupon.discount}% off
                        </span>
                        <button
                          onClick={removeCoupon}
                          aria-label="Remove coupon"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 flex gap-2">
                        <Input
                          id="coupon"
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button
                          variant="secondary"
                          onClick={validateCoupon}
                          disabled={!couponCode || isValidating}
                        >
                          {isValidating ? 'Checking…' : 'Apply'}
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2.5 text-sm">
                    <Row label="Campaign fee" value={formatCurrency(totals.subtotal)} />
                    {totals.discount > 0 && (
                      <Row
                        label={`Discount (${appliedCoupon?.discount}%)`}
                        value={`- ${formatCurrency(totals.discount)}`}
                        accent
                      />
                    )}
                    <Row label="Platform fee (5%)" value={formatCurrency(totals.platformFee)} />
                    <Row label="GST (18%)" value={formatCurrency(totals.tax)} />
                  </div>

                  <Separator />

                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">Total payable</span>
                    <span className="text-2xl font-bold">{formatCurrency(totals.total)}</span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-primary-foreground"
                    onClick={handleProceedToPayment}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to payment
                  </Button>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" /> 256-bit encrypted · UPI, cards & wallets
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: ShieldCheck, label: 'Protected' },
                  { icon: BadgeCheck, label: 'Verified creators' },
                  { icon: ReceiptText, label: 'GST invoice' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-lg border bg-card p-3">
                    <Icon className="h-4 w-4 mx-auto text-primary" />
                    <p className="mt-1 text-[11px] text-muted-foreground leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="space-y-1">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="flex items-center gap-2 text-sm font-medium">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      {value}
    </p>
  </div>
);

const Row = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={accent ? 'font-medium text-emerald-600' : 'font-medium'}>{value}</span>
  </div>
);

export default CheckoutPage;
