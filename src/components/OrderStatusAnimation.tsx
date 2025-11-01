import { CheckCircle2, ChefHat, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type OrderStatus = "placed" | "preparing" | "ready" | "completed";

interface OrderStatusAnimationProps {
  currentStatus: OrderStatus;
  estimatedTime?: string;
}

const stages = [
  { id: "placed", label: "Placed", icon: Clock },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "ready", label: "Ready for Pickup", icon: Bell },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
] as const;

export const OrderStatusAnimation = ({ currentStatus, estimatedTime }: OrderStatusAnimationProps) => {
  const [prevStatus, setPrevStatus] = useState<OrderStatus>(currentStatus);
  const [bellShake, setBellShake] = useState(false);
  
  // Get current stage index
  const currentStageIndex = stages.findIndex((stage) => stage.id === currentStatus);

  // Trigger bell shake when status changes to "ready"
  useEffect(() => {
    if (currentStatus === "ready" && prevStatus !== "ready") {
      setBellShake(true);
      const timer = setTimeout(() => setBellShake(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevStatus(currentStatus);
  }, [currentStatus, prevStatus]);

  return (
    <div className="w-full py-6">
      {/* Progress Timeline */}
      <div className="relative flex items-center justify-between mb-8">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentStageIndex;
          const isActive = index === currentStageIndex;
          const isFuture = index > currentStageIndex;
          
          return (
            <div key={stage.id} className="flex-1 flex flex-col items-center relative">
              {/* Connecting Line (before marker, except first) */}
              {index > 0 && (
                <div className="absolute right-1/2 top-6 w-full h-1 -z-10">
                  {/* Background line (grey) */}
                  <div className="absolute inset-0 bg-muted rounded-full" />
                  
                  {/* Filled line (animated) */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out origin-left",
                      isCompleted || isActive ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </div>
              )}

              {/* Stage Marker Circle */}
              <div
                className={cn(
                  "relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-out mb-3",
                  "border-2",
                  isCompleted && "bg-primary border-primary shadow-glow",
                  isActive && "bg-primary border-primary shadow-glow animate-pulse-slow",
                  isFuture && "bg-muted border-muted",
                  // Special bell shake animation for "Ready for Pickup"
                  stage.id === "ready" && bellShake && "animate-bell-shake"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-colors duration-500",
                    (isCompleted || isActive) && "text-primary-foreground",
                    isFuture && "text-muted-foreground"
                  )}
                />
                
                {/* Pulse ring for active stage */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                )}
              </div>

              {/* Stage Label */}
              <p
                className={cn(
                  "text-xs md:text-sm font-medium text-center transition-colors duration-500 max-w-[80px]",
                  (isCompleted || isActive) && "text-foreground",
                  isFuture && "text-muted-foreground"
                )}
              >
                {stage.label}
              </p>

              {/* Active stage indicator */}
              {isActive && (
                <div className="mt-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Estimated Time Display */}
      {estimatedTime && currentStatus !== "completed" && (
        <div className="text-center animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Estimated pickup time
          </p>
          <p className="text-lg font-semibold text-foreground mt-1">
            {estimatedTime}
          </p>
        </div>
      )}

      {/* Ready for Pickup Alert */}
      {currentStatus === "ready" && (
        <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/30 rounded-xl animate-scale-in">
          <div className="flex items-center justify-center gap-3">
            <Bell className="w-5 h-5 text-primary animate-bounce" />
            <p className="font-semibold text-primary">
              Your order is ready! Please pick it up.
            </p>
            <Bell className="w-5 h-5 text-primary animate-bounce" />
          </div>
        </div>
      )}

      {/* Completed Celebration */}
      {currentStatus === "completed" && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl animate-scale-in">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-600">
              Order completed! Thank you for using GrabNGo 🎉
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
