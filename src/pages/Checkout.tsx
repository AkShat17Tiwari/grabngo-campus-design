import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Wallet, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod] = useState("cash_on_pickup");
  const [instructions, setInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cartData, setCartData] = useState<any>(null);
  const [pickupTime, setPickupTime] = useState<string>("");

  useEffect(() => {
    // Load cart data from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartData(JSON.parse(savedCart));
    } else if (location.state?.cartData) {
      setCartData(location.state.cartData);
    } else {
      toast.error("No cart data found");
      navigate("/cart");
    }

    // Load user data
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
    }
  };


  const handlePlaceOrder = async () => {
    // Validate form
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!phone.trim() || phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate cart data structure
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      toast.error("Cart is empty");
      navigate("/cart");
      return;
    }

    if (!cartData.outletId) {
      toast.error("Invalid cart data - missing outlet information");
      navigate("/cart");
      return;
    }

    // Validate each cart item has required fields
    const invalidItems = cartData.items.filter((item: any) => 
      !item.id || !item.quantity || item.quantity <= 0
    );
    
    if (invalidItems.length > 0) {
      console.error('Invalid cart items:', invalidItems);
      toast.error("Invalid items in cart");
      navigate("/cart");
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to continue");
        navigate("/auth");
        return;
      }

      // Prepare order data matching backend schema
      const orderPayload = {
        outlet_id: Number(cartData.outletId),
        items: cartData.items.map((item: any) => ({
          menu_item_id: Number(item.id),
          quantity: Number(item.quantity)
        })),
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        special_instructions: instructions.trim() || undefined,
        payment_method: paymentMethod
      };

      console.log('Placing order with payload:', orderPayload);

      // Call place-order edge function
      const { data, error } = await supabase.functions.invoke('place-order', {
        body: orderPayload
      });

      if (error) {
        console.error('Order placement error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Invalid response from server');
      }

      console.log('Order created successfully:', data);

      // Store pickup time
      setPickupTime(data.scheduled_pickup_slot);

      // For cash on pickup, order is already placed
      localStorage.removeItem('cart');
      toast.success("Order placed successfully! Pay at pickup.");
      setIsProcessing(false);
      navigate("/orders");

    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || "Failed to place order");
      setIsProcessing(false);
    }
  };

  const total = cartData?.total || 0;
  const subtotal = cartData?.subtotal || 0;
  const tax = cartData?.tax || 0;
  const deliveryFee = 20;

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
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {/* Pickup Details Form */}
        <Card className="p-5 border-2">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Pickup Details
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base font-semibold">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-12"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-base font-semibold">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 h-12"
                maxLength={10}
                required
              />
            </div>
          </div>
        </Card>

        {/* Delivery Location */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Pickup Location</h3>
              <p className="text-sm text-muted-foreground">
                Campus Café - Main Campus, Building A
              </p>
              <Button variant="link" className="h-auto p-0 text-primary mt-1">
                View on Map
              </Button>
            </div>
          </div>
        </Card>

        {/* Pickup Time */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Clock className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Estimated Pickup Time</h3>
              <p className="text-sm text-muted-foreground">
                Calculated based on queue length
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Will be confirmed after order placement
              </p>
            </div>
          </div>
        </Card>

        {/* Special Instructions */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Special Instructions</h3>
          <Textarea
            placeholder="Add any special instructions for your order..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-20 resize-none"
          />
        </Card>

        {/* Payment Method */}
        <Card className="p-5 border-2 bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Cash on Pickup</h3>
              <p className="text-sm text-muted-foreground">Pay when you collect your order</p>
            </div>
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
          <h3 className="font-bold text-xl mb-4">Order Summary</h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item Total</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-semibold text-secondary">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxes (5%)</span>
              <span className="font-semibold">₹{tax}</span>
            </div>
            <div className="border-t-2 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-xl">Grand Total</span>
              <span className="font-bold text-2xl text-primary">₹{total.toFixed(0)}</span>
            </div>
          </div>
        </Card>

        {/* Cancellation Policy Notice */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            By placing this order, you agree to our{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-primary font-medium underline"
              onClick={() => navigate("/cancellation-refunds")}
            >
              Cancellation & Refunds Policy
            </Button>
            . You have 60 seconds to cancel after order placement.
          </p>
        </Card>
      </main>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="container mx-auto">
          <Button
            size="lg"
            className="w-full rounded-full shadow-xl"
            onClick={handlePlaceOrder}
            disabled={isProcessing || !cartData}
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <div className="flex items-center justify-between w-full">
                <span>Place Order</span>
                <span className="font-semibold">₹{total.toFixed(0)}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
