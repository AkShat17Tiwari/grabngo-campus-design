import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CreditCard, Wallet, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [instructions, setInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success("Order placed successfully!");
      navigate("/orders");
    }, 2000);
  };

  const total = 605;

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
              <h3 className="font-semibold mb-1">Pickup Time</h3>
              <p className="text-sm text-muted-foreground">
                Ready in 15-20 minutes
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated at 2:30 PM
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
        <Card className="p-5 border-2">
          <h3 className="font-bold text-xl mb-4">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            {/* Razorpay - Primary Payment Option */}
            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <Label
                htmlFor="razorpay"
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-base">Pay with Razorpay</p>
                  <p className="text-sm text-muted-foreground">
                    UPI, Cards, Wallets & More - Safe & Secure
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="upi" id="upi" />
              <Label
                htmlFor="upi"
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                <Wallet className="h-6 w-6 text-secondary" />
                <div>
                  <p className="font-medium">UPI Direct</p>
                  <p className="text-sm text-muted-foreground">
                    PhonePe, Google Pay, Paytm
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <p className="font-medium">Cash on Pickup</p>
                <p className="text-sm text-muted-foreground">
                  Pay when you collect your order
                </p>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Order Summary */}
        <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
          <h3 className="font-bold text-xl mb-4">Order Summary</h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item Total</span>
              <span className="font-semibold">₹565</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-semibold text-secondary">₹20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxes (5%)</span>
              <span className="font-semibold">₹20</span>
            </div>
            <div className="border-t-2 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-xl">Grand Total</span>
              <span className="font-bold text-2xl text-primary">₹{total}</span>
            </div>
          </div>
        </Card>
      </main>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="container mx-auto">
          <Button
            size="lg"
            className="w-full rounded-full shadow-xl"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <div className="flex items-center justify-between w-full">
                <span>Place Order</span>
                <span className="font-semibold">₹{total}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
