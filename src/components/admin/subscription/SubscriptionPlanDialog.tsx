import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, X, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface PlanLimits {
  orders_per_user_type?: 'no_limit' | 'upto' | 'between' | 'above';
  orders_per_user_min?: number;
  orders_per_user_max?: number;
  analytics_level?: 'na' | 'limited' | 'advanced' | 'full';
  analytics_duration_days?: number;
  followers_range?: string;
  platform_fee_percentage?: number;
  affiliate_links?: boolean;
  data_update_frequency?: 'na' | 'every_4_6_hours' | 'every_3_4_hours' | 'realtime';
  influencer_outreach_chats?: number;
  reports_type?: 'summary' | 'detailed' | 'custom';
  ad_spend_tracking?: 'na' | 'limited' | 'advanced' | 'full';
  support_type?: 'normal' | 'email_limited' | 'priority_email' | 'priority_24_7';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  plan_type: 'business' | 'influencer' | 'both';
  monthly_price: number;
  yearly_price: number;
  free_trial_days: number;
  tax_percentage: number;
  status: 'active' | 'inactive';
  features: string[];
  limits: PlanLimits;
  description?: string;
  payment_gateway_id?: string;
  auto_renewal?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Form schema
const planFormSchema = z.object({
  name: z.string().min(2, 'Plan name must be at least 2 characters'),
  plan_type: z.enum(['business', 'influencer', 'both']),
  monthly_price: z.number().min(0, 'Price must be positive'),
  yearly_price: z.number().min(0, 'Price must be positive'),
  free_trial_days: z.number().min(0, 'Trial days must be positive').optional(),
  tax_percentage: z.number().min(0).max(100, 'Tax must be between 0 and 100'),
  status: z.enum(['active', 'inactive']),
  description: z.string().optional(),
  // New Influence Connect limits
  orders_per_user_type: z.enum(['no_limit', 'upto', 'between', 'above']).optional(),
  orders_per_user_min: z.number().min(0).optional(),
  orders_per_user_max: z.number().min(0).optional(),
  analytics_level: z.enum(['na', 'limited', 'advanced', 'full']).optional(),
  analytics_duration_days: z.number().min(0).optional(),
  followers_range: z.string().optional(),
  platform_fee_percentage: z.number().min(0).max(100).optional(),
  affiliate_links: z.boolean().optional(),
  data_update_frequency: z.enum(['na', 'every_4_6_hours', 'every_3_4_hours', 'realtime']).optional(),
  influencer_outreach_chats: z.number().min(0).optional(),
  reports_type: z.enum(['summary', 'detailed', 'custom']).optional(),
  ad_spend_tracking: z.enum(['na', 'limited', 'advanced', 'full']).optional(),
  support_type: z.enum(['normal', 'email_limited', 'priority_email', 'priority_24_7']).optional(),
});

type PlanFormData = z.infer<typeof planFormSchema>;

interface SubscriptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: SubscriptionPlan | null;
  onSuccess: () => void;
}

