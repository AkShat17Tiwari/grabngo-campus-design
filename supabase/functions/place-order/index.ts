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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const orderData: PlaceOrderRequest = await req.json();
    console.log('Order request:', JSON.stringify(orderData));

    if (!orderData.outlet_id || !orderData.items || orderData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: outlet_id and items are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch menu items to validate and get prices
    const menuItemIds = orderData.items.map(item => item.menu_item_id);
    const { data: menuItems, error: menuError } = await supabaseClient
      .from('menu_items')
      .select('id, name, price, is_available, outlet_id')
      .in('id', menuItemIds);

    if (menuError) {
      console.error('Error fetching menu items:', menuError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch menu items', details: menuError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!menuItems || menuItems.length !== menuItemIds.length) {
      return new Response(
        JSON.stringify({ error: 'One or more menu items not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate all items belong to the outlet and are available
    const invalidItems = menuItems.filter(item => 
      item.outlet_id !== orderData.outlet_id || !item.is_available
    );
    if (invalidItems.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Some items are unavailable or do not belong to this outlet',
          items: invalidItems.map(item => item.name)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = orderData.items.map(orderItem => {
      const menuItem = menuItems.find(mi => mi.id === orderItem.menu_item_id)!;
      const itemSubtotal = Number(menuItem.price) * orderItem.quantity;
      subtotal += itemSubtotal;

      return {
        menu_item_id: orderItem.menu_item_id,
        item_name: menuItem.name,
        item_price: Number(menuItem.price),
        quantity: orderItem.quantity,
        subtotal: itemSubtotal
      };
    });

    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    // Calculate pickup time using database function
    const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
    const { data: pickupTimeData, error: pickupError } = await supabaseClient
      .rpc('calculate_pickup_time', {
        _outlet_id: orderData.outlet_id,
        _items_count: totalItems
      });

    if (pickupError) {
      console.error('Error calculating pickup time:', pickupError);
    }

    const scheduledPickupSlot = pickupTimeData || new Date(Date.now() + 30 * 60000).toISOString();

    // Initialize Razorpay via API
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || '';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
    
    // Create Razorpay order via API
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`
      },
      body: JSON.stringify({
        amount: Math.round(total * 100), // Amount in paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          user_id: user.id,
          outlet_id: orderData.outlet_id.toString(),
        }
      })
    });

    if (!razorpayResponse.ok) {
      const error = await razorpayResponse.text();
      console.error('Razorpay API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment order', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const razorpayOrder = await razorpayResponse.json();
    console.log('Razorpay order created:', razorpayOrder.id);

    // Create order in database with pending_payment status
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        outlet_id: orderData.outlet_id,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        special_instructions: orderData.special_instructions,
        subtotal,
        tax,
        total,
        status: 'pending_payment',
        payment_status: 'pending',
        payment_id: razorpayOrder.id,
        scheduled_pickup_slot: scheduledPickupSlot,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: orderError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error('Error inserting order items:', itemsError);
      // Rollback: delete the order
      await supabaseClient.from('orders').delete().eq('id', order.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create order items', details: itemsError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Order created successfully: ${order.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: order.id,
        razorpay_order_id: razorpayOrder.id,
        razorpay_key_id: razorpayKeyId,
        amount: Math.round(total * 100),
        currency: 'INR',
        scheduled_pickup_slot: scheduledPickupSlot,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in place-order function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});