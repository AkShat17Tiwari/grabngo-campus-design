import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, CheckCircle2, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderStatusAnimation } from "@/components/OrderStatusAnimation";
import { useRealtimeUserOrders } from "@/hooks/useRealtimeOrders";
import { supabase } from "@/integrations/supabase/client";

interface ItemsMap { [orderId: string]: string[] }
interface OutletsMap { [outletId: number]: string }

const statusConfig = {
  placed: { label: "Order Placed", icon: ChefHat, color: "bg-accent/20 text-accent-foreground" },
  preparing: { label: "Preparing", icon: ChefHat, color: "bg-primary/10 text-primary" },
  ready: { label: "Ready for Pickup", icon: CheckCircle2, color: "bg-secondary/10 text-secondary" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-muted text-muted-foreground" },
};

const Orders = () => {
  const navigate = useNavigate();
  const { orders, loading } = useRealtimeUserOrders();
  const [itemsMap, setItemsMap] = useState<ItemsMap>({});
  const [outletsMap, setOutletsMap] = useState<OutletsMap>({});

  useEffect(() => {
    const loadDetails = async () => {
      if (!orders || orders.length === 0) return;
      const orderIds = orders.map((o) => o.id);
      const outletIds = Array.from(new Set(orders.map((o) => o.outlet_id)));

      const [{ data: items }, { data: outlets }] = await Promise.all([
        supabase
          .from('order_items')
          .select('order_id,item_name,quantity')
          .in('order_id', orderIds),
        supabase
          .from('outlets')
          .select('id,name')
          .in('id', outletIds)
      ]);

      // Build items map
      const itemAgg: ItemsMap = {};
      (items || []).forEach((row) => {
        const key = row.order_id as string;
        const itemStr = `${row.item_name} x${row.quantity}`;
        itemAgg[key] = [...(itemAgg[key] || []), itemStr];
      });
      setItemsMap(itemAgg);

      // Build outlets map
      const outletAgg: OutletsMap = {};
      (outlets || []).forEach((o) => {
        outletAgg[o.id as number] = o.name as string;
      });
      setOutletsMap(outletAgg);
    };
    loadDetails();
  }, [orders]);

  const formattedOrders = useMemo(() => orders || [], [orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {formattedOrders.map((order) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;
          const outletName = outletsMap[order.outlet_id] || "Outlet";
          const items = itemsMap[order.id] || [];
          const orderTime = new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const estimatedTime = order.estimated_pickup_time
            ? new Date(order.estimated_pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : "--";

          return (
            <Card key={order.id} className="p-5 hover:shadow-lg transition-all duration-300 border-2">
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{outletName}</h3>
                  <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                </div>
                <Badge className={`${config.color} px-3 py-1`}>
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {config.label}
                </Badge>
              </div>

              {/* Enhanced Order Status Animation */}
              <OrderStatusAnimation currentStatus={order.status} estimatedTime={estimatedTime} />

              {/* Order Items */}
              <div className="mb-3">
                <h4 className="font-semibold text-sm mb-2">Items:</h4>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground pl-2">No items found</p>
                ) : (
                  items.map((item, index) => (
                    <p key={index} className="text-sm text-muted-foreground pl-2">• {item}</p>
                  ))
                )}
              </div>

              <Separator className="my-3" />

              {/* Order Details */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Ordered at {orderTime}</span>
                  </div>
                </div>
                <span className="font-bold text-lg text-primary">₹{order.total}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {order.status === "ready" && (
                  <Button className="flex-1 rounded-full font-semibold" variant="default">
                    View Pickup Details
                  </Button>
                )}
                {order.status === "completed" && (
                  <Button className="flex-1 rounded-full font-semibold" variant="outline">
                    Reorder
                  </Button>
                )}
                {order.status !== "completed" && (
                  <Button variant="outline" className="rounded-full">
                    Track Order
                  </Button>
                )}
                <Button variant="outline" className="rounded-full">
                  Help
                </Button>
              </div>
            </Card>
          );
        })}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
            <Link to="/orders" className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary">Orders</span>
            </Link>
            <Link
              to="/profile"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-muted" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Orders;
