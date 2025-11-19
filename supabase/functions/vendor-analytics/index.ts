import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is vendor
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role, outlet_id')
      .eq('user_id', user.id)
      .single();

    if (roleError || roleData?.role !== 'vendor_staff' || !roleData.outlet_id) {
      return new Response(JSON.stringify({ error: 'Forbidden - Vendor access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const outletId = roleData.outlet_id;
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    const period = url.searchParams.get('period') || 'daily';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'daily') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'weekly') {
      startDate.setDate(now.getDate() - 28);
    } else if (period === 'monthly') {
      startDate.setMonth(now.getMonth() - 6);
    }

    if (endpoint === 'summary') {
      const { data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('total, status, created_at')
        .eq('outlet_id', outletId)
        .gte('created_at', startDate.toISOString());

      if (ordersError) throw ordersError;

      const totalOrders = orders?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'placed' || o.status === 'preparing').length || 0;
      const totalRevenue = orders?.filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + Number(o.total), 0) || 0;

      return new Response(
        JSON.stringify({
          totalOrders,
          completedOrders,
          pendingOrders,
          totalRevenue,
          averageOrderValue: completedOrders > 0 ? totalRevenue / completedOrders : 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (endpoint === 'top-items') {
      const { data: topItems, error: itemsError } = await supabaseClient
        .from('order_items')
        .select('item_name, item_price, quantity, order_id, orders!inner(status, created_at, outlet_id)')
        .eq('orders.outlet_id', outletId)
        .gte('orders.created_at', startDate.toISOString())
        .eq('orders.status', 'completed');

      if (itemsError) throw itemsError;

      const itemMap = new Map();
      topItems?.forEach((item: any) => {
        const name = item.item_name;
        if (itemMap.has(name)) {
          const existing = itemMap.get(name);
          itemMap.set(name, {
            item: name,
            orders: existing.orders + item.quantity,
            price: item.item_price,
          });
        } else {
          itemMap.set(name, {
            item: name,
            orders: item.quantity,
            price: item.item_price,
          });
        }
      });

      const sortedItems = Array.from(itemMap.values())
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      return new Response(JSON.stringify({ topItems: sortedItems }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (endpoint === 'orders-by-date') {
      const { data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('created_at, total, status')
        .eq('outlet_id', outletId)
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed')
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;

      const dateMap = new Map();
      orders?.forEach((order: any) => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (dateMap.has(date)) {
          const existing = dateMap.get(date);
          dateMap.set(date, {
            day: date,
            orders: existing.orders + 1,
            revenue: existing.revenue + Number(order.total),
          });
        } else {
          dateMap.set(date, {
            day: date,
            orders: 1,
            revenue: Number(order.total),
          });
        }
      });

      const ordersByDate = Array.from(dateMap.values());

      return new Response(JSON.stringify({ ordersByDate }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (endpoint === 'orders-by-hour') {
      const { data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('created_at')
        .eq('outlet_id', outletId)
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed');

      if (ordersError) throw ordersError;

      const hourMap = new Map();
      for (let i = 0; i < 24; i++) {
        hourMap.set(i, { hour: `${i}:00`, orders: 0 });
      }

      orders?.forEach((order: any) => {
        const hour = new Date(order.created_at).getHours();
        const existing = hourMap.get(hour);
        hourMap.set(hour, {
          hour: `${hour}:00`,
          orders: existing.orders + 1,
        });
      });

      const ordersByHour = Array.from(hourMap.values());

      return new Response(JSON.stringify({ ordersByHour }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in vendor-analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
