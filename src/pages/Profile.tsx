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
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InputField } from "@/components/InputField";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Addresses state
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState("");
  
  // Favorites state
  const [favorites, setFavorites] = useState<any[]>([]);
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    offers: true,
    recommendations: false,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setEditName(user.user_metadata?.full_name || "");
      setEditPhone(user.user_metadata?.phone || "");

      // Fetch profile with points
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      } else {
        // Create profile if doesn't exist
        await supabase.from('profiles').insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name,
          phone: user.user_metadata?.phone,
          current_points: 0
        });
      }

      // Fetch order count
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setOrderCount(count || 0);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: editName,
          phone: editPhone,
        }
      });

      if (authError) throw authError;

      // Update profile table
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            full_name: editName,
            phone: editPhone,
          });

        if (profileError) throw profileError;
      }

      toast.success("Profile updated successfully!");
      loadUserData();
    } catch (error: any) {
      toast.error(error.message);
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

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setAddresses([...addresses, { id: Date.now(), address: newAddress, isDefault: addresses.length === 0 }]);
      setNewAddress("");
      toast.success("Address added successfully");
    }
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success("Address deleted");
  };

  const handleUpdateNotifications = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
    toast.success("Notification preferences updated");
  };

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

      <main className="container mx-auto px-4 py-6 space-y-6 mb-20">
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
            </div>
          </div>

          <Separator className="my-4" />

          {/* Points & Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Rewards Points</p>
              </div>
              <p className="text-3xl font-bold text-primary">
                {profile?.current_points || 0}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-secondary" />
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              </div>
              <p className="text-3xl font-bold text-secondary">
                {orderCount}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-auto">
            <TabsTrigger value="profile" className="flex flex-col gap-1 py-3">
              <User className="h-4 w-4" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex flex-col gap-1 py-3">
              <Heart className="h-4 w-4" />
              <span className="text-xs">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex flex-col gap-1 py-3">
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Edit Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Profile
              </h3>
              <div className="space-y-4">
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
                  variant="default"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Saved Addresses
              </h3>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex-1">
                      <p className="text-sm">{addr.address}</p>
                      {addr.isDefault && (
                        <span className="text-xs text-primary">Default</span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteAddress(addr.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <InputField
                    placeholder="Add new address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddAddress} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Payment methods are securely handled by Razorpay during checkout. No card details are stored.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <CreditCard className="h-4 w-4 mr-2" />
                Manage via Razorpay
              </Button>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Favorites
              </h3>
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No favorites yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Save your favorite outlets and items while browsing
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="p-3 rounded-lg bg-muted flex items-center justify-between">
                      <span>{fav.name}</span>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Updates</Label>
                    <p className="text-xs text-muted-foreground">Get notified about order status</p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(val) => handleUpdateNotifications("orderUpdates", val)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Offers & Promotions</Label>
                    <p className="text-xs text-muted-foreground">Receive special offers</p>
                  </div>
                  <Switch
                    checked={notifications.offers}
                    onCheckedChange={(val) => handleUpdateNotifications("offers", val)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Recommendations</Label>
                    <p className="text-xs text-muted-foreground">Get personalized suggestions</p>
                  </div>
                  <Switch
                    checked={notifications.recommendations}
                    onCheckedChange={(val) => handleUpdateNotifications("recommendations", val)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Help & Support
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Frequently Asked Questions</h4>
                  <div className="space-y-2 text-sm">
                    <details className="p-3 rounded-lg bg-muted">
                      <summary className="cursor-pointer font-medium">How do I cancel an order?</summary>
                      <p className="mt-2 text-muted-foreground">
                        You can cancel within 60 seconds of placing an order, before the vendor starts preparation.
                      </p>
                    </details>
                    <details className="p-3 rounded-lg bg-muted">
                      <summary className="cursor-pointer font-medium">What are reward points?</summary>
                      <p className="mt-2 text-muted-foreground">
                        Earn 1 point per ₹10 spent. Points can be used for discounts on future orders.
                      </p>
                    </details>
                    <details className="p-3 rounded-lg bg-muted">
                      <summary className="cursor-pointer font-medium">How long is food held?</summary>
                      <p className="mt-2 text-muted-foreground">
                        Orders are held for 15 minutes after the scheduled pickup time.
                      </p>
                    </details>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Contact Support</h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm font-medium">Email</p>
                      <a href="mailto:support@grabngo.edu" className="text-sm text-primary">
                        support@grabngo.edu
                      </a>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm font-medium">Phone</p>
                      <a href="tel:+911234567890" className="text-sm text-primary">
                        +91 123 456 7890
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              variant="outline"
              className="w-full rounded-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>GrabNGo v1.0.0</p>
              <p className="mt-1">Made with ❤️ for Campus Community</p>
            </div>
          </TabsContent>
        </Tabs>
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
