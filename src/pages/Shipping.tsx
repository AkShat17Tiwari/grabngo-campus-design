import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Shipping & Pickup Policy</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Pickup Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Pickup Service</h2>
            <p className="mb-4">
              Our platform operates on a pickup model. We do not offer home delivery services. All orders must be 
              collected from the restaurant at the specified pickup time.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Pickup Times</h2>
            <p className="mb-4">
              After placing your order, you will receive an estimated pickup time. This time is calculated based on 
              the restaurant's preparation time and current order volume. Please arrive at the restaurant during your 
              pickup window.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Order Preparation</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Standard orders: 15-30 minutes preparation time</li>
              <li>Large orders: 30-45 minutes preparation time</li>
              <li>Peak hours: Additional 10-15 minutes may be required</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">Pickup Instructions</h2>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Check your order confirmation for the exact pickup address</li>
              <li>Arrive at the restaurant during your pickup window</li>
              <li>Present your order ID to the restaurant staff</li>
              <li>Verify your order before leaving the premises</li>
            </ol>

            <h2 className="text-lg font-semibold mt-6 mb-3">Late Pickups</h2>
            <p className="mb-4">
              If you cannot arrive during your scheduled pickup time, please contact the restaurant directly. Orders 
              held for more than 30 minutes past the pickup time may be cancelled without refund, as food quality cannot 
              be guaranteed.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Order Changes</h2>
            <p className="mb-4">
              Once an order is placed, modifications may not be possible. Please contact the restaurant immediately if 
              you need to make changes. Changes are subject to the restaurant's discretion and preparation status.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Special Requests</h2>
            <p className="mb-4">
              Special instructions can be added during checkout. However, we cannot guarantee that all special requests 
              will be accommodated. Please contact the restaurant directly for specific dietary requirements or modifications.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Shipping;
