import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [outletId, setOutletId] = useState<number>(1);
  const [outletName, setOutletName] = useState<string>("Campus Café");

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart.items || []);
      setOutletId(cart.outletId || 1);
      setOutletName(cart.outletName || "Campus Café");
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify({
        items: cartItems,
        outletId,
        outletName
      }));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems, outletId, outletName]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 20;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    // Save cart data with calculated totals
    const cartData = {
      items: cartItems,
      outletId,
      outletName,
      subtotal,
      tax,
      deliveryFee,
      total
    };
    localStorage.setItem('cart', JSON.stringify(cartData));
    navigate('/checkout', { state: { cartData } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-40 bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">Cart</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add items from outlets to get started
          </p>
          <Link to="/">
            <Button className="rounded-full">Browse Outlets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Cart ({cartItems.length} items)</h1>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      <main className="container mx-auto px-4 py-6">
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-semibold">{outletName}</span>
          </div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1 w-fit">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-full"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-6 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-full"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bill Details - Order Summary Component */}
        <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
          <h3 className="font-bold text-xl mb-4 text-foreground">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Item Total</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-semibold text-secondary">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Taxes (5%)</span>
              <span className="font-semibold">₹{tax}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-center bg-primary/10 -mx-5 -mb-5 px-5 py-4 rounded-b-lg mt-4">
              <span className="font-bold text-xl">Grand Total</span>
              <span className="font-bold text-2xl text-primary">₹{total}</span>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>💡 All prices are inclusive of applicable taxes</p>
        </div>
      </main>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="container mx-auto">
          <Button 
            size="lg" 
            className="w-full rounded-full shadow-xl"
            onClick={handleCheckout}
          >
            <div className="flex items-center justify-between w-full">
              <span>Proceed to Checkout</span>
              <span className="font-semibold">₹{total}</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
