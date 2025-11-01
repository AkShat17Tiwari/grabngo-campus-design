import { Link } from "react-router-dom";
import { MapPin, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OutletCardProps {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  time: string;
  image: string;
  isOpen: boolean;
  className?: string;
}

export const OutletCard = ({
  id,
  name,
  cuisine,
  rating,
  distance,
  time,
  image,
  isOpen,
  className,
}: OutletCardProps) => {
  return (
    <Link to={`/menu/${id}`}>
      <div
        className={cn(
          "bg-card rounded-2xl overflow-hidden border transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] animate-fade-in-up group",
          className
        )}
      >
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          {!isOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <Badge variant="secondary" className="bg-white/90 font-semibold">
                Closed
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-lg mb-1 truncate">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {cuisine}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
              <Star className="h-3 w-3 fill-secondary text-secondary" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
