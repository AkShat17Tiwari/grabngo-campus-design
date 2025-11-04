import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PolicyFooter from "@/components/PolicyFooter";

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
            <h1 className="text-xl font-bold">Pickup Policy</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Pickup Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-lg font-semibold mt-6 mb-3">1. Pickup-Only Service Model</h2>
            <p className="mb-4">
              <strong>No Home Delivery:</strong> GrabNGo operates exclusively on a scheduled pickup model. We do not provide 
              home delivery, dorm delivery, or any courier services. This model is designed to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Minimize waiting times during short class breaks (typically 10-20 minutes)</li>
              <li>Ensure food freshness by reducing transit time</li>
              <li>Keep costs low for students by eliminating delivery fees</li>
              <li>Allow for quick, efficient order fulfillment during peak campus hours</li>
            </ul>
            <p className="mb-4">
              All orders must be collected in person from the designated campus outlet. You cannot send someone else to pick 
              up your order unless you provide them with your Order ID.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. Scheduled Pickup Times</h2>
            <p className="mb-4">
              After placing your order, you will receive a confirmation message containing:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Estimated Pickup Time Slot:</strong> A specific time window (e.g., 1:15 PM - 1:25 PM)</li>
              <li><strong>Order ID:</strong> A unique identifier required at pickup</li>
              <li><strong>Outlet Location:</strong> The exact campus outlet location with directions</li>
            </ul>
            <p className="mb-4">
              The pickup time is dynamically calculated based on:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Current order queue length at the outlet</li>
              <li>Complexity and quantity of items ordered</li>
              <li>Real-time preparation times</li>
            </ul>
            <p className="mb-4 text-sm text-muted-foreground">
              <strong>Tip:</strong> To ensure you receive your order during your break, place orders at least 10-15 minutes 
              before your desired pickup time, especially during peak hours (12:00 PM - 2:00 PM).
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. Order Preparation Timelines</h2>
            <p className="mb-4">
              Typical preparation times vary based on order complexity:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Standard Orders (1-3 items):</strong> 8-12 minutes</li>
              <li><strong>Large Orders (4+ items or bulk orders):</strong> 15-20 minutes</li>
              <li><strong>Peak Hours (12:00 PM - 2:00 PM, 5:00 PM - 7:00 PM):</strong> Additional 5-10 minutes due to high volume</li>
            </ul>
            <p className="mb-4">
              These are estimates and may vary depending on outlet-specific factors. You can track your order status in real-time 
              via the Orders page:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Order Placed:</strong> Outlet has received your order</li>
              <li><strong>Preparing:</strong> Your food is being cooked and packaged</li>
              <li><strong>Ready for Pickup:</strong> Your order is ready—please collect immediately</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. How to Pick Up Your Order</h2>
            <p className="mb-4">
              Follow these steps for a smooth pickup experience:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li><strong>Arrive During Your Pickup Window:</strong> Check your order confirmation for the exact time slot</li>
              <li><strong>Locate the Outlet:</strong> Refer to the outlet location details provided in your order confirmation</li>
              <li><strong>Present Your Order ID:</strong> Show your Order ID (visible in the Orders page) to the outlet staff</li>
              <li><strong>Verify Your Order:</strong> Check the items and quantities before leaving the pickup counter</li>
              <li><strong>Report Issues Immediately:</strong> If anything is incorrect or missing, inform the staff before leaving</li>
            </ol>
            <p className="mb-4 text-sm text-muted-foreground">
              <strong>Note:</strong> Do not leave the outlet premises until you have verified your order. Complaints about missing 
              or incorrect items cannot be accepted after you leave the pickup area.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">5. Late Pickup Policy - 15-Minute Grace Period</h2>
            <p className="mb-4">
              <strong>Grace Period:</strong> If you are unable to arrive within your scheduled pickup time, your order will be 
              held for a maximum of <strong>15 minutes</strong> beyond the pickup window. This grace period accounts for:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Unexpected class delays</li>
              <li>Minor navigation issues on campus</li>
              <li>Short queue at the pickup counter</li>
            </ul>
            <p className="mb-4">
              <strong>After 15 Minutes:</strong> If you do not pick up your order within 15 minutes of the scheduled time:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>The outlet reserves the right to cancel your order</li>
              <li><strong>No refund will be issued</strong>, as food quality and freshness cannot be guaranteed after prolonged holding</li>
              <li>The outlet may dispose of unclaimed orders to maintain hygiene standards</li>
            </ul>
            <p className="mb-4 text-sm text-muted-foreground">
              <strong>What to Do If You're Running Late:</strong> If you anticipate being late, contact the outlet directly 
              (contact details provided in your order confirmation) or use the in-app chat to request an extension. Extensions 
              are granted at the outlet's discretion.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">6. Order Modifications and Changes</h2>
            <p className="mb-4">
              <strong>Before Preparation Starts:</strong> Once an order is placed, modifications (adding/removing items, changing 
              quantities) may not be possible through the app. However, you can attempt to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Cancel the order immediately (within 60 seconds) and place a new one</li>
              <li>Contact the outlet directly via phone before the order status changes to "Preparing"</li>
            </ul>
            <p className="mb-4">
              <strong>After Preparation Starts:</strong> Modifications are not permitted once the outlet begins preparing your order. 
              Requests for changes after this point will be declined.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">7. Special Instructions and Dietary Requirements</h2>
            <p className="mb-4">
              During checkout, you can add special instructions in the "Special Instructions" field. Examples include:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>"Less spicy"</li>
              <li>"No onions"</li>
              <li>"Extra sauce on the side"</li>
              <li>"Allergen information: No peanuts"</li>
            </ul>
            <p className="mb-4">
              <strong>Important Disclaimer:</strong> While outlets make every effort to accommodate special requests, we cannot 
              guarantee fulfillment. For critical dietary restrictions (severe allergies, religious requirements), please contact 
              the outlet directly before placing your order.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">8. Order Tracking and Status Updates</h2>
            <p className="mb-4">
              Track your order in real-time via the <strong>Orders</strong> page. You will receive notifications at each stage:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Order Placed:</strong> Payment successful, order sent to outlet</li>
              <li><strong>Preparing:</strong> Outlet is cooking your food</li>
              <li><strong>Ready for Pickup:</strong> Your order is packed and waiting—please collect immediately</li>
              <li><strong>Completed:</strong> Order has been picked up</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">9. Contact Support</h2>
            <p className="mb-4">
              For questions or concerns about pickup, delays, or outlet locations, contact us:
            </p>
            <ul className="list-none mb-4 space-y-2">
              <li><strong>Email:</strong> support@grabngo.edu</li>
              <li><strong>Phone:</strong> +91 9876543210</li>
              <li><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</li>
            </ul>
          </CardContent>
        </Card>
        <PolicyFooter />
      </main>
    </div>
  );
};

export default Shipping;
