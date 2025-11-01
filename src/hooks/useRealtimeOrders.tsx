import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface Order {
  id: string;
  user_id: string;
  outlet_id: number;
  status: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_id: string | null;
  special_instructions: string | null;
  estimated_pickup_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: number | null;
  item_name: string;
  item_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

/**
 * Hook to subscribe to real-time updates for a specific order
 * Automatically updates when the order status changes
 */
export const useRealtimeOrder = (orderId: string | null) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      try {
        // Fetch initial order data
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (fetchError) {
          console.error('Error fetching order:', fetchError);
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        setOrder(data as Order);
        setLoading(false);

        // Subscribe to real-time updates
        channel = supabase
          .channel(`order-${orderId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'orders',
              filter: `id=eq.${orderId}`,
            },
            (payload) => {
              console.log('Order updated in real-time:', payload.new);
              setOrder(payload.new as Order);
            }
          )
          .subscribe((status) => {
            console.log('Realtime subscription status:', status);
          });
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [orderId]);

  return { order, loading, error };
};

/**
 * Hook to subscribe to real-time updates for all user's orders
 * Useful for the Orders page to show all orders
 */
export const useRealtimeUserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Fetch initial orders
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching orders:', fetchError);
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        setOrders((data || []) as Order[]);
        setLoading(false);

        // Subscribe to real-time updates for all user's orders
        channel = supabase
          .channel('user-orders')
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
              schema: 'public',
              table: 'orders',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              console.log('Order change detected:', payload);

              if (payload.eventType === 'INSERT') {
                setOrders((prev) => [payload.new as Order, ...prev]);
              } else if (payload.eventType === 'UPDATE') {
                setOrders((prev) =>
                  prev.map((order) =>
                    order.id === payload.new.id ? (payload.new as Order) : order
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                setOrders((prev) =>
                  prev.filter((order) => order.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe((status) => {
            console.log('Realtime subscription status:', status);
          });
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { orders, loading, error };
};

/**
 * Hook for vendor staff to subscribe to real-time updates for outlet orders
 */
export const useRealtimeOutletOrders = (outletId: number | null) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!outletId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      try {
        // Fetch initial orders for the outlet
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('outlet_id', outletId)
          .in('status', ['placed', 'preparing', 'ready'])
          .order('created_at', { ascending: true });

        if (fetchError) {
          console.error('Error fetching outlet orders:', fetchError);
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        setOrders((data || []) as Order[]);
        setLoading(false);

        // Subscribe to real-time updates for outlet orders
        channel = supabase
          .channel(`outlet-${outletId}-orders`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'orders',
              filter: `outlet_id=eq.${outletId}`,
            },
            (payload) => {
              console.log('Outlet order change detected:', payload);

              if (payload.eventType === 'INSERT') {
                const newOrder = payload.new as Order;
                // Only add if status is active (not completed or cancelled)
                if (['placed', 'preparing', 'ready'].includes(newOrder.status)) {
                  setOrders((prev) => [...prev, newOrder]);
                }
              } else if (payload.eventType === 'UPDATE') {
                const updatedOrder = payload.new as Order;
                
                // Remove from list if status is completed or cancelled
                if (['completed', 'cancelled'].includes(updatedOrder.status)) {
                  setOrders((prev) => prev.filter((order) => order.id !== updatedOrder.id));
                } else {
                  setOrders((prev) =>
                    prev.map((order) =>
                      order.id === updatedOrder.id ? updatedOrder : order
                    )
                  );
                }
              } else if (payload.eventType === 'DELETE') {
                setOrders((prev) =>
                  prev.filter((order) => order.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe((status) => {
            console.log('Outlet orders realtime subscription status:', status);
          });
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [outletId]);

  return { orders, loading, error };
};
