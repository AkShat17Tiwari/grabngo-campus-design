import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, User, BarChart3, Store, Home, ShoppingCart, Package, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { role } = useRole();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

  const roleBasedLinks = () => {
    if (!role) return null;

    switch (role) {
      case "admin":
        return (
          <>
            <Link to="/admin/dashboard">
              <Button variant={location.pathname.startsWith("/admin") ? "default" : "ghost"} size="sm" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Admin Dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button variant={location.pathname === "/" ? "default" : "ghost"} size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </>
        );
      case "vendor_staff":
        return (
          <>
            <Link to="/vendor">
              <Button variant={location.pathname === "/vendor" && !location.pathname.includes("/dashboard") ? "default" : "ghost"} size="sm" className="gap-2">
                <Store className="h-4 w-4" />
                Console
              </Button>
            </Link>
            <Link to="/vendor/dashboard">
              <Button variant={location.pathname === "/vendor/dashboard" ? "default" : "ghost"} size="sm" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant={location.pathname === "/orders" ? "default" : "ghost"} size="sm" className="gap-2">
                <Package className="h-4 w-4" />
                Orders
              </Button>
            </Link>
          </>
        );
      case "customer":
      default:
        return (
          <>
            <Link to="/">
              <Button variant={location.pathname === "/" ? "default" : "ghost"} size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant={location.pathname === "/menu" ? "default" : "ghost"} size="sm" className="gap-2">
                <Package className="h-4 w-4" />
                Menu
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant={location.pathname === "/cart" ? "default" : "ghost"} size="sm" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant={location.pathname === "/orders" ? "default" : "ghost"} size="sm" className="gap-2">
                <Package className="h-4 w-4" />
                Orders
              </Button>
            </Link>
          </>
        );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link to="/auth">
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:flex items-center gap-2">
        {roleBasedLinks()}
      </div>
      
      <ThemeToggle />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <Settings className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
