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
import { Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Types
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
  limits: {
    notes_buy_limit?: number;
    notes_create_limit?: number;
    meetings_booking_limit?: number;
    commission_percentage?: number;
  };
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
  notes_buy_limit: z.number().min(0).optional(),
  notes_create_limit: z.number().min(0).optional(),
  meetings_booking_limit: z.number().min(0).optional(),
  commission_percentage: z.number().min(0).max(100).optional(),
});

type PlanFormData = z.infer<typeof planFormSchema>;

interface SubscriptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: SubscriptionPlan | null;
  onSuccess: () => void;
}

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
      notes_buy_limit: 0,
      notes_create_limit: 0,
      meetings_booking_limit: 0,
      commission_percentage: 0,
    },
  });

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
        notes_buy_limit: plan.limits?.notes_buy_limit || 0,
        notes_create_limit: plan.limits?.notes_create_limit || 0,
        meetings_booking_limit: plan.limits?.meetings_booking_limit || 0,
        commission_percentage: plan.limits?.commission_percentage || 0,
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
        notes_buy_limit: 0,
        notes_create_limit: 0,
        meetings_booking_limit: 0,
        commission_percentage: 0,
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
        limits: {
          notes_buy_limit: data.notes_buy_limit || 0,
          notes_create_limit: data.notes_create_limit || 0,
          meetings_booking_limit: data.meetings_booking_limit || 0,
          commission_percentage: data.commission_percentage || 0,
        },
        updated_by: userId,
      };

      if (isEditing && plan) {
        // Update existing plan with version increment
        const { error } = await supabase
          .from('subscription_plans')
          .update({
            ...planData,
            version: (plan as any).version ? (plan as any).version + 1 : 1,
          })
          .eq('id', plan.id);

        if (error) throw error;

        // Log audit
        await (supabase.from('plan_audit_logs') as any).insert({
          plan_id: plan.id,
          action: 'update',
          changes: { before: plan, after: planData },
          performed_by: userId,
        });

        toast.success('Plan updated successfully');
      } else {
        // Create new plan
        const { data: newPlan, error } = await supabase
          .from('subscription_plans')
          .insert({
            ...planData,
            created_by: userId,
          })
          .select()
          .single();

        if (error) throw error;

        // Log audit
        if (newPlan) {
          await (supabase.from('plan_audit_logs') as any).insert({
            plan_id: newPlan.id,
            action: 'create',
            changes: { created: planData },
            performed_by: userId,
          });
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
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the subscription plan details. Changes will not affect existing subscriptions.'
              : 'Create a new subscription plan for your users.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Basic Information
                </h3>
                <Separator />

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
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Pricing & Billing
                </h3>
                <Separator />

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
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Features
                </h3>
                <Separator />

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
              </div>

              {/* Limits */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Limits & Commission
                </h3>
                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="notes_buy_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes Buy Limit</FormLabel>
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
                    name="notes_create_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes Create Limit</FormLabel>
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
                    name="meetings_booking_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meetings Booking Limit</FormLabel>
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
                    name="commission_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission (%)</FormLabel>
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
              </div>
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
