
import React, { useState, useRef, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

interface ArtistProfileCardProps {
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  className?: string;
  onClick?: () => void;
}

const ArtistProfileCard = ({
  name,
  type,
  description,
  images,
  rating,
  priceRange,
  onFavoriteToggle,
  isFavorite = false,
  className,
  onClick
}: ArtistProfileCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCenterHeart, setShowCenterHeart] = useState(false);
  const lastClickTimeRef = useRef<number>(0);
  const isMobile = useIsMobile();
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  const toggleFavorite = () => {
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    setIsAnimating(true);
    
    if (newFavoriteState) {
      setShowCenterHeart(true);
      setTimeout(() => {
        setShowCenterHeart(false);
      }, 800);
    }
    
    toast.success(favorite ? "Eliminado de favoritos" : "Añadido a favoritos", {
      icon: favorite ? "👋" : "❤️",
      duration: 1500,
      position: "bottom-center"
    });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTimeRef.current;
    
    if (timeSinceLastClick < 300 && lastClickTimeRef.current !== 0) {
      toggleFavorite();
    } else {
      if (onClick) {
        onClick();
      }
    }
    
    lastClickTimeRef.current = currentTime;
  };

  const handleRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };
  
  return (
    <div 
      className={cn("flex flex-col overflow-hidden bg-transparent transition-all duration-300", className)} 
      onClick={handleCardClick} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      style={{
        cursor: isHovered ? 'pointer' : 'default'
      }}
    >
      <div className={cn(
        "relative w-full overflow-hidden rounded-3xl",
        isMobile ? "aspect-[1/1]" : "aspect-[3/4]"
      )}>
        {/* Image carousel for mobile and desktop */}
        <Carousel className="w-full h-full" opts={{ loop: true, align: "center" }}>
          <CarouselContent className="h-full">
            {images.map((img, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="w-full h-full transition-transform duration-300" style={{
                  transform: isHovered && !isMobile ? 'scale(1.07)' : 'scale(1)'
                }}>
                  <img 
                    src={img} 
                    alt={`${name} - ${type} ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Show navigation arrows on desktop when hovering */}
          {isHovered && images.length > 1 && !isMobile && (
            <>
              <CarouselPrevious className="absolute left-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 p-1.5 rounded-full opacity-90 hover:opacity-100" />
              <CarouselNext className="absolute right-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 p-1.5 rounded-full opacity-90 hover:opacity-100" />
            </>
          )}
        </Carousel>
        
        {/* Show dots for multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <span 
                key={index}
                className={cn(
                  "h-1.5 rounded-full bg-white/80 transition-all",
                  index === 0 ? "w-5" : "w-1.5 opacity-60"
                )}
              />
            ))}
          </div>
        )}
        
        {showCenterHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart 
              className={cn(
                "h-20 w-20 fill-white stroke-white opacity-0 animate-fadeInOut z-10",
              )} 
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
        
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between">
          <Badge variant="outline" className={cn(
            "bg-white text-black py-1 rounded-full border-0 font-medium",
            isMobile ? "text-sm px-4" : "text-sm px-5 py-1.5" // Increased size for desktop
          )}>
            {type}
          </Badge>
          <button 
            onClick={handleFavoriteClick} 
            onMouseDown={handleRippleEffect}
            className={cn(
              "rounded-full bg-white flex items-center justify-center transition-all duration-300 relative overflow-hidden",
              isMobile ? "h-9 w-9" : "h-10 w-10", // Increased size for desktop
              isAnimating && favorite && "animate-heartbeat"
            )}
          >
            <Heart 
              className={cn(
                "transition-all duration-300", 
                isMobile ? "h-4.5 w-4.5" : "h-5 w-5", // Increased size for desktop
                favorite ? "fill-black stroke-black" : "stroke-black",
                isAnimating && favorite && "scale-110"
              )} 
            />
          </button>
        </div>
      </div>
      
      <div className="pt-4 mt-2 flex flex-col gap-1 bg-transparent">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-bold">{name}</h3>
          <span className="text-base font-bold">{rating.toFixed(1)}</span>
        </div>
        <p className="text-gray-400 text-base line-clamp-1">{description}</p>
        <p className="text-base font-bold">
          de {priceRange}
        </p>
      </div>
    </div>
  );
};

export default ArtistProfileCard;
