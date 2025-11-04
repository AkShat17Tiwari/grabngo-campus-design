import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PolicyFooter from "@/components/PolicyFooter";

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
              GrabNGo collects and processes the following categories of personal information to provide, maintain, and improve our services:
            </p>
            
            <h3 className="text-base font-semibold mt-4 mb-2">A. Information You Provide Directly</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Full name, email address, phone number, and password (encrypted)</li>
              <li><strong>Profile Data:</strong> Optional profile picture, campus affiliation, and dietary preferences</li>
              <li><strong>Order Data:</strong> Food items ordered, quantities, special instructions, and pickup preferences</li>
              <li><strong>Communication Data:</strong> Messages sent through in-app chat, support tickets, and feedback</li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">B. Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Order History:</strong> Complete record of all orders placed, including timestamps, outlet names, and order values</li>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, and IP address</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform, and navigation patterns</li>
              <li><strong>Location Data:</strong> General campus location (if permissions are granted) to suggest nearby outlets</li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">C. Payment Information (Handled by Razorpay)</h3>
            <p className="mb-4">
              <strong>Important:</strong> GrabNGo does <u>not</u> store or have access to your complete payment card details 
              (card numbers, CVV, expiry dates, etc.). All payment processing is handled securely by <strong>Razorpay</strong>, 
              a PCI-DSS Level 1 compliant payment gateway.
            </p>
            <p className="mb-4">
              We only receive and store:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Payment status (success/failure)</li>
              <li>Transaction ID (for reconciliation and refunds)</li>
              <li>Payment method used (e.g., UPI, Credit Card, Debit Card—without specific details)</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use your personal information for the following purposes:
            </p>

            <h3 className="text-base font-semibold mt-4 mb-2">A. Order Fulfillment and Service Delivery</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Processing and confirming your food orders</li>
              <li>Communicating order status updates (Preparing, Ready for Pickup, etc.)</li>
              <li>Coordinating pickup times with campus outlets</li>
              <li>Handling order cancellations and refunds</li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">B. Personalization and Recommendations</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>AI-Powered Recommendations:</strong> Analyzing your order history to suggest menu items you might like</li>
              <li>Customizing your homepage with frequently ordered items</li>
              <li>Highlighting new menu items from outlets you frequently visit</li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">C. Platform Improvement and Analytics</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Analyzing usage patterns to improve app performance and user experience</li>
              <li>Identifying and fixing technical issues</li>
              <li>Understanding peak ordering times to optimize outlet operations</li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">D. Communication and Support</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Responding to customer support inquiries</li>
              <li>Sending transactional notifications (order confirmations, refund alerts)</li>
              <li>Providing important service updates (outlet closures, system maintenance)</li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">E. Security and Fraud Prevention</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Detecting and preventing fraudulent orders or payment attempts</li>
              <li>Monitoring for suspicious account activity</li>
              <li>Enforcing our Terms and Conditions</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. Information Sharing and Disclosure</h2>
            <p className="mb-4">
              We share your personal information only in the following circumstances:
            </p>

            <h3 className="text-base font-semibold mt-4 mb-2">A. With Campus Outlets (Order Fulfillment)</h3>
            <p className="mb-4">
              To fulfill your orders, we share the following information with the specific outlet:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your name and phone number (for pickup verification)</li>
              <li>Order details (items, quantities, special instructions)</li>
              <li>Order ID and pickup time</li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">B. With Razorpay (Payment Processing)</h3>
            <p className="mb-4">
              To process payments, we share minimal necessary information with Razorpay, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Order amount and currency</li>
              <li>Customer name, email, and phone number (for payment authentication)</li>
            </ul>
            <p className="mb-4 text-sm text-muted-foreground">
              Razorpay's privacy policy governs how they handle your payment information. Visit 
              <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Razorpay Privacy Policy</a> for details.
            </p>

            <h3 className="text-base font-semibold mt-4 mb-2">C. With Service Providers</h3>
            <p className="mb-4">
              We may share information with third-party vendors who assist us in operating the platform, such as:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Cloud hosting providers (for secure data storage)</li>
              <li>Analytics tools (for usage statistics and performance monitoring)</li>
              <li>Customer support platforms</li>
            </ul>
            <p className="mb-4 text-sm text-muted-foreground">
              All service providers are contractually obligated to protect your information and use it only for specified purposes.
            </p>

            <h3 className="text-base font-semibold mt-4 mb-2">D. For Legal and Safety Reasons</h3>
            <p className="mb-4">
              We may disclose your information if required to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Comply with legal obligations (court orders, subpoenas)</li>
              <li>Enforce our Terms and Conditions</li>
              <li>Protect the safety and security of users or the public</li>
              <li>Investigate fraud, security incidents, or policy violations</li>
            </ul>

            <p className="mb-4">
              <strong>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</strong>
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Encryption:</strong> All sensitive data (passwords, payment transactions) is encrypted using SSL/TLS</li>
              <li><strong>Access Controls:</strong> Only authorized personnel have access to user data</li>
              <li><strong>Regular Security Audits:</strong> We conduct periodic vulnerability assessments</li>
              <li><strong>Secure Payment Processing:</strong> Razorpay handles all payment data using PCI-DSS compliant infrastructure</li>
            </ul>
            <p className="mb-4 text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> While we take all reasonable precautions, no method of transmission over the internet 
              or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">5. Your Privacy Rights</h2>
            <p className="mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information in your account settings</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data (subject to legal retention requirements)</li>
              <li><strong>Data Portability:</strong> Export your order history and account data in a portable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from promotional communications (transactional messages cannot be opted out)</li>
            </ul>
            <p className="mb-4">
              To exercise any of these rights, contact us at support@grabngo.edu. We will respond within 30 days.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">6. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              GrabNGo uses cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Session Cookies:</strong> Keep you logged in during your session</li>
              <li><strong>Preference Cookies:</strong> Remember your settings (dark mode, language preferences)</li>
              <li><strong>Analytics Cookies:</strong> Understand how users interact with the platform (anonymized data)</li>
            </ul>
            <p className="mb-4">
              You can control cookies through your browser settings. Note that disabling cookies may limit certain features of the platform.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">7. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for the following periods:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Account Data:</strong> As long as your account is active</li>
              <li><strong>Order History:</strong> Up to 2 years for analytics and recommendations</li>
              <li><strong>Payment Records:</strong> Up to 7 years for tax and compliance purposes</li>
              <li><strong>Support Communications:</strong> Up to 1 year after resolution</li>
            </ul>
            <p className="mb-4">
              After these periods, data is anonymized or securely deleted. You may request early deletion by contacting support.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">8. Children's Privacy</h2>
            <p className="mb-4">
              GrabNGo is intended for users aged 18 and above. If you are under 18, you may use the platform only with parental 
              or guardian consent. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">9. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              Material changes will be communicated via:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Email notification to registered users</li>
              <li>In-app notification banner</li>
              <li>Updated "Last Updated" date at the top of this policy</li>
            </ul>
            <p className="mb-4">
              Continued use of GrabNGo after such changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">10. Contact Us</h2>
            <p className="mb-4">
              For questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
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

export default Privacy;
