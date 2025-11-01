import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [instructions, setInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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
        {/* Delivery Details */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Delivery Location</h3>
              <p className="text-sm text-muted-foreground">
                Main Campus, Building A, Room 201
              </p>
              <Button variant="link" className="h-auto p-0 text-primary mt-1">
                Change
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
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="upi" id="upi" />
              <Label
                htmlFor="upi"
                className="flex items-center gap-2 flex-1 cursor-pointer"
              >
                <Wallet className="h-5 w-5" />
                <div>
                  <p className="font-medium">UPI / Wallet</p>
                  <p className="text-xs text-muted-foreground">
                    PhonePe, Google Pay, Paytm
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="card" id="card" />
              <Label
                htmlFor="card"
                className="flex items-center gap-2 flex-1 cursor-pointer"
              >
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">Credit / Debit Card</p>
                  <p className="text-xs text-muted-foreground">
                    Visa, Mastercard, RuPay
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">
                  Pay when you receive
                </p>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Order Summary */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item Total</span>
              <span>₹565</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>₹20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxes</span>
              <span>₹20</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>₹{total}</span>
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
