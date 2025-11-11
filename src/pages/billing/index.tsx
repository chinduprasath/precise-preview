
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Download, Eye, Calendar, CreditCard, Smartphone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PaymentMethodForm } from '@/components/billing/PaymentMethodForm';
import { toast } from '@/components/ui/use-toast';

type PaymentMethod = {
  id: number;
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  last4: string;
};

export const BillingPage = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBilling, setSelectedBilling] = useState<typeof billingHistory[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      cardNumber: "4242424242424242",
      cardholderName: "John Doe",
      expirationDate: "12/25",
      last4: "4242"
    }
  ]);

  // Sample billing history data
  const billingHistory = [
    {
      id: 1,
      date: '2024-01-15',
      plan: 'Pro Plan',
      amount: 2999,
      paymentMethod: 'UPI',
      status: 'Paid',
      invoiceId: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2023-12-15',
      plan: 'Pro Plan',
      amount: 2999,
      paymentMethod: 'Card',
      status: 'Paid',
      invoiceId: 'INV-2023-012'
    },
    {
      id: 3,
      date: '2023-11-15',
      plan: 'Basic Plan',
      amount: 999,
      paymentMethod: 'UPI',
      status: 'Paid',
      invoiceId: 'INV-2023-011'
    },
    {
      id: 4,
      date: '2023-10-15',
      plan: 'Basic Plan',
      amount: 999,
      paymentMethod: 'Card',
      status: 'Refunded',
      invoiceId: 'INV-2023-010'
    },
    {
      id: 5,
      date: '2023-09-15',
      plan: 'Pro Plan',
      amount: 2999,
      paymentMethod: 'UPI',
      status: 'Pending',
      invoiceId: 'INV-2023-009'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'Refunded':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="h-4 w-4 text-purple-600" />;
      case 'Card':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-purple-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAddCard = (data: any) => {
    const newCard: PaymentMethod = {
      id: paymentMethods.length + 1,
      cardNumber: data.cardNumber,
      cardholderName: data.cardholderName,
      expirationDate: data.expirationDate,
      last4: data.cardNumber.slice(-4)
    };
    setPaymentMethods([...paymentMethods, newCard]);
    setIsAddCardOpen(false);
    toast({
      title: "Payment method added",
      description: "Your card has been added successfully.",
    });
  };

  const handleEditCard = (data: any) => {
    if (!selectedCard) return;
    
    setPaymentMethods(paymentMethods.map(card => 
      card.id === selectedCard.id 
        ? { ...card, cardholderName: data.cardholderName, expirationDate: data.expirationDate }
        : card
    ));
    setIsEditCardOpen(false);
    setSelectedCard(null);
    toast({
      title: "Payment method updated",
      description: "Your card details have been updated successfully.",
    });
  };

  const totalAmount = billingHistory.reduce((sum, item) => sum + item.amount, 0);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Billing & Subscription</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-transparent hover:border-primary transition-all duration-300">
              <CardHeader>
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>Basic features for individuals</CardDescription>
                <div className="mt-2 text-3xl font-bold">$0<span className="text-sm text-muted-foreground font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>5 campaigns per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Current Plan</Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-primary shadow-lg relative">
              <div className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">Popular</div>
              <CardHeader>
                <CardTitle>Standard Plan</CardTitle>
                <CardDescription>Advanced features for growing businesses</CardDescription>
                <div className="mt-2 text-3xl font-bold">$29<span className="text-sm text-muted-foreground font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>25 campaigns per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom reporting</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Upgrade Plan</Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary transition-all duration-300">
              <CardHeader>
                <CardTitle>Premium Plan</CardTitle>
                <CardDescription>Enterprise features for large teams</CardDescription>
                <div className="mt-2 text-3xl font-bold">$99<span className="text-sm text-muted-foreground font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Real-time analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>White-labeling</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Upgrade Plan</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((card) => (
                    <div key={card.id} className="flex items-center p-4 border rounded-lg">
                      <CreditCard className="h-6 w-6 mr-4" />
                      <div>
                        <p className="font-medium">•••• •••• •••• {card.last4}</p>
                        <p className="text-sm text-muted-foreground">Expires {card.expirationDate}</p>
                      </div>
                      <div className="ml-auto">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedCard(card);
                            setIsEditCardOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddCardOpen(true)}
                >
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Billing History</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">View your recent invoices and payment history</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-40 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Filter by Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                        <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-6 gap-4 px-6 py-4 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        Date
                      </div>
                      <div>Plan</div>
                      <div>Amount</div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        Payment Method
                      </div>
                      <div>Status</div>
                      <div className="text-center">Invoice</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-100">
                    {billingHistory.map((item) => (
                      <div key={item.id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="text-sm text-gray-900 font-medium">
                          {formatDate(item.date)}
                        </div>
                        <div className="text-sm text-gray-700">
                          {item.plan}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          {getPaymentMethodIcon(item.paymentMethod)}
                          {item.paymentMethod}
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => {
                              setSelectedBilling(item);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method
            </DialogDescription>
          </DialogHeader>
          <PaymentMethodForm
            onSubmit={handleAddCard}
            onCancel={() => setIsAddCardOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Payment Method Dialog */}
      <Dialog open={isEditCardOpen} onOpenChange={setIsEditCardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
            <DialogDescription>
              Update your card details
            </DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <PaymentMethodForm
              isEdit
              defaultValues={{
                cardholderName: selectedCard.cardholderName,
                cardNumber: '•'.repeat(12) + selectedCard.last4,
                expirationDate: selectedCard.expirationDate,
              }}
              onSubmit={handleEditCard}
              onCancel={() => {
                setIsEditCardOpen(false);
                setSelectedCard(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Invoice Details</DialogTitle>
            <DialogDescription>
              Complete details for invoice {selectedBilling?.invoiceId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBilling && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="text-lg font-semibold">{selectedBilling.invoiceId}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedBilling.status)}
                </div>
              </div>

              <Separator />

              {/* Billing Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    {formatDate(selectedBilling.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Payment Method</p>
                  <p className="flex items-center gap-2">
                    {getPaymentMethodIcon(selectedBilling.paymentMethod)}
                    {selectedBilling.paymentMethod}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Plan Details */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Plan Details</p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Plan</span>
                    <span className="font-medium">{selectedBilling.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Billing Period</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amount Breakdown */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Amount Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedBilling.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (18% GST)</span>
                    <span>{formatCurrency(selectedBilling.amount * 0.18)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>{formatCurrency(selectedBilling.amount * 1.18)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" variant="default">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button className="flex-1" variant="outline">
                  Print Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingPage;
