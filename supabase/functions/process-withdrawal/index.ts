
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { withdrawalId, action } = await req.json();
    
    // Validate required fields
    if (!withdrawalId || typeof withdrawalId !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid withdrawal ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get auth user from request to check if admin
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    // Get the user from the auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Admin access required." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase admin client with service role key to bypass RLS
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // First, get the withdrawal request details
    const { data: withdrawal, error: withdrawalError } = await adminSupabase
      .from('wallet_withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();

    if (withdrawalError || !withdrawal) {
      return new Response(
        JSON.stringify({ error: "Withdrawal request not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (withdrawal.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: `Withdrawal already ${withdrawal.status}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process the action
    if (action === 'approve') {
      // Update withdrawal status
      const { error: updateError } = await adminSupabase
        .from('wallet_withdrawals')
        .update({ 
          status: 'approved',
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to approve withdrawal" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Add notification for the user
      await adminSupabase
        .from('notifications')
        .insert({
          user_id: withdrawal.user_id,
          title: 'Withdrawal Approved',
          message: `Your withdrawal request for ₹${withdrawal.amount} has been approved and is being processed.`,
          type: 'wallet_transaction',
          related_id: withdrawalId
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Withdrawal approved successfully"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (action === 'reject') {
      // Update withdrawal status
      const { error: updateError } = await adminSupabase
        .from('wallet_withdrawals')
        .update({ 
          status: 'rejected',
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to reject withdrawal" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Return funds to user's wallet
      const { error: refundError } = await adminSupabase.rpc('process_wallet_transaction', {
        p_user_id: withdrawal.user_id,
        p_amount: withdrawal.amount,
        p_transaction_type: 'refund',
        p_reference_id: withdrawalId,
        p_description: 'Withdrawal request rejected - funds returned to wallet',
        p_metadata: { 
          withdrawal_id: withdrawalId,
          rejected_at: new Date().toISOString(),
          rejected_by: user.id
        }
      });

      if (refundError) {
        return new Response(
          JSON.stringify({ error: "Failed to return funds to wallet" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Add notification for the user
      await adminSupabase
        .from('notifications')
        .insert({
          user_id: withdrawal.user_id,
          title: 'Withdrawal Rejected',
          message: `Your withdrawal request for ₹${withdrawal.amount} has been rejected. The funds have been returned to your wallet.`,
          type: 'wallet_transaction',
          related_id: withdrawalId
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Withdrawal rejected and funds returned to wallet"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // This should not happen given our validation above
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
