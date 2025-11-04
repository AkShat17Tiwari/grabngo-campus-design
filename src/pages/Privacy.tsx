import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
            <h1 className="text-xl font-bold">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-lg font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Name and contact information (email, phone number)</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Order history and preferences</li>
              <li>Account credentials</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send you promotional communications (with your consent)</li>
              <li>Improve our services and user experience</li>
              <li>Detect and prevent fraud</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. Information Sharing</h2>
            <p className="mb-4">
              We share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Restaurants to fulfill your orders</li>
              <li>Payment processors to complete transactions</li>
              <li>Service providers who assist in operating our platform</li>
              <li>Law enforcement when required by law</li>
            </ul>
            <p className="mb-4">
              We do not sell your personal information to third parties.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">5. Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and information</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">6. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver 
              personalized content. You can control cookies through your browser settings.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">7. Data Retention</h2>
            <p className="mb-4">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. 
              You may request deletion of your account and data at any time.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">8. Changes to Privacy Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any material changes by posting 
              the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">9. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact our support team.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Privacy;
