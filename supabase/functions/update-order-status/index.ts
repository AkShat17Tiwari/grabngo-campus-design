import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateStatusRequest {
  order_id: string;
  new_status: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Update order status function called');
    
    // Create Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const { order_id, new_status }: UpdateStatusRequest = await req.json();
    console.log('Update request:', { order_id, new_status });

    // Validate request data
    if (!order_id || !new_status) {
      return new Response(
        JSON.stringify({ error: 'order_id and new_status are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate status value
    const validStatuses = ['placed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(new_status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status value' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the order to verify ownership
    const { data: order, error: fetchError } = await supabaseClient
      .from('orders')
      .select('id, outlet_id, status, user_id')
      .eq('id', order_id)
      .single();

    if (fetchError || !order) {
      console.error('Error fetching order:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order found:', order);

    // Check if user is vendor staff for this outlet
    const { data: userRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role, outlet_id')
      .eq('user_id', user.id)
      .eq('role', 'vendor_staff')
      .eq('outlet_id', order.outlet_id)
      .maybeSingle();

    if (roleError) {
      console.error('Error checking user role:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is the customer who placed the order (for cancellations only)
    const isCustomer = order.user_id === user.id;
    const isVendorStaff = userRole !== null;

    // Authorization logic:
    // - Vendor staff can update to any status for their outlet
    // - Customers can only cancel their own orders
    if (!isVendorStaff) {
      if (!isCustomer) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: You do not have permission to update this order' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Customers can only cancel
      if (new_status !== 'cancelled') {
        return new Response(
          JSON.stringify({ error: 'Customers can only cancel orders' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Customers can only cancel orders that are 'placed' or 'preparing'
      if (!['placed', 'preparing'].includes(order.status)) {
        return new Response(
          JSON.stringify({ error: 'Cannot cancel order in current status' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Authorization check passed. Updating order status...');

    // Update the order status
    const { data: updatedOrder, error: updateError } = await supabaseClient
      .from('orders')
      .update({ status: new_status })
      .eq('id', order_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update order status', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order status updated successfully:', updatedOrder);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        order: updatedOrder,
        message: `Order status updated to ${new_status}`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
