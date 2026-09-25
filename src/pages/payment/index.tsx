import React, { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Check, CreditCard, Loader2, LockKeyhole, QrCode, ShieldCheck, Smartphone, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { calculateCheckoutTotals, formatCheckoutCurrency, type CheckoutTotals, type PaymentMethod } from '@/lib/checkout';
import type { CouponCode, Order } from '@/types/order';

interface PaymentState { order?: Order; appliedCoupon?: CouponCode | null; paymentMethod?: PaymentMethod; totals?: CheckoutTotals }

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as PaymentState;
  const order = state.order;
  const [method, setMethod] = useState<PaymentMethod>(state.paymentMethod ?? 'upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const totals = useMemo(() => order ? calculateCheckoutTotals(order, state.appliedCoupon) : null, [order, state.appliedCoupon]);

  if (!order || !totals) return <Navigate to="/orders" replace />;

  const isValid = method === 'wallet' || (method === 'upi' ? upiId.includes('@') : cardNumber.replace(/\s/g, '').length >= 12 && expiry.length >= 4 && cvv.length >= 3);
  const pay = async () => {
    if (!isValid) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    navigate('/order-confirmation', { replace: true, state: { order, totals, paymentMethod: method, paymentReference: `ICP-${Date.now().toString().slice(-8)}` } });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"><Button variant="ghost" className="-ml-3 gap-2" onClick={() => navigate('/checkout', { state: { order } })}><ArrowLeft className="h-4 w-4" />Back to checkout</Button><span className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="h-4 w-4 text-primary" />Secure payment</span></div></header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-7"><p className="text-sm font-medium text-primary">Step 2 of 2</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">Pay securely</h1><p className="mt-1 text-sm text-muted-foreground">Complete payment for order #{order.orderNumber}.</p></div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)]">
          <Card className="shadow-sm"><CardHeader className="border-b"><CardTitle className="text-base">Payment method</CardTitle></CardHeader><CardContent className="space-y-6 pt-6">
            <RadioGroup value={method} onValueChange={(value) => setMethod(value as PaymentMethod)} className="grid gap-3 sm:grid-cols-3">
              <Method value="upi" label="UPI" icon={Smartphone} active={method === 'upi'} />
              <Method value="card" label="Card" icon={CreditCard} active={method === 'card'} />
              <Method value="wallet" label="Wallet" icon={WalletCards} active={method === 'wallet'} />
            </RadioGroup>
            <Separator />
            {method === 'upi' && <div className="space-y-4"><div className="flex items-center gap-3 rounded-md bg-muted/50 p-4"><QrCode className="h-8 w-8 text-primary" /><div><p className="text-sm font-semibold">Pay with any UPI app</p><p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm and more</p></div></div><div className="space-y-2"><Label htmlFor="upiId">UPI ID</Label><Input id="upiId" placeholder="name@bank" value={upiId} onChange={(event) => setUpiId(event.target.value)} /><p className="text-xs text-muted-foreground">Enter a valid UPI ID to approve this payment in your app.</p></div></div>}
            {method === 'card' && <div className="space-y-4"><div className="space-y-2"><Label htmlFor="cardNumber">Card number</Label><Input id="cardNumber" inputMode="numeric" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="expiry">Expiry</Label><Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(event) => setExpiry(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="cvv">CVV</Label><Input id="cvv" type="password" inputMode="numeric" maxLength={4} placeholder="•••" value={cvv} onChange={(event) => setCvv(event.target.value)} /></div></div></div>}
            {method === 'wallet' && <div className="rounded-md border border-primary/30 bg-primary/5 p-5"><div className="flex items-start gap-3"><WalletCards className="h-6 w-6 text-primary" /><div className="flex-1"><p className="font-semibold">Influence Connect Wallet</p><p className="mt-1 text-sm text-muted-foreground">Available balance</p><p className="mt-2 text-xl font-bold">{formatCheckoutCurrency(Math.max(totals.total + 5000, 45000))}</p></div><Check className="h-5 w-5 text-primary" /></div></div>}
            <div className="flex gap-3 rounded-md bg-muted/60 p-4 text-xs text-muted-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" />Payments are encrypted and protected. Funds are released only according to campaign terms.</div>
          </CardContent></Card>
          <Card className="shadow-md lg:sticky lg:top-6"><CardHeader className="border-b"><CardTitle className="text-base">Order summary</CardTitle></CardHeader><CardContent className="space-y-4 pt-5"><div><p className="font-semibold">{order.productService || 'Influencer campaign'}</p><p className="mt-1 text-sm text-muted-foreground">@{order.username} · #{order.orderNumber}</p></div><Separator /><div className="space-y-2 text-sm"><Row label="Campaign fee" value={formatCheckoutCurrency(totals.subtotal)} />{totals.discount > 0 && <Row label="Discount" value={`− ${formatCheckoutCurrency(totals.discount)}`} />}<Row label="Platform fee" value={formatCheckoutCurrency(totals.platformFee)} /><Row label="GST" value={formatCheckoutCurrency(totals.tax)} /></div><Separator /><div className="flex items-center justify-between"><span className="font-semibold">Total payable</span><span className="text-2xl font-bold">{formatCheckoutCurrency(totals.total)}</span></div><Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-primary-foreground hover:from-blue-600 hover:to-blue-700" disabled={!isValid || isProcessing} onClick={pay}>{isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing payment</> : <>Pay {formatCheckoutCurrency(totals.total)} <LockKeyhole className="ml-2 h-4 w-4" /></>}</Button><p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Building2 className="h-3.5 w-3.5" />GST-compliant receipt included</p></CardContent></Card>
        </div>
      </div>
    </main>
  );
};

const Method = ({ value, label, icon: Icon, active }: { value: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }>; active: boolean }) => <Label htmlFor={`pay-${value}`} className={`flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border p-3 ${active ? 'border-primary bg-primary/5 text-primary' : 'hover:bg-muted/40'}`}><RadioGroupItem value={value} id={`pay-${value}`} className="sr-only" /><Icon className="h-5 w-5" /><span className="text-sm font-semibold">{label}</span></Label>;
const Row = ({ label, value }: { label: string; value: string }) => <div className="flex justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
export default PaymentPage;
