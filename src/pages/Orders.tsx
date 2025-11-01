import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Package, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  outletName: string;
  items: string[];
  total: number;
  status: "preparing" | "ready" | "delivered";
  orderTime: string;
  pickupTime: string;
}

const orders: Order[] = [
  {
    id: "ORD-2401",
    outletName: "Campus Café",
    items: ["Classic Burger x2", "Margherita Pizza x1", "French Fries x2"],
    total: 605,
    status: "preparing",
    orderTime: "2:10 PM",
    pickupTime: "2:30 PM",
  },
  {
    id: "ORD-2400",
    outletName: "Pizza Paradise",
    items: ["Pepperoni Pizza x1", "Garlic Bread x2"],
    total: 399,
    status: "ready",
    orderTime: "1:20 PM",
    pickupTime: "1:40 PM",
  },
  {
    id: "ORD-2399",
    outletName: "Healthy Bites",
    items: ["Caesar Salad x1", "Green Smoothie x1"],
    total: 249,
    status: "delivered",
    orderTime: "12:30 PM",
    pickupTime: "12:50 PM",
  },
];

const statusConfig = {
  preparing: {
    label: "Preparing",
    icon: Package,
    color: "bg-primary/10 text-primary",
    iconColor: "text-primary",
  },
  ready: {
    label: "Ready for Pickup",
    icon: CheckCircle2,
    color: "bg-secondary/10 text-secondary",
    iconColor: "text-secondary",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-muted text-muted-foreground",
    iconColor: "text-muted-foreground",
  },
};

const Orders = () => {
  const navigate = useNavigate();

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
        {orders.map((order) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;

          return (
            <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{order.outletName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.id}
                  </p>
                </div>
                <Badge className={config.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>

              {/* Order Items */}
              <div className="mb-3">
                {order.items.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {item}
                  </p>
                ))}
              </div>

              <Separator className="my-3" />

              {/* Order Details */}
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{order.orderTime}</span>
                  </div>
                  {order.status !== "delivered" && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>Pickup by {order.pickupTime}</span>
                    </div>
                  )}
                </div>
                <span className="font-semibold">₹{order.total}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {order.status === "ready" && (
                  <Button className="flex-1 rounded-full" variant="default">
                    View Pickup Details
                  </Button>
                )}
                {order.status === "delivered" && (
                  <Button className="flex-1 rounded-full" variant="outline">
                    Reorder
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
