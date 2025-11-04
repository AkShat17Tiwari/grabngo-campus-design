import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const PolicyFooter = () => {
  return (
    <footer className="mt-12 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Link 
            to="/cancellation-refunds" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Cancellation & Refunds
          </Link>
          <Link 
            to="/terms-conditions" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link 
            to="/shipping" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Pickup Policy
          </Link>
          <Link 
            to="/privacy" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/contact" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
        </div>
        <Separator className="mb-4" />
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GrabNGo. All rights reserved.</p>
          <p className="mt-2">Campus Food Pre-ordering Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default PolicyFooter;
