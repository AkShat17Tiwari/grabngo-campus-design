import { useState } from "react";
import { ArrowLeft, Clock, User, Package, CheckCircle2, AlertCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: "new" | "preparing" | "ready";
  orderTime: string;
  specialInstructions?: string;
}

const VendorConsole = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-2405",
      customerName: "John Doe",
      items: [
        { name: "Classic Burger", quantity: 2 },
        { name: "French Fries", quantity: 1 },
      ],
      total: 377,
      status: "new",
      orderTime: "2:45 PM",
      specialInstructions: "Extra cheese, no onions",
    },
    {
      id: "ORD-2404",
      customerName: "Sarah Smith",
      items: [
        { name: "Margherita Pizza", quantity: 1 },
        { name: "Garlic Bread", quantity: 1 },
      ],
      total: 299,
      status: "new",
      orderTime: "2:43 PM",
    },
    {
      id: "ORD-2403",
      customerName: "Mike Johnson",
      items: [
        { name: "Caesar Salad", quantity: 1 },
        { name: "Green Smoothie", quantity: 1 },
      ],
      total: 249,
      status: "preparing",
      orderTime: "2:40 PM",
    },
    {
      id: "ORD-2402",
      customerName: "Emily Brown",
      items: [
        { name: "Chicken Wings", quantity: 2 },
        { name: "Chocolate Shake", quantity: 1 },
      ],
      total: 457,
      status: "preparing",
      orderTime: "2:38 PM",
    },
  ]);

  const handleStartPreparing = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "preparing" as const } : order
      )
    );
    toast.success("Order moved to preparing");
  };

  const handleMarkReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "ready" as const } : order
      )
    );
    toast.success("Order marked as ready for pickup");
  };

  const newOrders = orders.filter((o) => o.status === "new");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const OrderCard = ({ order }: { order: Order }) => {
    const statusConfig = {
      new: {
        badge: "NEW",
        badgeClass: "bg-primary text-primary-foreground",
        icon: AlertCircle,
      },
      preparing: {
        badge: "PREPARING",
        badgeClass: "bg-accent text-accent-foreground",
        icon: Package,
      },
      ready: {
        badge: "READY",
        badgeClass: "bg-secondary text-secondary-foreground",
        icon: CheckCircle2,
      },
    };

    const config = statusConfig[order.status];
    const StatusIcon = config.icon;

    return (
      <Card className="p-6 border-2 hover:shadow-xl transition-all duration-200">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-display font-bold">{order.id}</h3>
              <Badge className={`${config.badgeClass} text-sm px-3 py-1 font-bold`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {config.badge}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-medium">{order.customerName}</span>
              <Separator orientation="vertical" className="h-4" />
              <Clock className="h-4 w-4" />
              <span>{order.orderTime}</span>
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
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="font-medium text-lg">
                {item.name}
              </span>
              <Badge variant="outline" className="text-base px-3 py-1">
                x{item.quantity}
              </Badge>
            </div>
          ))}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-1">Special Instructions:</p>
            <p className="text-sm text-muted-foreground">{order.specialInstructions}</p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex gap-3">
          {order.status === "new" && (
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
                <h1 className="text-3xl font-display font-bold">Campus Café</h1>
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
