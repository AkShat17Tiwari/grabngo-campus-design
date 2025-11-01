import { useState } from "react";
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

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  inStock: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Juicy beef patty with fresh vegetables",
    price: 149,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop",
    category: "Burgers",
    isVeg: false,
    inStock: true,
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomatoes, and basil",
    price: 199,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop",
    category: "Pizza",
    isVeg: true,
    inStock: true,
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Crisp romaine with parmesan and croutons",
    price: 129,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&auto=format&fit=crop",
    category: "Salads",
    isVeg: true,
    inStock: true,
  },
  {
    id: 4,
    name: "Chicken Wings",
    description: "Spicy buffalo wings with ranch dip",
    price: 179,
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&auto=format&fit=crop",
    category: "Appetizers",
    isVeg: false,
    inStock: false,
  },
  {
    id: 5,
    name: "French Fries",
    description: "Golden crispy fries with seasoning",
    price: 79,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop",
    category: "Sides",
    isVeg: true,
    inStock: true,
  },
  {
    id: 6,
    name: "Chocolate Shake",
    description: "Thick and creamy chocolate milkshake",
    price: 99,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop",
    category: "Beverages",
    isVeg: true,
    inStock: true,
  },
];

const Menu = () => {
  const { outletId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const addToCart = (itemId: number) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    toast.success("Added to cart");
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [itemId, count]) => {
    const item = menuItems.find((i) => i.id === Number(itemId));
    return sum + (item?.price || 0) * count;
  }, 0);

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

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
              <h1 className="text-xl font-bold">Campus Café</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span>4.5</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>10-15 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>100m</span>
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
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="outline" className="text-destructive border-destructive">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                      <Badge
                        variant={item.isVeg ? "secondary" : "destructive"}
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
                        {item.inStock ? (
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
