import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationRequest {
  outlet_id?: number;
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

    const { outlet_id }: RecommendationRequest = await req.json();
    console.log(`Fetching recommendations for user: ${user.id}, outlet: ${outlet_id || 'all'}`);

    // Try to get user's top 3 most ordered items
    let query = supabaseClient
      .from('order_statistics')
      .select(`
        menu_item_id,
        order_count,
        menu_items (
          id,
          name,
          description,
          price,
          image_url,
          category,
          is_veg,
          is_available,
          outlet_id,
          outlets (
            id,
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('order_count', { ascending: false })
      .limit(3);

    if (outlet_id) {
      query = query.eq('outlet_id', outlet_id);
    }

    const { data: userRecommendations, error: userError } = await query;

    if (userError) {
      console.error('Error fetching user recommendations:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch recommendations', details: userError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If user has order history, return their favorites
    if (userRecommendations && userRecommendations.length > 0) {
      const recommendations = userRecommendations
        .filter(stat => stat.menu_items && (stat.menu_items as any).is_available)
        .map(stat => ({
          ...(stat.menu_items as any),
          order_count: stat.order_count,
          recommendation_type: 'user_favorite'
        }));

      console.log(`Returning ${recommendations.length} user favorites`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          recommendations,
          type: 'user_favorites'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: Get outlet's top sellers
    console.log('No user history, fetching outlet top sellers');
    
    let outletQuery = supabaseClient
      .from('order_statistics')
      .select(`
        menu_item_id,
        order_count,
        menu_items (
          id,
          name,
          description,
          price,
          image_url,
          category,
          is_veg,
          is_available,
          outlet_id,
          outlets (
            id,
            name
          )
        )
      `)
      .order('order_count', { ascending: false })
      .limit(3);

    if (outlet_id) {
      outletQuery = outletQuery.eq('outlet_id', outlet_id);
    }

    const { data: outletRecommendations, error: outletError } = await outletQuery;

    if (outletError) {
      console.error('Error fetching outlet recommendations:', outletError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch outlet recommendations', details: outletError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Remove duplicates and filter available items
    const seen = new Set();
    const recommendations = (outletRecommendations || [])
      .filter(stat => stat.menu_items && (stat.menu_items as any).is_available)
      .map(stat => ({
        ...(stat.menu_items as any),
        order_count: stat.order_count,
        recommendation_type: 'popular'
      }))
      .filter((item: any) => {
        if (seen.has(item.id)) {
          return false;
        }
        seen.add(item.id);
        return true;
      });

    console.log(`Returning ${recommendations.length} popular items`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        recommendations,
        type: 'popular_items'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in fetch-recommendations function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});