import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { OutletCard } from "@/components/OutletCard";
import { FoodItemCard } from "@/components/FoodItemCard";
import { Search, Mail, Lock } from "lucide-react";
import { useState } from "react";

export const DesignSystemDemo = () => {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display mb-2">GrabNGo Design System</h1>
        <p className="text-muted-foreground text-lg">
          Clean, energetic color palette and component library for college students
        </p>
      </div>

      {/* Color Palette */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h2 className="font-display">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-primary shadow-lg" />
            <p className="font-medium">Primary</p>
            <p className="text-sm text-muted-foreground">Energy & Appetite</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-secondary shadow-lg" />
            <p className="font-medium">Secondary</p>
            <p className="text-sm text-muted-foreground">Healthy & Fresh</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-accent shadow-lg" />
            <p className="font-medium">Accent</p>
            <p className="text-sm text-muted-foreground">Trust & Speed</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-muted border shadow-lg" />
            <p className="font-medium">Muted</p>
            <p className="text-sm text-muted-foreground">Neutral Tones</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h2 className="font-display">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1>Display Heading (Poppins Bold)</h1>
            <p className="text-sm text-muted-foreground">H1 - For hero sections and page titles</p>
          </div>
          <div>
            <h2>Section Heading (Poppins Bold)</h2>
            <p className="text-sm text-muted-foreground">H2 - For section titles</p>
          </div>
          <div>
            <h3>Subsection Heading (Poppins Semibold)</h3>
            <p className="text-sm text-muted-foreground">H3 - For subsections</p>
          </div>
          <div>
            <p className="text-lg">Body text uses Inter for excellent readability at all sizes.</p>
            <p className="text-sm text-muted-foreground">Perfect for long-form content and descriptions</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h2 className="font-display">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <Button className="w-full">Primary Button</Button>
            <p className="text-sm text-muted-foreground">Main actions (Order, Add to Cart)</p>
          </div>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full">Secondary Button</Button>
            <p className="text-sm text-muted-foreground">Supporting actions</p>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">Outline Button</Button>
            <p className="text-sm text-muted-foreground">Tertiary actions</p>
          </div>
          <div className="space-y-3">
            <Button variant="gradient" className="w-full">Gradient Button</Button>
            <p className="text-sm text-muted-foreground">Special promotions</p>
          </div>
          <div className="space-y-3">
            <Button variant="ghost" className="w-full">Ghost Button</Button>
            <p className="text-sm text-muted-foreground">Subtle interactions</p>
          </div>
          <div className="space-y-3">
            <Button size="lg" className="w-full">Large Button</Button>
            <p className="text-sm text-muted-foreground">Checkout, major CTAs</p>
          </div>
        </div>
      </section>

      {/* Input Fields */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h2 className="font-display">Input Fields</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Email Address"
            placeholder="john@college.edu"
            type="email"
            icon={<Mail className="h-4 w-4" />}
            helperText="Use your college email"
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            type="password"
            icon={<Lock className="h-4 w-4" />}
          />
          <InputField
            label="Search"
            placeholder="Search outlets or cuisines..."
            icon={<Search className="h-4 w-4" />}
          />
          <InputField
            label="Phone Number"
            placeholder="+91 98765 43210"
            error="Please enter a valid phone number"
          />
        </div>
      </section>

      {/* Outlet Cards */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h2 className="font-display">Outlet Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <OutletCard
            id={1}
            name="Campus Café"
            cuisine="Coffee & Snacks"
            rating={4.5}
            distance="100m"
            time="10-15 min"
            image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop"
            isOpen={true}
          />
          <OutletCard
            id={2}
            name="Pizza Paradise"
            cuisine="Italian"
            rating={4.7}
            distance="250m"
            time="15-20 min"
            image="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop"
            isOpen={true}
          />
          <OutletCard
            id={3}
            name="Burger Junction"
            cuisine="American"
            rating={4.3}
            distance="180m"
            time="12-18 min"
            image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop"
            isOpen={false}
          />
        </div>
      </section>

      {/* Food Item Cards */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h2 className="font-display">Food Item Cards</h2>
        <div className="space-y-4 max-w-2xl">
          <FoodItemCard
            id={1}
            name="Classic Burger"
            description="Juicy beef patty with fresh vegetables and our special sauce"
            price={149}
            image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop"
            isVeg={false}
            inStock={true}
            quantity={quantity}
            onAdd={() => setQuantity(q => q + 1)}
            onRemove={() => setQuantity(q => Math.max(0, q - 1))}
          />
          <FoodItemCard
            id={2}
            name="Margherita Pizza"
            description="Fresh mozzarella, tomatoes, and basil on thin crust"
            price={199}
            image="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop"
            isVeg={true}
            inStock={true}
            quantity={0}
            onAdd={() => {}}
            onRemove={() => {}}
          />
          <FoodItemCard
            id={3}
            name="Chicken Wings"
            description="Spicy buffalo wings with ranch dip"
            price={179}
            image="https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&auto=format&fit=crop"
            isVeg={false}
            inStock={false}
            quantity={0}
            onAdd={() => {}}
            onRemove={() => {}}
          />
        </div>
      </section>

      {/* Design Principles */}
      <section className="max-w-6xl mx-auto space-y-6">
        <h2 className="font-display">Design Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border bg-card space-y-2">
            <h3 className="font-display text-primary">Energetic</h3>
            <p className="text-sm text-muted-foreground">
              Vibrant orange and green colors create excitement and appetite appeal for college students.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-card space-y-2">
            <h3 className="font-display text-secondary">Clean</h3>
            <p className="text-sm text-muted-foreground">
              Generous white space and clear typography ensure easy navigation and readability.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-card space-y-2">
            <h3 className="font-display text-accent">Fast</h3>
            <p className="text-sm text-muted-foreground">
              Mobile-first design with smooth transitions optimized for quick ordering on-the-go.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
