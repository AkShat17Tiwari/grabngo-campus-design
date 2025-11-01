import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, Star, ShoppingCart, TrendingUp, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OutletCard } from "@/components/OutletCard";

const outlets = [
  {
    id: 1,
    name: "Campus Café",
    cuisine: "Coffee & Snacks",
    rating: 4.5,
    distance: "100m",
    time: "10-15 min",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop",
    isOpen: true,
    description: "Fresh coffee, pastries, and quick bites",
    popular: true,
  },
  {
    id: 2,
    name: "Pizza Paradise",
    cuisine: "Italian",
    rating: 4.7,
    distance: "250m",
    time: "15-20 min",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop",
    isOpen: true,
    description: "Wood-fired pizzas and pasta",
    popular: true,
  },
  {
    id: 3,
    name: "Burger Junction",
    cuisine: "American",
    rating: 4.3,
    distance: "180m",
    time: "12-18 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
    isOpen: true,
    description: "Gourmet burgers and loaded fries",
    popular: false,
  },
  {
    id: 4,
    name: "Asian Delight",
    cuisine: "Chinese & Thai",
    rating: 4.6,
    distance: "320m",
    time: "20-25 min",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&auto=format&fit=crop",
    isOpen: false,
    description: "Authentic Asian cuisine and dim sum",
    popular: false,
  },
  {
    id: 5,
    name: "Healthy Bites",
    cuisine: "Salads & Bowls",
    rating: 4.8,
    distance: "150m",
    time: "10-12 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    isOpen: true,
    description: "Fresh salads, smoothies, and protein bowls",
    popular: true,
  },
  {
    id: 6,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.4,
    distance: "290m",
    time: "18-22 min",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop",
    isOpen: true,
    description: "Tacos, burritos, and quesadillas",
    popular: false,
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(3);

  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openOutlets = filteredOutlets.filter(o => o.isOpen);
  const closedOutlets = filteredOutlets.filter(o => !o.isOpen);

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
                  <OutletCard {...outlet} />
                  {outlet.popular && (
                    <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Popular Choice
                    </Badge>
                  )}
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
                <OutletCard key={outlet.id} {...outlet} />
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
