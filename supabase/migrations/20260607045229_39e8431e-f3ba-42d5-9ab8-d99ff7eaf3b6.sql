
-- 1. business_profiles: remove public read
DROP POLICY IF EXISTS "Allow read for all" ON public.business_profiles;

-- 2. user_profiles: remove public read; ensure owner + admin reads remain
DROP POLICY IF EXISTS "Allow read for all" ON public.user_profiles;

-- 3. orders: add owner column + fix broken policies
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid;

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. service_content: replace overly permissive ALL policy
DROP POLICY IF EXISTS "Allow insert and update for all authenticated users" ON public.service_content;

CREATE POLICY "Influencers can insert own service content"
  ON public.service_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = influencer_id);

CREATE POLICY "Influencers can update own service content"
  ON public.service_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = influencer_id)
  WITH CHECK (auth.uid() = influencer_id);

CREATE POLICY "Influencers can delete own service content"
  ON public.service_content FOR DELETE
  TO authenticated
  USING (auth.uid() = influencer_id);

-- 5. service_content_metrics: scope to owning influencer via join
DROP POLICY IF EXISTS "Allow insert and update for all authenticated users" ON public.service_content_metrics;

CREATE POLICY "Influencers can insert own content metrics"
  ON public.service_content_metrics FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.service_content sc
    WHERE sc.id = service_content_metrics.content_id
      AND sc.influencer_id = auth.uid()
  ));

CREATE POLICY "Influencers can update own content metrics"
  ON public.service_content_metrics FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.service_content sc
    WHERE sc.id = service_content_metrics.content_id
      AND sc.influencer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.service_content sc
    WHERE sc.id = service_content_metrics.content_id
      AND sc.influencer_id = auth.uid()
  ));

CREATE POLICY "Influencers can delete own content metrics"
  ON public.service_content_metrics FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.service_content sc
    WHERE sc.id = service_content_metrics.content_id
      AND sc.influencer_id = auth.uid()
  ));

-- 6. login_details: replace exploitable admin check
DROP POLICY IF EXISTS "Admins can view all login details" ON public.login_details;

CREATE POLICY "Admins can view all login details"
  ON public.login_details FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'::user_role
  ));

-- 7. Set fixed search_path on existing functions to prevent hijacking
ALTER FUNCTION public.ensure_user_has_wallet() SET search_path = public;
ALTER FUNCTION public.notify_on_order_status_change() SET search_path = public;
ALTER FUNCTION public.create_post_metrics() SET search_path = public;
ALTER FUNCTION public.process_metrics_update() SET search_path = public;
ALTER FUNCTION public.process_wallet_transaction(uuid, numeric, wallet_transaction_type, uuid, text, jsonb) SET search_path = public;
ALTER FUNCTION public.request_wallet_withdrawal(uuid, numeric, withdrawal_speed, text, jsonb) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
