import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, Star, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(0);

  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                GrabNGo
              </h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span>Main Campus</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/profile">
                <Button variant="outline" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                    U
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search outlets or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-full border-2 focus-visible:ring-primary"
            />
          </div>
        </div>
      </header>

      {/* Outlets Grid */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {filteredOutlets.length} Outlets Available
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOutlets.map((outlet) => (
            <Link key={outlet.id} to={`/menu/${outlet.id}`}>
              <div className="bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={outlet.image}
                    alt={outlet.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {!outlet.isOpen && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-white/90">
                        Closed
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {outlet.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {outlet.cuisine}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-lg">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      <span className="text-sm font-medium">
                        {outlet.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{outlet.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{outlet.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <Link to="/cart">
          <Button
            size="lg"
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-xl hover:scale-110 transition-transform"
          >
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-destructive">
              {cartCount}
            </Badge>
          </Button>
        </Link>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
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
