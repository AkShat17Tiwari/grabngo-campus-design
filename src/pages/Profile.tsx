import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Edit,
  Mail,
  Phone,
  Trophy,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/InputField";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setEditName(user.user_metadata?.full_name || "");
      setEditPhone(user.user_metadata?.phone || "");
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: editName,
        phone: editPhone,
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated successfully!");
      setIsEditDialogOpen(false);
      loadUserData();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

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
        <Card className="p-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <span className="text-3xl font-bold text-white">
                {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {user?.user_metadata?.full_name || "User"}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3" />
                {user?.email || "user@email.com"}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {user?.user_metadata?.phone || "Not provided"}
              </p>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="outline" className="rounded-full">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md animate-slide-in-right">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <InputField
                    label="Full Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InputField
                    label="Phone Number"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="w-full"
                    variant="gradient"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-4" />

          <div className="text-center p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Your order history and rewards will appear here
            </p>
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
          onClick={handleLogout}
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
