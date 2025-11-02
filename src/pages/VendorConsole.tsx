import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Clock, User, Package, CheckCircle2, AlertCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useRealtimeOutletOrders, type Order } from "@/hooks/useRealtimeOrders";
import { supabase } from "@/integrations/supabase/client";

interface ItemsMap { [orderId: string]: { name: string; quantity: number }[] }

type VendorOrderStatus = 'placed' | 'preparing' | 'ready';

const VendorConsole = () => {
  const navigate = useNavigate();
  const [outletId, setOutletId] = useState<number | null>(null);
  const [outletName, setOutletName] = useState<string>("");
  const { orders: rawOrders, loading } = useRealtimeOutletOrders(outletId);
  const [itemsMap, setItemsMap] = useState<ItemsMap>({});

  useEffect(() => {
    // For demo, using first outlet. In production, determine outlet from user role
    const loadOutlet = async () => {
      const { data } = await supabase.from('outlets').select('id,name').limit(1).single();
      if (data) {
        setOutletId(data.id);
        setOutletName(data.name);
      }
    };
    loadOutlet();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      if (!rawOrders || rawOrders.length === 0) return;
      const orderIds = rawOrders.map((o) => o.id);
      const { data } = await supabase
        .from('order_items')
        .select('order_id,item_name,quantity')
        .in('order_id', orderIds);

      const agg: ItemsMap = {};
      (data || []).forEach((row) => {
        const key = row.order_id as string;
        agg[key] = [...(agg[key] || []), { name: row.item_name as string, quantity: row.quantity as number }];
      });
      setItemsMap(agg);
    };
    loadItems();
  }, [rawOrders]);

  const handleStartPreparing = async (orderId: string) => {
    const { error } = await supabase.functions.invoke('update-order-status', {
      body: { orderId, newStatus: 'preparing' }
    });
    if (error) toast.error('Failed to update order');
    else toast.success('Order moved to preparing');
  };

  const handleMarkReady = async (orderId: string) => {
    const { error } = await supabase.functions.invoke('update-order-status', {
      body: { orderId, newStatus: 'ready' }
    });
    if (error) toast.error('Failed to update order');
    else toast.success('Order marked as ready');
  };

  const orders = useMemo(() => rawOrders || [], [rawOrders]);
  const newOrders = orders.filter((o) => o.status === 'placed');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  const OrderCard = ({ order }: { order: Order }) => {
    const statusConfig: Record<VendorOrderStatus, { badge: string; badgeClass: string; icon: typeof AlertCircle }> = {
      placed: { badge: "NEW", badgeClass: "bg-primary text-primary-foreground", icon: AlertCircle },
      preparing: { badge: "PREPARING", badgeClass: "bg-accent text-accent-foreground", icon: Package },
      ready: { badge: "READY", badgeClass: "bg-secondary text-secondary-foreground", icon: CheckCircle2 },
    };

    const vendorStatus = (order.status === 'placed' ? 'placed' : order.status) as VendorOrderStatus;
    const config = statusConfig[vendorStatus];
    const StatusIcon = config.icon;
    const items = itemsMap[order.id] || [];
    const orderTime = new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <Card className="p-6 border-2 hover:shadow-xl transition-all duration-200">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-display font-bold">{order.id.slice(0, 8)}</h3>
              <Badge className={`${config.badgeClass} text-sm px-3 py-1 font-bold`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {config.badge}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-medium">{order.customer_name}</span>
              <Separator orientation="vertical" className="h-4" />
              <Clock className="h-4 w-4" />
              <span>{orderTime}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-bold text-primary">₹{order.total}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Items */}
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Items
          </h4>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items found</p>
          ) : (
            items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="font-medium text-lg">{item.name}</span>
                <Badge variant="outline" className="text-base px-3 py-1">
                  x{item.quantity}
                </Badge>
              </div>
            ))
          )}
        </div>

        {/* Special Instructions */}
        {order.special_instructions && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-1">Special Instructions:</p>
            <p className="text-sm text-muted-foreground">{order.special_instructions}</p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex gap-3">
          {order.status === "placed" && (
            <Button
              size="lg"
              className="flex-1 h-14 text-lg font-semibold"
              onClick={() => handleStartPreparing(order.id)}
            >
              <Package className="h-5 w-5 mr-2" />
              Start Preparing
            </Button>
          )}
          {order.status === "preparing" && (
            <Button
              size="lg"
              variant="secondary"
              className="flex-1 h-14 text-lg font-semibold"
              onClick={() => handleMarkReady(order.id)}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Ready for Pickup
            </Button>
          )}
          {order.status === "ready" && (
            <div className="flex-1 h-14 flex items-center justify-center bg-secondary/10 rounded-lg border-2 border-secondary">
              <CheckCircle2 className="h-5 w-5 text-secondary mr-2" />
              <span className="font-semibold text-secondary">Awaiting Pickup</span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* High Contrast Header */}
      <header className="sticky top-0 z-50 bg-background border-b-4 border-primary shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-display font-bold">{outletName || "Vendor Console"}</h1>
                <p className="text-sm text-muted-foreground">Staff Console</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {newOrders.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-destructive animate-pulse-slow">
                    {newOrders.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-primary/10 border-2 border-primary/20">
              <p className="text-4xl font-display font-bold text-primary">{newOrders.length}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">New Orders</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent/10 border-2 border-accent/20">
              <p className="text-4xl font-display font-bold text-accent">{preparingOrders.length}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Preparing</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/10 border-2 border-secondary/20">
              <p className="text-4xl font-display font-bold text-secondary">{readyOrders.length}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* New Orders */}
        {newOrders.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <AlertCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">New Orders</h2>
                <p className="text-sm text-muted-foreground">
                  {newOrders.length} order{newOrders.length !== 1 ? "s" : ""} waiting
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {newOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Preparing Orders */}
        {preparingOrders.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent rounded-lg">
                <Package className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Preparing</h2>
                <p className="text-sm text-muted-foreground">
                  {preparingOrders.length} order{preparingOrders.length !== 1 ? "s" : ""} in progress
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {preparingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Ready Orders */}
        {readyOrders.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Ready for Pickup</h2>
                <p className="text-sm text-muted-foreground">
                  {readyOrders.length} order{readyOrders.length !== 1 ? "s" : ""} ready
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {readyOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">No active orders</h3>
            <p className="text-muted-foreground">New orders will appear here automatically</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorConsole;
