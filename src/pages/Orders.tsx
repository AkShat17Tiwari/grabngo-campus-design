import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, CheckCircle2, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderStatusAnimation } from "@/components/OrderStatusAnimation";

interface Order {
  id: string;
  outletName: string;
  items: string[];
  total: number;
  status: "placed" | "preparing" | "ready" | "completed";
  orderTime: string;
  estimatedTime: string;
}

const orders: Order[] = [
  {
    id: "ORD-2401",
    outletName: "Campus Café",
    items: ["Classic Burger x2", "Margherita Pizza x1", "French Fries x2"],
    total: 605,
    status: "preparing",
    orderTime: "2:10 PM",
    estimatedTime: "2:30 PM",
  },
  {
    id: "ORD-2400",
    outletName: "Pizza Paradise",
    items: ["Pepperoni Pizza x1", "Garlic Bread x2"],
    total: 399,
    status: "ready",
    orderTime: "1:20 PM",
    estimatedTime: "1:40 PM",
  },
  {
    id: "ORD-2399",
    outletName: "Healthy Bites",
    items: ["Caesar Salad x1", "Green Smoothie x1"],
    total: 249,
    status: "completed",
    orderTime: "12:30 PM",
    estimatedTime: "12:50 PM",
  },
  {
    id: "ORD-2398",
    outletName: "Burger Hub",
    items: ["Veggie Burger x1", "Fries x1"],
    total: 179,
    status: "placed",
    orderTime: "2:45 PM",
    estimatedTime: "3:05 PM",
  },
];

const statusConfig = {
  placed: {
    label: "Order Placed",
    icon: ChefHat,
    color: "bg-accent/20 text-accent-foreground",
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    color: "bg-primary/10 text-primary",
  },
  ready: {
    label: "Ready for Pickup",
    icon: CheckCircle2,
    color: "bg-secondary/10 text-secondary",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "bg-muted text-muted-foreground",
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
            <Card key={order.id} className="p-5 hover:shadow-lg transition-all duration-300 border-2">
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{order.outletName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.id}
                  </p>
                </div>
                <Badge className={`${config.color} px-3 py-1`}>
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {config.label}
                </Badge>
              </div>

              {/* Enhanced Order Status Animation */}
              <OrderStatusAnimation 
                currentStatus={order.status}
                estimatedTime={order.estimatedTime}
              />

              {/* Order Items */}
              <div className="mb-3">
                <h4 className="font-semibold text-sm mb-2">Items:</h4>
                {order.items.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground pl-2">
                    • {item}
                  </p>
                ))}
              </div>

              <Separator className="my-3" />

              {/* Order Details */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Ordered at {order.orderTime}</span>
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
