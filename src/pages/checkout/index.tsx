import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BadgeCheck, CalendarDays, Check, ChevronRight, Clock, CreditCard,
  ExternalLink, FileText, LockKeyhole, MapPin, PackageCheck, ReceiptText, ShieldCheck,
  Smartphone, Tag, Users, WalletCards, X,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { calculateCheckoutTotals, formatCheckoutCurrency, type PaymentMethod } from '@/lib/checkout';
import type { CouponCode, Order } from '@/types/order';

const SAMPLE_ORDER: Order = {
  id: 'sample-1', orderNumber: 'IC-2048', date: new Date().toISOString(),
  url: 'https://brandstore.example.com/summer-collection', status: 'pending_checkout',
  scheduledDate: new Date(Date.now() + 5 * 86400000).toISOString(),
  scheduledTime: '11:00 AM – 1:00 PM', category: 'Food & Lifestyle',
  productService: 'Summer Brand Launch Campaign', orderType: 'visit_promote',
  businessVerified: true, username: 'foodieanjali', amount: 24000,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

const VALID_COUPONS: Record<string, number> = { discount20: 20, welcome10: 10 };
const DELIVERABLES = [
  '1 dedicated Instagram Reel (30–60 seconds)',
  '2 Instagram Stories with product link sticker',
  '1 static feed post with brand mention',
  '30-day usage rights across brand channels',
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const order = (location.state?.order as Order | undefined) ?? SAMPLE_ORDER;
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const totals = useMemo(() => calculateCheckoutTotals(order, appliedCoupon), [order, appliedCoupon]);

  const applyCoupon = () => {
    const code = couponCode.trim().toLowerCase();
    const discount = VALID_COUPONS[code];
    if (!discount) {
      toast({ title: 'Coupon not valid', description: 'Check the code and try again.', variant: 'destructive' });
      return;
    }
    setAppliedCoupon({ code: couponCode.trim().toUpperCase(), discount, isValid: true });
    toast({ title: 'Coupon applied', description: `${discount}% has been deducted from your campaign fee.` });
  };

  const proceed = () => navigate('/payment', { state: { order, appliedCoupon, paymentMethod, totals } });

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Button variant="ghost" className="-ml-3 gap-2" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole className="h-4 w-4 text-primary" /> Secure checkout
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-bold sm:text-3xl">Complete your order</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review the campaign details and choose how you want to pay.</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.8fr)]">
          <div className="space-y-5">
            <Section title="Creator & campaign" icon={Users}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar className="h-16 w-16 border-2 border-primary/15">
                  <AvatarFallback className="bg-accent text-lg font-bold text-accent-foreground">
                    {order.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-semibold">@{order.username}</h2>
                    {order.businessVerified && <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{order.category || 'Creator'} · Collaboration partner</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />128K followers</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />Mumbai, India</span>
                    <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4" />Verified creator</span>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit">{order.orderType?.replace(/_/g, ' ') || 'Campaign'}</Badge>
              </div>
              <Separator className="my-5" />
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <span className="text-xs uppercase text-muted-foreground">Campaign</span>
                <span className="font-medium">{order.productService || 'Influencer campaign'}</span>
              </div>
            </Section>

            <Section title="Order details" icon={ReceiptText}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail icon={FileText} label="Order ID" value={`#${order.orderNumber}`} />
                <Detail icon={PackageCheck} label="Service" value={order.productService || 'Campaign service'} />
                <Detail icon={CalendarDays} label="Scheduled date" value={order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'To be confirmed'} />
                <Detail icon={Clock} label="Publishing time" value={order.scheduledTime || 'Flexible'} />
              </div>
              {order.url && (
                <div className="mt-3 flex min-w-0 items-center gap-3 rounded-md border bg-muted/40 p-3">
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <a href={order.url} target="_blank" rel="noreferrer" className="truncate text-sm font-medium text-primary hover:underline">{order.url}</a>
                </div>
              )}
            </Section>

            <Section title="Campaign deliverables" icon={PackageCheck}>
              <ul className="space-y-3">
                {DELIVERABLES.map((item) => <li key={item} className="flex gap-3 text-sm"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-3 w-3" /></span>{item}</li>)}
              </ul>
            </Section>

            <Section title="Select payment method" icon={CreditCard}>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} className="space-y-3">
                <PaymentChoice value="upi" title="UPI instant payment" description="Google Pay, PhonePe, Paytm or any UPI app" icon={Smartphone} active={paymentMethod === 'upi'} />
                <PaymentChoice value="card" title="Credit or debit card" description="Visa, Mastercard and RuPay accepted" icon={CreditCard} active={paymentMethod === 'card'} />
                <PaymentChoice value="wallet" title="Influence Connect wallet" description="Pay securely using your available balance" icon={WalletCards} active={paymentMethod === 'wallet'} />
              </RadioGroup>
              <div className="mt-4 flex gap-3 rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> Your payment information is encrypted and never shared with the creator.
              </div>
            </Section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base">Have a promotional code?</CardTitle></CardHeader>
              <CardContent>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-primary"><Tag className="h-4 w-4" />{appliedCoupon.code} · {appliedCoupon.discount}% off</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Remove coupon" onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex gap-2"><Input aria-label="Promotional code" placeholder="Enter code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} /><Button variant="secondary" disabled={!couponCode.trim()} onClick={applyCoupon}>Apply</Button></div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardHeader className="pb-3"><CardTitle className="text-lg">Payment summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2.5 text-sm">
                  <SummaryRow label="Campaign fee" value={formatCheckoutCurrency(totals.subtotal)} />
                  {totals.discount > 0 && <SummaryRow label={`Discount (${appliedCoupon?.discount}%)`} value={`− ${formatCheckoutCurrency(totals.discount)}`} emphasis />}
                  <SummaryRow label="Platform fee (5%)" value={formatCheckoutCurrency(totals.platformFee)} />
                  <SummaryRow label="GST (18%)" value={formatCheckoutCurrency(totals.tax)} />
                </div>
                <Separator />
                <div className="flex items-end justify-between rounded-md bg-muted/50 p-4">
                  <div><p className="text-xs font-medium uppercase text-muted-foreground">Total amount due</p><p className="mt-1 text-xs text-muted-foreground">All taxes included</p></div>
                  <p className="text-2xl font-bold">{formatCheckoutCurrency(totals.total)}</p>
                </div>
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-primary-foreground hover:from-blue-600 hover:to-blue-700" onClick={proceed}>
                  Continue to pay <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5" />Encrypted and protected checkout</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
};

const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) => (
  <Card className="border-border shadow-sm"><CardHeader className="border-b pb-4"><CardTitle className="flex items-center gap-2 text-base"><Icon className="h-4 w-4 text-primary" />{title}</CardTitle></CardHeader><CardContent className="pt-5">{children}</CardContent></Card>
);
const Detail = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) => (
  <div className="rounded-md border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 flex items-center gap-2 text-sm font-medium"><Icon className="h-4 w-4 shrink-0 text-muted-foreground" />{value}</p></div>
);
const PaymentChoice = ({ value, title, description, icon: Icon, active }: { value: PaymentMethod; title: string; description: string; icon: React.ComponentType<{ className?: string }>; active: boolean }) => (
  <Label htmlFor={`method-${value}`} className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-colors ${active ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'}`}>
    <RadioGroupItem id={`method-${value}`} value={value} /><Icon className="h-5 w-5 text-primary" /><span className="flex-1"><span className="block text-sm font-semibold">{title}</span><span className="block text-xs font-normal text-muted-foreground">{description}</span></span>
  </Label>
);
const SummaryRow = ({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) => <div className="flex justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className={emphasis ? 'font-semibold text-primary' : 'font-semibold'}>{value}</span></div>;

export default CheckoutPage;
