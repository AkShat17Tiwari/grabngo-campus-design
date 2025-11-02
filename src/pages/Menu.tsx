import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_veg: boolean | null;
  in_stock: boolean | null;
}

interface Outlet {
  id: number;
  name: string;
  cuisine: string | null;
  rating: number | null;
  distance: string | null;
  estimated_time: string | null;
  image_url: string | null;
}


const Menu = () => {
  const { outletId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const outletNum = Number(outletId);
        if (!outletNum) throw new Error('Invalid outlet');

        const [{ data: outletData, error: outletError }, { data: itemsData, error: itemsError }] = await Promise.all([
          supabase.from('outlets').select('*').eq('id', outletNum).single(),
          supabase.from('menu_items').select('*').eq('outlet_id', outletNum).order('category', { ascending: true })
        ]);

        if (outletError) throw outletError;
        if (itemsError) throw itemsError;

        setOutlet(outletData as Outlet);
        setMenuItems((itemsData || []) as MenuItem[]);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [outletId]);

  const addToCart = (itemId: number) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    toast.success('Added to cart');
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) newCart[itemId]--;
      else delete newCart[itemId];
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [itemId, count]) => {
    const item = menuItems.find((i) => i.id === Number(itemId));
    return sum + (item?.price || 0) * count;
  }, 0);

  const categories = Array.from(new Set(menuItems.map((item) => item.category || 'Other')));

  if (loading || !outlet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{outlet?.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span>{Number(outlet?.rating ?? 0).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{outlet?.estimated_time || "--"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{outlet?.distance || "--"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Items */}
      <main className="container mx-auto px-4 py-6">
        {categories.map((category) => (
          <div key={category} className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-foreground">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Item Image - Prominent placeholder */}
                    <div className="relative h-48 w-full bg-muted">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {!item.in_stock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="outline" className="text-destructive border-destructive">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                      <Badge
                        variant={item.is_veg ? "secondary" : "destructive"}
                        className="absolute top-2 left-2 h-5 w-5 p-0 flex items-center justify-center"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-current" />
                      </Badge>
                    </div>

                    {/* Item Details */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                        {item.description}
                      </p>
                      
                      {/* Price and Add Button */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xl text-primary">
                          ₹{item.price}
                        </span>
                        {item.in_stock ? (
                          cart[item.id] ? (
                            <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-3 py-1.5">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 rounded-full hover:bg-primary-foreground/20"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="min-w-8 text-center font-bold">
                                {cart[item.id]}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 rounded-full hover:bg-primary-foreground/20"
                                onClick={() => addToCart(item.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              className="rounded-full font-semibold"
                              onClick={() => addToCart(item.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                          )
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </main>

      {/* Cart Summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container mx-auto">
            <Link to="/cart">
              <Button size="lg" className="w-full rounded-full shadow-xl">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{cartCount} items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">₹{cartTotal}</span>
                    <span>→</span>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
