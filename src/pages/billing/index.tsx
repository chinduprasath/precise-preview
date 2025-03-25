
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CreditCard } from 'lucide-react';

export const BillingPage = () => {
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
                <div className="flex items-center p-4 border rounded-lg mb-4">
                  <CreditCard className="h-6 w-6 mr-4" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <Button variant="outline" className="mt-2">Add Payment Method</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your recent invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-4 font-medium border-b">
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Invoice</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-4 p-4">
                      <div>May 15, 2023</div>
                      <div>$0.00</div>
                      <div><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Paid</span></div>
                      <div><Button variant="link" size="sm" className="p-0 h-auto">Download</Button></div>
                    </div>
                    <div className="grid grid-cols-4 p-4">
                      <div>Apr 15, 2023</div>
                      <div>$0.00</div>
                      <div><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Paid</span></div>
                      <div><Button variant="link" size="sm" className="p-0 h-auto">Download</Button></div>
                    </div>
                    <div className="grid grid-cols-4 p-4">
                      <div>Mar 15, 2023</div>
                      <div>$0.00</div>
                      <div><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Paid</span></div>
                      <div><Button variant="link" size="sm" className="p-0 h-auto">Download</Button></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
