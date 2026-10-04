
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { ServiceType } from '@/types/service';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { addStoredOrder } from '@/data/orders';
import { Order } from '@/types/order';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ServiceFormProps {
  service: ServiceType;
}

const categoryNames: Record<string, string> = {
  designers: 'Design Services',
  marketing: 'Marketing Services',
  social: 'Social Media Campaigns',
  ai_automation: 'AI & Automation',
  ott: 'OTT Campaigns',
};

const budgetLabels: Record<string, string> = {
  'under-500': 'Under $500',
  '500-1000': '$500 - $1,000',
  '1000-5000': '$1,000 - $5,000',
  '5000-plus': '$5,000+',
};

const timelineLabels: Record<string, string> = {
  asap: 'ASAP',
  '1-week': 'Within 1 week',
  '2-weeks': 'Within 2 weeks',
  '1-month': 'Within 1 month',
  flexible: 'Flexible',
};

const ServiceForm: React.FC<ServiceFormProps> = ({ service }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      description: '',
      budget: '',
      timeline: '',
    },
  });

  const onSubmit = (data: any) => {
    const categoryDisplay = categoryNames[service.category] || 'Custom Services';
    const newOrderId = Date.now().toString();
    const newOrderNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));
    
    // Support team initial estimated base price (based on budget range)
    const basePrice = data.budget === 'under-500' ? 2500 : data.budget === '500-1000' ? 4000 : 8500;
    const platformFee = 99;
    const gst = Math.round((basePrice + platformFee) * 0.18);
    const total = basePrice + platformFee + gst;

    const newOrder: Order = {
      id: newOrderId,
      orderNumber: newOrderNumber,
      date: new Date().toISOString(),
      url: null,
      status: 'pending_checkout',
      scheduledDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      scheduledTime: '18:00:00',
      category: categoryDisplay,
      productService: `${service.name} (${categoryDisplay})`,
      orderType: 'Service',
      contentTypeName: 'Service',
      platform: 'custom',
      businessVerified: true,
      username: 'Support Team (Creative Desk)',
      amount: total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      supportStatus: 'Quote Provided - Ready for Checkout',
      notes: `Service request submitted for ${service.name}. Support team has generated a fixed estimate quote ready for review and checkout.`,
      influencer: {
        name: 'Creative Studio (Support Team)',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        category: categoryDisplay,
        location: 'Bangalore, India',
        verified: true,
        followers: [
          { platform: 'Projects Completed', value: '450+' },
          { platform: 'Rating', value: '4.9 ★' },
          { platform: 'Avg Turnaround', value: '3 Days' },
          { platform: 'Specialists', value: '12' },
        ],
      },
      pricing: {
        basePrice,
        platformFee,
        couponDiscount: 0,
        gst,
        total,
      },
      serviceDetails: {
        serviceId: service.id,
        serviceName: service.name,
        category: categoryDisplay,
        clientName: data.name,
        clientEmail: data.email,
        clientPhone: data.phone,
        description: data.description,
        budgetRange: budgetLabels[data.budget] || data.budget,
        timeline: timelineLabels[data.timeline] || data.timeline,
        supportStatus: 'quote_provided',
        supportStatusDisplay: 'Quote Provided - Ready for Checkout',
        assignedSpecialist: {
          name: 'Alex Johnson',
          role: 'Senior Project Specialist',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          email: 'support@influex.com',
        },
        supportReviewNotes: `Support specialist assigned to ${service.name}. Requirements reviewed and price quote fixed at ₹${basePrice.toLocaleString()}. Ready for client checkout.`,
        deliverables: [
          `Complete ${service.name} project execution`,
          'Source files & high-resolution deliverables',
          'Dedicated support manager review',
          '2 Revision rounds included'
        ],
        estimatedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      },
      content: {
        type: 'service_request',
        description: data.description,
      },
      timeline: [
        { step: 'Service Request Sent', timestamp: 'Just now', status: 'completed', description: 'Request submitted with project requirements' },
        { step: 'Support Team Review', timestamp: 'In Progress', status: 'completed', description: 'Specialist reviewing scope of work' },
        { step: 'Pricing Fixed by Support', timestamp: 'Quote Ready', status: 'completed', description: `Price quote fixed at ₹${basePrice.toLocaleString()}` },
        { step: 'Payment & Checkout', timestamp: 'Pending', status: 'current', description: 'Awaiting client checkout' },
        { step: 'Fulfillment & Delivery', timestamp: 'Upcoming', status: 'upcoming', description: 'Production begins post-checkout' },
      ],
    };

    addStoredOrder(newOrder);
    setCreatedOrderId(newOrderId);
    setShowSuccessDialog(true);
    form.reset();
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Request {service.name} Service</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what you need for this service" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="under-500">Under $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                        <SelectItem value="5000-plus">$5,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1-week">Within 1 week</SelectItem>
                        <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="px-0 pt-4">
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5">
                Submit Service Request
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>

      {/* Success Confirmation Modal */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-center">
              Service Request Submitted!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-2 pt-2">
              <p>
                Your request for <span className="font-semibold text-foreground">{service.name}</span> has been logged into our support queue.
              </p>
              <p className="text-xs text-muted-foreground">
                Our support team is reviewing the project scope to finalize the fixed pricing. Once the quote is ready, you can directly proceed to checkout from your Orders dashboard.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowSuccessDialog(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                if (createdOrderId) {
                  navigate(`/orders/${createdOrderId}`);
                } else {
                  navigate('/orders');
                }
              }}
              className="w-full sm:w-auto bg-primary text-primary-foreground flex items-center justify-center gap-1.5"
            >
              View in Orders <ArrowRight className="w-4 h-4" />
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ServiceForm;
