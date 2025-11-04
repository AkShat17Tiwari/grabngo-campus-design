import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

            <h2 className="text-lg font-semibold mt-6 mb-3">Order Cancellation</h2>
            <p className="mb-4">
              You can cancel your order within 5 minutes of placing it. Once the restaurant starts preparing your order, 
              cancellation will not be possible. To cancel an order, please visit the Orders page and select the cancel option.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Refund Policy</h2>
            <p className="mb-4">
              If you cancel your order within the allowed timeframe, a full refund will be processed to your original 
              payment method within 5-7 business days. For orders that cannot be fulfilled due to unavailability of items 
              or other restaurant-related issues, a full refund will be initiated automatically.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Refund Processing Time</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>UPI/Wallet: 1-3 business days</li>
              <li>Credit/Debit Cards: 5-7 business days</li>
              <li>Net Banking: 5-7 business days</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">Quality Issues</h2>
            <p className="mb-4">
              If you receive food that doesn't meet quality standards, please contact us within 30 minutes of delivery 
              with photos of the issue. We will investigate and process appropriate refunds or replacements on a case-by-case basis.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">
              For any questions about our cancellation and refund policy, please contact our support team.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CancellationRefunds;
