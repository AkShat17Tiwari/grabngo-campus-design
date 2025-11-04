import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
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
            <h1 className="text-xl font-bold">Terms and Conditions</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-lg font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using this food ordering platform, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to these terms, please do not use our service.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. Service Description</h2>
            <p className="mb-4">
              Our platform connects customers with local restaurants for food ordering and pickup. We facilitate the 
              ordering process but do not prepare or deliver the food ourselves. Each restaurant is responsible for 
              food preparation and quality.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. User Accounts</h2>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
              responsibility for all activities that occur under your account. You must notify us immediately of any 
              unauthorized use of your account.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. Orders and Payments</h2>
            <p className="mb-4">
              All orders are subject to acceptance by the restaurant. Prices are as displayed at the time of ordering. 
              We reserve the right to refuse or cancel any order for any reason. Payment must be made through our 
              approved payment methods.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">5. Pickup</h2>
            <p className="mb-4">
              Orders are prepared for pickup at the designated restaurant location. You must pick up your order within 
              the specified time window. We are not responsible for orders that are not picked up.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
            <p className="mb-4">
              We shall not be liable for any indirect, incidental, special, or consequential damages arising out of or 
              in connection with the use of our service. Our total liability shall not exceed the amount paid for the order.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">7. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Continued use of the service after changes 
              constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">8. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms and Conditions, please contact our support team.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TermsConditions;
