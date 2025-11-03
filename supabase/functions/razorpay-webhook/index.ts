import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!webhookSecret) {
      console.error('Razorpay webhook secret not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify webhook signature
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      console.error('Missing Razorpay signature');
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    
    // Create HMAC signature using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(webhookSecret);
    const bodyData = encoder.encode(body);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, bodyData);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignature) {
      console.error('Invalid Razorpay signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = JSON.parse(body);
    console.log('Razorpay webhook event:', payload.event);

    // Create Supabase admin client (service role for webhook)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle payment success
    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const amountPaid = paymentEntity.amount / 100; // Convert from paise to INR

      console.log(`Payment captured - Order: ${razorpayOrderId}, Payment: ${paymentId}, Amount: ${amountPaid}`);

      // Find the order with this Razorpay order ID
      const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('id, total, status')
        .eq('payment_id', razorpayOrderId)
        .single();

      if (fetchError || !order) {
        console.error('Order not found for payment:', razorpayOrderId, fetchError);
        return new Response(
          JSON.stringify({ error: 'Order not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify amount matches
      if (Math.abs(order.total - amountPaid) > 0.01) {
        console.error(`Amount mismatch - Expected: ${order.total}, Paid: ${amountPaid}`);
        return new Response(
          JSON.stringify({ error: 'Amount mismatch' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update order status to 'placed' and payment status to 'completed'
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'placed',
          payment_status: 'completed',
          payment_id: paymentId, // Update with actual payment ID
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Error updating order:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Order ${order.id} updated to 'placed' status`);

      return new Response(
        JSON.stringify({ success: true, message: 'Payment processed successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle payment failure
    if (payload.event === 'payment.failed') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;

      console.log(`Payment failed - Order: ${razorpayOrderId}`);

      // Update order payment status to 'failed'
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'failed',
        })
        .eq('payment_id', razorpayOrderId);

      if (updateError) {
        console.error('Error updating order payment status:', updateError);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Payment failure recorded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For other events, just acknowledge
    console.log('Webhook event acknowledged:', payload.event);
    return new Response(
      JSON.stringify({ success: true, message: 'Event received' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in razorpay-webhook function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});