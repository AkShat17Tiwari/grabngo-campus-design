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

    // Verify user is admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || roleData?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    const period = url.searchParams.get('period') || 'daily';

    // Calculate date range based on period
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
      // Get total revenue and orders
      const { data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('total, status, created_at')
        .gte('created_at', startDate.toISOString());

      if (ordersError) throw ordersError;

      const totalOrders = orders?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      const totalRevenue = orders?.filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + Number(o.total), 0) || 0;

      // Get vendor count
      const { count: vendorCount } = await supabaseClient
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'vendor_staff');

      // Get refunds (cancelled orders)
      const refunds = orders?.filter(o => o.status === 'cancelled').length || 0;

      return new Response(
        JSON.stringify({
          totalOrders,
          completedOrders,
          totalRevenue,
          totalVendors: vendorCount || 0,
          refunds,
          averageOrderValue: totalOrders > 0 ? totalRevenue / completedOrders : 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (endpoint === 'top-items') {
      const { data: topItems, error: itemsError } = await supabaseClient
        .from('order_items')
        .select('item_name, item_price, quantity, order_id, orders!inner(status, created_at)')
        .gte('orders.created_at', startDate.toISOString())
        .eq('orders.status', 'completed');

      if (itemsError) throw itemsError;

      // Aggregate by item name
      const itemMap = new Map();
      topItems?.forEach((item: any) => {
        const name = item.item_name;
        if (itemMap.has(name)) {
          const existing = itemMap.get(name);
          itemMap.set(name, {
            name,
            orderCount: existing.orderCount + item.quantity,
            price: item.item_price,
          });
        } else {
          itemMap.set(name, {
            name,
            orderCount: item.quantity,
            price: item.item_price,
          });
        }
      });

      const sortedItems = Array.from(itemMap.values())
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 10);

      return new Response(JSON.stringify({ topItems: sortedItems }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (endpoint === 'orders-by-date') {
      const { data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('created_at, total, status')
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed')
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;

      // Group by date
      const dateMap = new Map();
      orders?.forEach((order: any) => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        if (dateMap.has(date)) {
          const existing = dateMap.get(date);
          dateMap.set(date, {
            date,
            count: existing.count + 1,
            revenue: existing.revenue + Number(order.total),
          });
        } else {
          dateMap.set(date, {
            date,
            count: 1,
            revenue: Number(order.total),
          });
        }
      });

      const ordersByDate = Array.from(dateMap.values()).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return new Response(JSON.stringify({ ordersByDate }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (endpoint === 'orders-by-hour') {
      const { data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed');

      if (ordersError) throw ordersError;

      // Group by hour
      const hourMap = new Map();
      for (let i = 0; i < 24; i++) {
        hourMap.set(i, { hour: `${i}:00`, count: 0 });
      }

      orders?.forEach((order: any) => {
        const hour = new Date(order.created_at).getHours();
        const existing = hourMap.get(hour);
        hourMap.set(hour, {
          hour: `${hour}:00`,
          count: existing.count + 1,
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
    console.error('Error in admin-analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
