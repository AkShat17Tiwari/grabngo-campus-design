import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsRequest {
  outlet_id?: number;
  period?: 'daily' | 'weekly' | 'monthly';
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

    // Verify authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin or vendor_staff role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role, outlet_id')
      .eq('user_id', user.id)
      .single();

    if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'vendor_staff')) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { outlet_id, period = 'daily' }: AnalyticsRequest = await req.json();

    // Determine outlet filter
    let targetOutletId = outlet_id;
    if (roleData.role === 'vendor_staff') {
      // Vendor can only view their outlet
      targetOutletId = roleData.outlet_id ?? undefined;
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'daily') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'weekly') {
      startDate.setDate(now.getDate() - 28);
    } else {
      startDate.setMonth(now.getMonth() - 6);
    }

    // Fetch orders with items
    let ordersQuery = supabaseClient
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        total,
        subtotal,
        outlet_id,
        outlets (name)
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (targetOutletId) {
      ordersQuery = ordersQuery.eq('outlet_id', targetOutletId);
    }

    const { data: orders, error: ordersError } = await ordersQuery;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch orders' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch top items
    let statsQuery = supabaseClient
      .from('order_statistics')
      .select(`
        menu_item_id,
        order_count,
        menu_items (
          id,
          name,
          category,
          price
        )
      `)
      .order('order_count', { ascending: false })
      .limit(10);

    if (targetOutletId) {
      statsQuery = statsQuery.eq('outlet_id', targetOutletId);
    }

    const { data: topItems, error: statsError } = await statsQuery;

    if (statsError) {
      console.error('Error fetching statistics:', statsError);
    }

    // Calculate analytics
    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
    
    // Group by date for charts
    const ordersByDate: Record<string, { count: number; revenue: number }> = {};
    orders?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!ordersByDate[date]) {
        ordersByDate[date] = { count: 0, revenue: 0 };
      }
      ordersByDate[date].count++;
      ordersByDate[date].revenue += Number(order.total);
    });

    // Group by hour
    const ordersByHour: Record<number, number> = {};
    orders?.forEach(order => {
      const hour = new Date(order.created_at).getHours();
      ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;
    });

    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          totalOrders,
          totalRevenue,
          completedOrders,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          ordersByDate: Object.entries(ordersByDate).map(([date, data]) => ({
            date,
            ...data
          })),
          ordersByHour: Object.entries(ordersByHour).map(([hour, count]) => ({
            hour: parseInt(hour),
            count
          })),
          topItems: topItems?.map(item => ({
            name: (item.menu_items as any)?.name,
            category: (item.menu_items as any)?.category,
            orderCount: item.order_count,
            price: (item.menu_items as any)?.price
          })) || []
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analytics function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
