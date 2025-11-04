import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PolicyFooter from "@/components/PolicyFooter";

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
              By creating an account, placing an order, or accessing any part of the GrabNGo platform ("the Service"), you 
              ("the User" or "you") agree to comply with and be bound by these Terms and Conditions. If you do not agree to 
              these terms, you must immediately discontinue use of the Service.
            </p>
            <p className="mb-4">
              These terms constitute a legally binding agreement between you and GrabNGo. Your continued use of the platform 
              after any modifications to these terms signifies your acceptance of such changes.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. Service Description</h2>
            <p className="mb-4">
              GrabNGo is a digital platform designed exclusively for college students and campus community members to pre-order 
              food from campus outlets. The Service enables:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Browsing menus from authorized campus food outlets</li>
              <li>Placing advance orders for pickup during scheduled breaks</li>
              <li>Secure online payment processing via Razorpay</li>
              <li>Real-time order tracking and status updates</li>
              <li>Personalized food recommendations based on order history</li>
            </ul>
            <p className="mb-4">
              <strong>Important:</strong> GrabNGo acts solely as a technology intermediary. We do not prepare, package, or 
              sell food. All food items are prepared and provided by independent campus outlets. Each outlet is solely 
              responsible for food quality, hygiene, and preparation standards.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. Eligibility and User Accounts</h2>
            <p className="mb-4">
              <strong>Eligibility:</strong> The Service is available only to enrolled students, faculty, and staff members of 
              participating educational institutions. By registering, you represent that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>You are currently affiliated with the institution</li>
              <li>You are at least 18 years of age or have parental/guardian consent</li>
              <li>All information provided during registration is accurate and truthful</li>
            </ul>
            <p className="mb-4">
              <strong>Account Security:</strong> You are solely responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities conducted through your account</li>
              <li>Immediately notifying GrabNGo of any unauthorized access or security breach</li>
            </ul>
            <p className="mb-4">
              GrabNGo reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. Orders and Payments</h2>
            <p className="mb-4">
              <strong>Order Placement:</strong> All orders are subject to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Outlet availability and operating hours</li>
              <li>Menu item availability at the time of order processing</li>
              <li>Acceptance by the outlet (outlets reserve the right to reject orders)</li>
            </ul>
            <p className="mb-4">
              <strong>Pricing:</strong> All prices displayed are in Indian Rupees (₹) and include applicable taxes. Prices are 
              subject to change without prior notice. The price charged will be the price displayed at the time of order confirmation.
            </p>
            <p className="mb-4">
              <strong>Payment Processing:</strong> Payments are processed securely through Razorpay, a PCI-DSS compliant payment 
              gateway. Accepted payment methods include:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>UPI (PhonePe, Google Pay, Paytm, etc.)</li>
              <li>Credit/Debit Cards (Visa, MasterCard, RuPay)</li>
              <li>Net Banking</li>
              <li>Digital Wallets</li>
            </ul>
            <p className="mb-4 text-sm text-muted-foreground">
              Note: GrabNGo does not store or have access to your payment card details. All payment information is handled 
              exclusively by Razorpay.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">5. Pickup Policy and Timelines</h2>
            <p className="mb-4">
              <strong>Scheduled Pickup:</strong> GrabNGo operates on a scheduled pickup model designed to minimize wait times 
              during short break periods. Upon order confirmation, you will receive:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Estimated pickup time slot</li>
              <li>Outlet location details</li>
              <li>Order ID for verification at pickup</li>
            </ul>
            <p className="mb-4">
              <strong>Pickup Guidelines:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Arrive at the outlet during your assigned pickup window</li>
              <li>Present your Order ID to the outlet staff</li>
              <li>Verify the order contents before leaving the premises</li>
            </ul>
            <p className="mb-4">
              <strong>Late Pickup:</strong> If you are unable to arrive within the scheduled pickup time, your order will be held 
              for a maximum of <strong>15 minutes</strong>. After this grace period, the outlet reserves the right to cancel your 
              order without refund, as food quality and freshness cannot be guaranteed.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">6. User Responsibilities and Conduct</h2>
            <p className="mb-4">
              You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
              <li>Provide accurate order and contact information</li>
              <li>Treat outlet staff with respect and courtesy</li>
              <li>Adhere to campus conduct policies and regulations</li>
              <li>Not misuse, manipulate, or attempt to defraud the Service</li>
              <li>Not share your account credentials with others</li>
            </ul>
            <p className="mb-4">
              <strong>Prohibited Activities:</strong> You must not:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Abuse the cancellation policy to repeatedly cancel orders</li>
              <li>Place fraudulent orders or use stolen payment methods</li>
              <li>Attempt to reverse-engineer, hack, or compromise the platform</li>
              <li>Submit false complaints or negative feedback maliciously</li>
            </ul>
            <p className="mb-4">
              Violation of these conduct rules may result in account suspension or permanent termination.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">7. Intellectual Property</h2>
            <p className="mb-4">
              All content on the GrabNGo platform, including but not limited to logos, branding, text, graphics, software, and 
              design elements, are the intellectual property of GrabNGo or its licensors. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Reproduce, distribute, or publicly display any platform content without permission</li>
              <li>Use GrabNGo branding for commercial purposes</li>
              <li>Copy or scrape data from the platform using automated tools</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>GrabNGo shall not be liable for any indirect, incidental, consequential, or punitive damages</li>
              <li>Our total liability for any claim arising from your use of the Service shall not exceed the total amount you 
              paid for the specific order in question</li>
              <li>We are not responsible for food quality, allergic reactions, food poisoning, or preparation errors—these are 
              the sole responsibility of the outlet</li>
              <li>We are not liable for delays, cancellations, or service interruptions caused by technical issues, third-party 
              failures, or force majeure events</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">9. Dispute Resolution</h2>
            <p className="mb-4">
              Any disputes arising from or related to these Terms shall be resolved through:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li><strong>Good Faith Negotiation:</strong> Contact our support team to seek an amicable resolution</li>
              <li><strong>Mediation:</strong> If unresolved, disputes may be referred to mediation</li>
              <li><strong>Jurisdiction:</strong> All legal disputes shall be subject to the exclusive jurisdiction of the courts 
              in [Your City/State]</li>
            </ol>

            <h2 className="text-lg font-semibold mt-6 mb-3">10. Modifications to Terms</h2>
            <p className="mb-4">
              GrabNGo reserves the right to modify these Terms and Conditions at any time. Material changes will be communicated via:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Email notification to registered users</li>
              <li>In-app notification</li>
              <li>Update on this page with a revised "Last Updated" date</li>
            </ul>
            <p className="mb-4">
              Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">11. Termination</h2>
            <p className="mb-4">
              GrabNGo reserves the right to suspend or terminate your account at any time, with or without notice, if:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>You violate these Terms and Conditions</li>
              <li>You engage in fraudulent or abusive behavior</li>
              <li>Your account remains inactive for an extended period</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">12. Contact Information</h2>
            <p className="mb-4">
              For questions, concerns, or clarifications regarding these Terms and Conditions, please contact us at:
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

export default TermsConditions;
