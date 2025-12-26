import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import type { SubscriptionPlan, PlanLimits } from './SubscriptionPlanDialog';

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

  const getOrdersDisplay = (limits: PlanLimits) => {
    if (!limits.orders_per_user_type || limits.orders_per_user_type === 'no_limit') return 'No limit';
    if (limits.orders_per_user_type === 'upto') return `Upto ${limits.orders_per_user_max}`;
    if (limits.orders_per_user_type === 'between') return `${limits.orders_per_user_min} – ${limits.orders_per_user_max}`;
    if (limits.orders_per_user_type === 'above') return `Above ${limits.orders_per_user_max}`;
    return 'N/A';
  };

  const getAnalyticsDisplay = (limits: PlanLimits) => {
    const levelMap: Record<string, string> = {
      na: 'NA',
      limited: 'Limited Analytics',
      advanced: 'Advanced Analytics',
      full: 'Full Analytics',
    };
    return levelMap[limits.analytics_level || 'na'] || 'NA';
  };

  const getDataFrequencyDisplay = (limits: PlanLimits) => {
    const freqMap: Record<string, string> = {
      na: 'NA',
      every_4_6_hours: 'Every 4-6 hours',
      every_3_4_hours: 'Every 3-4 hours',
      realtime: 'Realtime',
    };
    return freqMap[limits.data_update_frequency || 'na'] || 'NA';
  };

  const getReportsDisplay = (limits: PlanLimits) => {
    const reportsMap: Record<string, string> = {
      summary: 'Summary reports only',
      detailed: 'Detailed reports with trends',
      custom: 'Custom reports',
    };
    return reportsMap[limits.reports_type || 'summary'] || 'Summary reports';
  };

  const getAdTrackingDisplay = (limits: PlanLimits) => {
    const trackingMap: Record<string, string> = {
      na: 'NA',
      limited: 'Limited tracking',
      advanced: 'Advanced tracking',
      full: 'Full tracking',
    };
    return trackingMap[limits.ad_spend_tracking || 'na'] || 'NA';
  };

  const getSupportDisplay = (limits: PlanLimits) => {
    const supportMap: Record<string, string> = {
      normal: 'Normal Support',
      email_limited: 'Email + limited chats',
      priority_email: 'Priority email + chats',
      priority_24_7: '24/7 Priority',
    };
    return supportMap[limits.support_type || 'normal'] || 'Normal Support';
  };

  const getOutreachDisplay = (limits: PlanLimits) => {
    const chats = limits.influencer_outreach_chats;
    if (chats === undefined || chats === 0) return 'NA';
    if (chats === -1) return 'Unlimited';
    return `${chats} chats/month`;
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
              <span>{plan.monthly_price > 0 ? `₹${plan.monthly_price}/month` : 'Pay-as-You-Go'}</span>
              {plan.yearly_price > 0 && <span>₹{plan.yearly_price}/year</span>}
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
            <p className="text-sm font-medium mb-2">Plan Configuration</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Orders per User</p>
                <p className="text-sm font-medium">{getOrdersDisplay(plan.limits)}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Analytics</p>
                <p className="text-sm font-medium">{getAnalyticsDisplay(plan.limits)}</p>
              </div>
              {plan.limits.analytics_level && plan.limits.analytics_level !== 'na' && (
                <div className="bg-muted/50 rounded-md p-2">
                  <p className="text-xs text-muted-foreground">Analytics Duration</p>
                  <p className="text-sm font-medium">{plan.limits.analytics_duration_days || 0} days</p>
                </div>
              )}
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Followers Range</p>
                <p className="text-sm font-medium">{plan.limits.followers_range || 'N/A'}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Platform Fee</p>
                <p className="text-sm font-medium">{plan.limits.platform_fee_percentage || 0}%</p>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Affiliate Links</p>
                <p className="text-sm font-medium">{plan.limits.affiliate_links ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Data Updates</p>
                <p className="text-sm font-medium">{getDataFrequencyDisplay(plan.limits)}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Outreach</p>
                <p className="text-sm font-medium">{getOutreachDisplay(plan.limits)}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Reports</p>
                <p className="text-sm font-medium">{getReportsDisplay(plan.limits)}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Ad Tracking</p>
                <p className="text-sm font-medium">{getAdTrackingDisplay(plan.limits)}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <p className="text-xs text-muted-foreground">Support</p>
                <p className="text-sm font-medium">{getSupportDisplay(plan.limits)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlanCard;
