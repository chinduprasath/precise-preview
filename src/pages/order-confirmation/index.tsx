import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle2, Clock3, FileCheck2, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCheckoutCurrency, type CheckoutTotals } from '@/lib/checkout';
import type { Order } from '@/types/order';

interface ConfirmationState { order?: Order; totals?: CheckoutTotals; orderReference?: string }

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const state = (useLocation().state ?? {}) as ConfirmationState;
  if (!state.order || !state.totals) return <Navigate to="/orders" replace />;
  const { order, totals } = state;
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-7 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"><CheckCircle2 className="h-9 w-9" /></span><p className="mt-5 text-sm font-semibold text-primary">Order placed successfully</p><h1 className="mt-1 text-3xl font-bold">Thank you. Your order is confirmed.</h1><p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">Your campaign is ready for the creator to review. You can follow every update from your orders page.</p></div>
        <Card className="shadow-md"><CardContent className="p-6 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs uppercase text-muted-foreground">Order number</p><p className="mt-1 text-lg font-bold">#{order.orderNumber}</p><p className="mt-1 text-sm text-muted-foreground">{order.productService || 'Influencer campaign'} with @{order.username}</p></div><div className="sm:text-right"><p className="text-xs uppercase text-muted-foreground">Order total</p><p className="mt-1 text-2xl font-bold">{formatCheckoutCurrency(totals.total)}</p></div></div><Separator className="my-6" /><div className="grid gap-4 sm:grid-cols-3"><Step icon={ReceiptText} title="Order received" text={state.orderReference || 'Reference created'} /><Step icon={FileCheck2} title="Creator review" text="Campaign sent for review" /><Step icon={Clock3} title="Track progress" text="Updates appear in Orders" /></div><Separator className="my-6" /><div className="flex flex-col gap-3 sm:flex-row"><Button size="lg" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-primary-foreground hover:from-blue-600 hover:to-blue-700" onClick={() => navigate('/orders')}>View my orders <ArrowRight className="ml-2 h-4 w-4" /></Button><Button size="lg" variant="outline" className="flex-1" onClick={() => navigate('/dashboard/business')}>Go to dashboard</Button></div></CardContent></Card>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5 text-primary" />Your order confirmation is ready.</p>
      </div>
    </main>
  );
};
const Step = ({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) => <div className="flex gap-3 sm:block"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-primary sm:mb-3"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs text-muted-foreground">{text}</p></div></div>;
export default OrderConfirmationPage;
