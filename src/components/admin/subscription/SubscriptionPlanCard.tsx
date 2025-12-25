import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import type { SubscriptionPlan } from './SubscriptionPlanDialog';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
  onDuplicate?: (plan: SubscriptionPlan) => void;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const getPlanTypeLabel = (type: string) => {
    switch (type) {
      case 'business':
        return 'For Business';
      case 'influencer':
        return 'For Influencer';
      case 'both':
        return 'For Business & Influencer';
      default:
        return type;
    }
  };

  return (
    <Card className="border rounded-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xl font-semibold">{plan.name}</h4>
            <p className="text-sm text-muted-foreground">{getPlanTypeLabel(plan.plan_type)}</p>
          </div>
          <div className="flex gap-2">
            {onDuplicate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(plan)}
                title="Duplicate plan"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(plan)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {plan.description && (
          <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium">Pricing</p>
            <div className="flex gap-4 mt-1">
              <span>₹{plan.monthly_price}/month</span>
              <span>₹{plan.yearly_price}/year</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Free Trial</p>
            <p className="mt-1">{plan.free_trial_days || 0} days</p>
          </div>

          <div>
            <p className="text-sm font-medium">Status</p>
            <div className="mt-1">
              <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                {plan.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Tax</p>
            <p className="mt-1">{plan.tax_percentage}%</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">Features</p>
          {plan.features && plan.features.length > 0 ? (
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">No features defined</p>
          )}
        </div>

        {plan.limits && Object.keys(plan.limits).length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Limits & Commission</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {plan.limits.notes_buy_limit !== undefined && (
                <p className="text-sm">
                  Notes Buy: <span className="font-medium">{plan.limits.notes_buy_limit}</span>
                </p>
              )}
              {plan.limits.notes_create_limit !== undefined && (
                <p className="text-sm">
                  Notes Create: <span className="font-medium">{plan.limits.notes_create_limit}</span>
                </p>
              )}
              {plan.limits.meetings_booking_limit !== undefined && (
                <p className="text-sm">
                  Meetings: <span className="font-medium">{plan.limits.meetings_booking_limit}</span>
                </p>
              )}
              {plan.limits.commission_percentage !== undefined && (
                <p className="text-sm">
                  Commission: <span className="font-medium">{plan.limits.commission_percentage}%</span>
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlanCard;