// Collapsible section component
const CollapsibleSection: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>
      <Separator />
      <CollapsibleContent className="space-y-4 pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const SubscriptionPlanDialog: React.FC<SubscriptionPlanDialogProps> = ({
  open,
  onOpenChange,
  plan,
  onSuccess,
}) => {
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!plan;

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: '',
      plan_type: 'business',
      monthly_price: 0,
      yearly_price: 0,
      free_trial_days: 0,
      tax_percentage: 18,
      status: 'active',
      description: '',
      orders_per_user_type: 'no_limit',
      orders_per_user_min: 0,
      orders_per_user_max: 0,
      analytics_level: 'na',
      analytics_duration_days: 0,
      followers_range: '1K – 5K',
      platform_fee_percentage: 9,
      affiliate_links: false,
      data_update_frequency: 'na',
      influencer_outreach_chats: 0,
      reports_type: 'summary',
      ad_spend_tracking: 'na',
      support_type: 'normal',
    },
  });

  const ordersPerUserType = form.watch('orders_per_user_type');
  const analyticsLevel = form.watch('analytics_level');

  // Pre-fill form when editing
  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        plan_type: plan.plan_type,
        monthly_price: plan.monthly_price,
        yearly_price: plan.yearly_price,
        free_trial_days: plan.free_trial_days || 0,
        tax_percentage: plan.tax_percentage,
        status: plan.status,
        description: plan.description || '',
        orders_per_user_type: plan.limits?.orders_per_user_type || 'no_limit',
        orders_per_user_min: plan.limits?.orders_per_user_min || 0,
        orders_per_user_max: plan.limits?.orders_per_user_max || 0,
        analytics_level: plan.limits?.analytics_level || 'na',
        analytics_duration_days: plan.limits?.analytics_duration_days || 0,
        followers_range: plan.limits?.followers_range || '1K – 5K',
        platform_fee_percentage: plan.limits?.platform_fee_percentage || 9,
        affiliate_links: plan.limits?.affiliate_links || false,
        data_update_frequency: plan.limits?.data_update_frequency || 'na',
        influencer_outreach_chats: plan.limits?.influencer_outreach_chats || 0,
        reports_type: plan.limits?.reports_type || 'summary',
        ad_spend_tracking: plan.limits?.ad_spend_tracking || 'na',
        support_type: plan.limits?.support_type || 'normal',
      });
      setFeatures(plan.features || []);
    } else {
      form.reset({
        name: '',
        plan_type: 'business',
        monthly_price: 0,
        yearly_price: 0,
        free_trial_days: 0,
        tax_percentage: 18,
        status: 'active',
        description: '',
        orders_per_user_type: 'no_limit',
        orders_per_user_min: 0,
        orders_per_user_max: 0,
        analytics_level: 'na',
        analytics_duration_days: 0,
        followers_range: '1K – 5K',
        platform_fee_percentage: 9,
        affiliate_links: false,
        data_update_frequency: 'na',
        influencer_outreach_chats: 0,
        reports_type: 'summary',
        ad_spend_tracking: 'na',
        support_type: 'normal',
      });
      setFeatures([]);
    }
  }, [plan, form, open]);

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PlanFormData) => {
    if (features.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      const planLimits: PlanLimits = {
        orders_per_user_type: data.orders_per_user_type,
        orders_per_user_min: data.orders_per_user_min || 0,
        orders_per_user_max: data.orders_per_user_max || 0,
        analytics_level: data.analytics_level,
        analytics_duration_days: data.analytics_duration_days || 0,
        followers_range: data.followers_range,
        platform_fee_percentage: data.platform_fee_percentage || 0,
        affiliate_links: data.affiliate_links || false,
        data_update_frequency: data.data_update_frequency,
        influencer_outreach_chats: data.influencer_outreach_chats || 0,
        reports_type: data.reports_type,
        ad_spend_tracking: data.ad_spend_tracking,
        support_type: data.support_type,
      };

      const planData = {
        name: data.name,
        plan_type: data.plan_type,
        monthly_price: data.monthly_price,
        yearly_price: data.yearly_price,
        free_trial_days: data.free_trial_days || 0,
        tax_percentage: data.tax_percentage,
        status: data.status,
        description: data.description || null,
        features: features,
        limits: planLimits as unknown as Record<string, unknown>,
        updated_by: userId,
      };

      if (isEditing && plan) {
        // Update existing plan with version increment
        const { error } = await supabase
          .from('subscription_plans')
          .update({
            ...planData,
            version: (plan as any).version ? (plan as any).version + 1 : 1,
          } as any)
          .eq('id', plan.id);

        if (error) throw error;

        // Log audit
        await (supabase.from('plan_audit_logs') as any).insert([{
          plan_id: plan.id,
          action: 'update',
          changes: { before: plan, after: planData },
          performed_by: userId,
        }]);

        toast.success('Plan updated successfully');
      } else {
        // Create new plan
        const { data: newPlan, error } = await supabase
          .from('subscription_plans')
          .insert({
            ...planData,
            created_by: userId,
          } as any)
          .select()
          .single();

        if (error) throw error;

        // Log audit
        if (newPlan) {
          await (supabase.from('plan_audit_logs') as any).insert([{
            plan_id: newPlan.id,
            action: 'create',
            changes: { created: planData },
            performed_by: userId,
          }]);
        }

        toast.success('Plan created successfully');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving plan:', error);
      toast.error(error.message || 'Failed to save plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the subscription plan details. Changes will not affect existing subscriptions.'
              : 'Create a new subscription plan for your users.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <CollapsibleSection title="Basic Information">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Pro Plan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plan_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="influencer">Influencer</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of this plan..."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleSection>

              {/* Pricing */}
              <CollapsibleSection title="Pricing & Billing">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="monthly_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Price (₹) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Enter 0 for Pay-as-You-Go plans</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearly_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yearly Price (₹) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="free_trial_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Free Trial (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tax_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Percentage (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleSection>

              {/* Features */}
              <CollapsibleSection title="Features">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {features.length === 0 && (
                    <p className="text-sm text-muted-foreground">No features added yet</p>
                  )}

                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>

              {/* Order Limits */}
              <CollapsibleSection title="Order Limits">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="orders_per_user_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orders per User</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select limit type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no_limit">No limit</SelectItem>
                            <SelectItem value="upto">Upto X orders</SelectItem>
                            <SelectItem value="between">Between X – Y orders</SelectItem>
                            <SelectItem value="above">Above X orders</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Define how many orders users can place</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(ordersPerUserType === 'upto' || ordersPerUserType === 'above') && (
                    <FormField
                      control={form.control}
                      name="orders_per_user_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {ordersPerUserType === 'upto' ? 'Maximum Orders' : 'Minimum Orders'}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder={ordersPerUserType === 'upto' ? 'e.g., 15' : 'e.g., 30'}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {ordersPerUserType === 'between' && (
                    <>
                      <FormField
                        control={form.control}
                        name="orders_per_user_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Orders</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="e.g., 11"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="orders_per_user_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Orders</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="e.g., 30"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CollapsibleSection>

              {/* Analytics Access */}
              <CollapsibleSection title="Analytics Access">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="analytics_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Analytics Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select analytics level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="na">NA</SelectItem>
                            <SelectItem value="limited">Limited Analytics</SelectItem>
                            <SelectItem value="advanced">Advanced Analytics</SelectItem>
                            <SelectItem value="full">Full Analytics</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Level of analytics access for users</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {analyticsLevel && analyticsLevel !== 'na' && (
                    <FormField
                      control={form.control}
                      name="analytics_duration_days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Analytics Duration per Order (days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="e.g., 12, 28, 90"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>How long analytics are available per order</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CollapsibleSection>

              {/* Followers Range & Platform Fee */}
              <CollapsibleSection title="Followers & Platform Fee">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="followers_range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Followers Range</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select followers range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1K – 5K">1K – 5K</SelectItem>
                            <SelectItem value="5K – 50K">5K – 50K</SelectItem>
                            <SelectItem value="50K – 500K">50K – 500K</SelectItem>
                            <SelectItem value="500K+">500K+ (Negotiable)</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Eligible influencer followers range</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="platform_fee_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Fee per Order (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="e.g., 9, 6, 5, 3"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Commission charged per order</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleSection>

              {/* Affiliate & Data Features */}
              <CollapsibleSection title="Affiliate & Data Features">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="affiliate_links"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Affiliate Links</FormLabel>
                          <FormDescription>Allow users to create affiliate links</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data_update_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Update Frequency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="na">NA</SelectItem>
                            <SelectItem value="every_4_6_hours">Every 4-6 hours</SelectItem>
                            <SelectItem value="every_3_4_hours">Every 3-4 hours</SelectItem>
                            <SelectItem value="realtime">Realtime Update</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How often data is refreshed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleSection>

              {/* Influencer Outreach */}
              <CollapsibleSection title="Influencer Outreach">
                <FormField
                  control={form.control}
                  name="influencer_outreach_chats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Influencer Outreach (Chats per month)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="e.g., 5, 15, 25 (0 for NA, -1 for Unlimited)"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of chat initiations allowed per month. Enter 0 for NA, -1 for Unlimited.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleSection>

              {/* Reports Access */}
              <CollapsibleSection title="Reports Access">
                <FormField
                  control={form.control}
                  name="reports_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reports Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reports type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="summary">Summary reports only</SelectItem>
                          <SelectItem value="detailed">Detailed reports with trends</SelectItem>
                          <SelectItem value="custom">Custom reports with advanced visualizations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Type of reports users can access</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleSection>

              {/* Ad Spend Tracking */}
              <CollapsibleSection title="Ad Spend Tracking">
                <FormField
                  control={form.control}
                  name="ad_spend_tracking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Spend Tracking Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tracking level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="na">NA</SelectItem>
                          <SelectItem value="limited">Limited tracking (basic metrics)</SelectItem>
                          <SelectItem value="advanced">Advanced tracking (spend vs performance)</SelectItem>
                          <SelectItem value="full">Full tracking with cost-per-result breakdown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Level of ad spend tracking available</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleSection>

              {/* Support Level */}
              <CollapsibleSection title="Support Level">
                <FormField
                  control={form.control}
                  name="support_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select support type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal Support</SelectItem>
                          <SelectItem value="email_limited">Email support + limited live chats</SelectItem>
                          <SelectItem value="priority_email">Priority email support + live chats</SelectItem>
                          <SelectItem value="priority_24_7">24/7 priority support (phone, email, live chat)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Level of customer support provided</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleSection>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPlanDialog;
