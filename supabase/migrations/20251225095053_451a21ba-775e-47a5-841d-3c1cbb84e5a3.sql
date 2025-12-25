-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('business', 'influencer', 'both')),
  monthly_price NUMERIC NOT NULL DEFAULT 0 CHECK (monthly_price >= 0),
  yearly_price NUMERIC NOT NULL DEFAULT 0 CHECK (yearly_price >= 0),
  free_trial_days INTEGER DEFAULT 0 CHECK (free_trial_days >= 0),
  tax_percentage NUMERIC NOT NULL DEFAULT 18 CHECK (tax_percentage >= 0 AND tax_percentage <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  payment_gateway_id TEXT,
  auto_renewal BOOLEAN DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create plan_audit_logs table for tracking changes
CREATE TABLE public.plan_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  changes JSONB DEFAULT '{}'::jsonb,
  performed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Admin can manage all subscription plans
CREATE POLICY "Admins can manage subscription plans"
ON public.subscription_plans
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'::user_role
  )
);

-- Public can read active non-deleted plans
CREATE POLICY "Public can view active subscription plans"
ON public.subscription_plans
FOR SELECT
USING (status = 'active' AND is_deleted = false);

-- Enable RLS on plan_audit_logs
ALTER TABLE public.plan_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin can view all audit logs
CREATE POLICY "Admins can view plan audit logs"
ON public.plan_audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'::user_role
  )
);

-- Admin can insert audit logs
CREATE POLICY "Admins can insert plan audit logs"
ON public.plan_audit_logs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'::user_role
  )
);

-- Create trigger to update updated_at column
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.subscription_plans (name, plan_type, monthly_price, yearly_price, free_trial_days, tax_percentage, status, features, limits, description)
VALUES 
  (
    'Basic Plan',
    'business',
    999,
    9990,
    14,
    18,
    'active',
    '["Basic analytics", "10 requests/month", "Email support"]'::jsonb,
    '{"notes_buy_limit": 10, "notes_create_limit": 5, "meetings_booking_limit": 3, "commission_percentage": 10}'::jsonb,
    'Perfect for small businesses getting started'
  ),
  (
    'Pro Plan',
    'business',
    2999,
    29990,
    7,
    18,
    'active',
    '["Advanced analytics", "Unlimited requests", "Priority support", "Custom reports"]'::jsonb,
    '{"notes_buy_limit": 100, "notes_create_limit": 50, "meetings_booking_limit": 20, "commission_percentage": 5}'::jsonb,
    'Ideal for growing businesses'
  ),
  (
    'Influencer Plus',
    'influencer',
    1499,
    14990,
    14,
    18,
    'active',
    '["Campaign insights", "Business connections", "Verification badge"]'::jsonb,
    '{"notes_buy_limit": 50, "notes_create_limit": 25, "meetings_booking_limit": 10, "commission_percentage": 8}'::jsonb,
    'Premium features for professional influencers'
  );