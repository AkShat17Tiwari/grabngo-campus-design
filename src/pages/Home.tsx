import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, ShoppingCart, TrendingUp, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OutletCard } from "@/components/OutletCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Outlet {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  estimated_time: string;
  image_url: string;
  is_open: boolean;
  description: string;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(3);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      const { data, error } = await supabase
        .from('outlets')
        .select('*')
        .order('name');

      if (error) throw error;

      setOutlets(data.map(outlet => ({
        id: outlet.id,
        name: outlet.name,
        cuisine: outlet.cuisine || '',
        rating: Number(outlet.rating) || 0,
        distance: outlet.distance || '',
        estimated_time: outlet.estimated_time || '',
        image_url: outlet.image_url || '',
        is_open: outlet.is_open ?? true,
        description: outlet.description || ''
      })));
    } catch (error) {
      console.error('Error fetching outlets:', error);
      toast.error('Failed to load outlets');
    } finally {
      setLoading(false);
    }
  };

  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openOutlets = filteredOutlets.filter(o => o.is_open);
  const closedOutlets = filteredOutlets.filter(o => !o.is_open);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading outlets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header with Gradient */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-xl border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-1">
                GrabNGo
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">Main Campus</span>
                <Badge variant="secondary" className="ml-2 animate-pulse-slow">
                  <Zap className="h-3 w-3 mr-1" />
                  Fast Pickup
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Link to="/vendor">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Staff Console
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                    U
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search outlets, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 rounded-2xl border-2 focus-visible:ring-primary text-base shadow-md"
            />
          </div>
        </div>
      </header>

      {/* Quick Stats Bar */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{openOutlets.length}</span> outlets open now
              </span>
              <div className="flex items-center gap-1 text-secondary">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Popular picks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Popular/Open Outlets */}
        {openOutlets.length > 0 && (
          <section className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold">
                Available Now
              </h2>
              <span className="text-sm text-muted-foreground">
                {openOutlets.length} outlets
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openOutlets.map((outlet, index) => (
                <div 
                  key={outlet.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <OutletCard 
                    id={outlet.id}
                    name={outlet.name}
                    cuisine={outlet.cuisine}
                    rating={outlet.rating}
                    distance={outlet.distance}
                    time={outlet.estimated_time}
                    image={outlet.image_url}
                    isOpen={outlet.is_open}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Closed Outlets */}
        {closedOutlets.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-muted-foreground">
                Currently Closed
              </h2>
              <span className="text-sm text-muted-foreground">
                {closedOutlets.length} outlets
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {closedOutlets.map((outlet) => (
                <OutletCard 
                  key={outlet.id}
                  id={outlet.id}
                  name={outlet.name}
                  cuisine={outlet.cuisine}
                  rating={outlet.rating}
                  distance={outlet.distance}
                  time={outlet.estimated_time}
                  image={outlet.image_url}
                  isOpen={outlet.is_open}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredOutlets.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No outlets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse all outlets
            </p>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <Link to="/cart">
          <Button
            size="lg"
            className="fixed bottom-24 right-6 rounded-full h-16 w-16 shadow-2xl hover:scale-110 transition-all duration-300 animate-scale-in z-40"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-3 -right-3 h-6 w-6 flex items-center justify-center p-0 bg-destructive animate-pulse-slow">
                {cartCount}
              </Badge>
            </div>
          </Button>
        </Link>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t shadow-lg z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link to="/" className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-xl bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary">Home</span>
            </Link>
            <Link
              to="/orders"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Clock className="h-5 w-5" />
              <span className="text-xs">Orders</span>
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

export default Home;
