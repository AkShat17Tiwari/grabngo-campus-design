import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  menu_item_id: number;
  quantity: number;
}

interface PlaceOrderRequest {
  outlet_id: number;
  items: OrderItem[];
  customer_name: string;
  customer_phone: string;
  special_instructions?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Place order function called');
    
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
    const orderData: PlaceOrderRequest = await req.json();
    console.log('Order data received:', orderData);

    // Validate request data
    if (!orderData.outlet_id || !orderData.items || orderData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid order data. outlet_id and items are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!orderData.customer_name || !orderData.customer_phone) {
      return new Response(
        JSON.stringify({ error: 'Customer name and phone are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch menu items to validate and calculate prices
    const menuItemIds = orderData.items.map(item => item.menu_item_id);
    const { data: menuItems, error: menuError } = await supabaseClient
      .from('menu_items')
      .select('id, name, price, in_stock, outlet_id')
      .in('id', menuItemIds);

    if (menuError) {
      console.error('Error fetching menu items:', menuError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch menu items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate all items belong to the same outlet and are in stock
    const invalidItems = menuItems?.filter(
      item => item.outlet_id !== orderData.outlet_id || !item.in_stock
    );

    if (invalidItems && invalidItems.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Some items are not available or do not belong to this outlet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate order total
    let subtotal = 0;
    const orderItems = orderData.items.map(orderItem => {
      const menuItem = menuItems?.find(m => m.id === orderItem.menu_item_id);
      if (!menuItem) {
        throw new Error(`Menu item ${orderItem.menu_item_id} not found`);
      }

      const itemSubtotal = Number(menuItem.price) * orderItem.quantity;
      subtotal += itemSubtotal;

      return {
        menu_item_id: menuItem.id,
        item_name: menuItem.name,
        item_price: menuItem.price,
        quantity: orderItem.quantity,
        subtotal: itemSubtotal,
      };
    });

    // Calculate tax (assuming 5% tax rate)
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    console.log('Order totals calculated:', { subtotal, tax, total });

    // Calculate estimated pickup time (15 minutes from now)
    const estimatedPickupTime = new Date();
    estimatedPickupTime.setMinutes(estimatedPickupTime.getMinutes() + 15);

    // Create the order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        outlet_id: orderData.outlet_id,
        status: 'placed',
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        special_instructions: orderData.special_instructions || null,
        payment_status: 'pending',
        estimated_pickup_time: estimatedPickupTime.toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: orderError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order.id);

    // Insert order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback: delete the order if items creation fails
      await supabaseClient.from('orders').delete().eq('id', order.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items created successfully');

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          total: order.total,
          status: order.status,
          estimated_pickup_time: order.estimated_pickup_time,
        },
        message: 'Order placed successfully',
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
