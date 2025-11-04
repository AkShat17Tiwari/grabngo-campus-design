import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PolicyFooter from "@/components/PolicyFooter";

const CancellationRefunds = () => {
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
            <h1 className="text-xl font-bold">Cancellation & Refunds Policy</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Cancellation & Refunds Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-lg font-semibold mt-6 mb-3">1. Order Cancellation Window</h2>
            <p className="mb-4">
              <strong>60-Second Cancellation Policy:</strong> You have exactly 60 seconds from the moment of order confirmation 
              to cancel your order without any charges. After this window, cancellation is only possible if the vendor has not 
              changed the order status to "Preparing."
            </p>
            <p className="mb-4">
              Once the vendor marks your order as "Preparing," cancellation is no longer available. This ensures minimal food 
              waste and respects the vendor's preparation time. The status of your order can be tracked in real-time on the 
              Orders page.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. How to Cancel an Order</h2>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Navigate to the "Orders" page from your account dashboard</li>
              <li>Locate the order you wish to cancel</li>
              <li>If the order is within the 60-second window or still in "Pending" status, click the "Cancel Order" button</li>
              <li>Confirm the cancellation when prompted</li>
              <li>You will receive a confirmation notification once the cancellation is processed</li>
            </ol>
            <p className="mb-4 text-sm text-muted-foreground">
              <strong>Note:</strong> The cancel button will automatically disappear once the vendor updates the status to 
              "Preparing" or after the 60-second grace period expires.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. Refund Policy</h2>
            <p className="mb-4">
              <strong>Successful Cancellation:</strong> If you cancel your order within the allowed timeframe (60 seconds or 
              before "Preparing" status), a full refund of the order amount (including taxes) will be initiated immediately. 
              No cancellation charges will be applied.
            </p>
            <p className="mb-4">
              <strong>Failed Payments:</strong> In the event of a payment failure or transaction error, any amount debited from 
              your account will be automatically refunded within 5-7 business days. GrabNGo does not retain any funds from failed 
              transactions.
            </p>
            <p className="mb-4">
              <strong>Vendor-Initiated Cancellation:</strong> If the outlet is unable to fulfill your order due to item 
              unavailability, operational issues, or unforeseen circumstances, the vendor may cancel your order. In such cases, 
              you will receive a full refund automatically, along with a notification explaining the reason.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. Refund Processing Time</h2>
            <p className="mb-4">
              Refunds are processed through Razorpay, our secure payment partner. The timeline depends on your payment method:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>UPI / Wallets (PhonePe, Google Pay, Paytm):</strong> 1-3 business days</li>
              <li><strong>Credit / Debit Cards:</strong> 5-7 business days (depending on your bank)</li>
              <li><strong>Net Banking:</strong> 5-7 business days</li>
            </ul>
            <p className="mb-4 text-sm text-muted-foreground">
              If you do not receive your refund within the stipulated time, please contact us at support@grabngo.edu with 
              your order ID and payment reference number.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">5. Quality Issues and Complaints</h2>
            <p className="mb-4">
              GrabNGo is committed to ensuring you receive fresh, quality food. If you encounter any of the following issues 
              upon pickup:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Incorrect items received</li>
              <li>Missing items from your order</li>
              <li>Poor quality or improperly prepared food</li>
              <li>Food safety concerns</li>
            </ul>
            <p className="mb-4">
              <strong>Reporting Procedure:</strong> Please report the issue immediately (within 15 minutes of pickup) by 
              contacting us at support@grabngo.edu. Include:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your order ID</li>
              <li>Clear photos of the issue</li>
              <li>A brief description of the problem</li>
            </ul>
            <p className="mb-4">
              Our team will investigate your complaint and process an appropriate resolution, which may include a partial or 
              full refund, or a replacement order, depending on the severity of the issue.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">6. Non-Refundable Scenarios</h2>
            <p className="mb-4">
              Refunds will <strong>not</strong> be issued in the following cases:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Order was not picked up within the 15-minute grace period after the scheduled pickup time</li>
              <li>You changed your mind after the vendor started preparing your order</li>
              <li>Complaints raised more than 15 minutes after pickup</li>
              <li>Taste or portion size preferences (subjective reasons)</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">7. Contact Support</h2>
            <p className="mb-4">
              For any questions, concerns, or clarifications regarding our Cancellation & Refunds Policy, please reach out to us:
            </p>
            <ul className="list-none mb-4 space-y-2">
              <li><strong>Email:</strong> support@grabngo.edu</li>
              <li><strong>Phone:</strong> +91 9876543210 (Mon-Fri, 9:00 AM - 6:00 PM)</li>
              <li><strong>Response Time:</strong> We aim to respond within 24 hours during business hours</li>
            </ul>
          </CardContent>
        </Card>
        <PolicyFooter />
      </main>
    </div>
  );
};

export default CancellationRefunds;
