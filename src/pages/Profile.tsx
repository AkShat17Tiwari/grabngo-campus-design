import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  Heart,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      description: "Name, email, phone number",
      action: () => {},
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      description: "Manage delivery locations",
      action: () => {},
    },
    {
      icon: Heart,
      label: "Favorites",
      description: "Your favorite outlets and items",
      action: () => {},
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      description: "Manage cards and wallets",
      action: () => {},
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Order updates and offers",
      action: () => {},
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQs and contact us",
      action: () => {},
    },
  ];

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
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-3xl font-bold text-white">JD</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-sm text-muted-foreground">
                john.doe@college.edu
              </p>
              <p className="text-sm text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">₹2,450</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <Card className="divide-y">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            );
          })}
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full rounded-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>GrabNGo v1.0.0</p>
          <p className="mt-1">Made with ❤️ for Campus Community</p>
        </div>
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
            <Link
              to="/orders"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Clock className="h-5 w-5" />
              <span className="text-xs">Orders</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-xl bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Profile;
