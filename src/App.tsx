import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import VendorConsole from "./pages/VendorConsole";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import { DesignSystemDemo } from "./components/DesignSystemDemo";
import NotFound from "./pages/NotFound";
import CancellationRefunds from "./pages/CancellationRefunds";
import TermsConditions from "./pages/TermsConditions";
import Shipping from "./pages/Shipping";
import Privacy from "./pages/Privacy";
import ContactUs from "./pages/ContactUs";
import { ChatSupport } from "./components/ChatSupport";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  // Clear any invalid cart data on app load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        // Validate cart structure
        if (!cartData.items || !Array.isArray(cartData.items) || !cartData.outletId) {
          console.log('Clearing invalid cart data');
          localStorage.removeItem('cart');
        } else {
          // Remove items with invalid data
          const validItems = cartData.items.filter((item: any) => 
            item.id && item.name && typeof item.price === 'number' && item.quantity > 0
          );
          if (validItems.length !== cartData.items.length) {
            console.log('Cleaning up invalid cart items');
            if (validItems.length > 0) {
              localStorage.setItem('cart', JSON.stringify({
                ...cartData,
                items: validItems
              }));
            } else {
              localStorage.removeItem('cart');
            }
          }
        }
      } catch (e) {
        console.log('Clearing corrupted cart data');
        localStorage.removeItem('cart');
      }
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/menu/:outletId" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route 
        path="/vendor" 
        element={
          <ProtectedRoute allowedRoles={['vendor_staff']}>
            <VendorConsole />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vendor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['vendor_staff']}>
            <VendorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/design-system" element={<DesignSystemDemo />} />
      <Route path="/cancellation-refunds" element={<CancellationRefunds />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact-us" element={<ContactUs />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
        <ChatSupport />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
