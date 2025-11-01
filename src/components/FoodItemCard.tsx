import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FoodItemCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  inStock: boolean;
  quantity?: number;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
  className?: string;
}

export const FoodItemCard = ({
  id,
  name,
  description,
  price,
  image,
  isVeg,
  inStock,
  quantity = 0,
  onAdd,
  onRemove,
  className,
}: FoodItemCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 flex gap-4 hover:shadow-md transition-shadow group",
        !inStock && "opacity-60",
        className
      )}
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
            <span className="text-white text-xs font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{name}</h3>
              <Badge
                variant={isVeg ? "secondary" : "destructive"}
                className="h-4 w-4 p-0 flex items-center justify-center flex-shrink-0"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isVeg ? "bg-secondary" : "bg-destructive"
                )} />
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="font-display font-semibold text-lg">₹{price}</span>

          {inStock ? (
            quantity > 0 ? (
              <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-2 py-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={() => onRemove(id)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="min-w-6 text-center font-medium">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={() => onAdd(id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="rounded-full font-medium"
                onClick={() => onAdd(id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )
          ) : (
            <Badge variant="outline" className="text-destructive border-destructive/50">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
