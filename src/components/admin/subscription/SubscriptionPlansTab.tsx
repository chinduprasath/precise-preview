import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import SubscriptionPlanDialog, { SubscriptionPlan } from './SubscriptionPlanDialog';
import SubscriptionPlanCard from './SubscriptionPlanCard';

const SubscriptionPlansTab: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match our interface
      const transformedPlans: SubscriptionPlan[] = (data || []).map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        plan_type: plan.plan_type as 'business' | 'influencer' | 'both',
        monthly_price: plan.monthly_price,
        yearly_price: plan.yearly_price,
        free_trial_days: plan.free_trial_days || 0,
        tax_percentage: plan.tax_percentage,
        status: plan.status as 'active' | 'inactive',
        features: Array.isArray(plan.features) ? plan.features : [],
        limits: typeof plan.limits === 'object' ? plan.limits : {},
        description: plan.description,
        payment_gateway_id: plan.payment_gateway_id,
        auto_renewal: plan.auto_renewal,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
      }));

      setPlans(transformedPlans);
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setDialogOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleDeleteClick = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    setIsDeleting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      // Soft delete - mark as deleted instead of actually deleting
      const { error } = await supabase
        .from('subscription_plans')
        .update({ is_deleted: true, updated_by: userId })
        .eq('id', planToDelete.id);

      if (error) throw error;

      // Log audit
      await (supabase.from('plan_audit_logs') as any).insert({
        plan_id: planToDelete.id,
        action: 'delete',
        changes: { deleted_plan: planToDelete },
        performed_by: userId,
      });

      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleDuplicatePlan = (plan: SubscriptionPlan) => {
    // Create a copy without id and with modified name
    const duplicatePlan: SubscriptionPlan = {
      ...plan,
      id: '',
      name: `${plan.name} (Copy)`,
      status: 'inactive' as const,
    };
    setSelectedPlan(duplicatePlan);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Manage subscription plans available to users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Available Plans</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage subscription plans.
              </p>
            </div>
            <Button onClick={handleAddPlan}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Plan
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No subscription plans found.</p>
              <Button variant="outline" className="mt-4" onClick={handleAddPlan}>
                Create your first plan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeleteClick}
                  onDuplicate={handleDuplicatePlan}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SubscriptionPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={selectedPlan?.id ? selectedPlan : null}
        onSuccess={fetchPlans}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{planToDelete?.name}"? This action will soft-delete
              the plan. Existing subscriptions will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SubscriptionPlansTab;
