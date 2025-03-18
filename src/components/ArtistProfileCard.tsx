import React, { useState, useRef, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AspectRatio, Image } from "next/image";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageChanging, setIsImageChanging] = useState(false);
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

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageChanging(true);
    setTimeout(() => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
      } else {
        setCurrentImageIndex(images.length - 1);
      }
      setTimeout(() => {
        setIsImageChanging(false);
      }, 300);
    }, 150);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageChanging(true);
    setTimeout(() => {
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
      } else {
        setCurrentImageIndex(0);
      }
      setTimeout(() => {
        setIsImageChanging(false);
      }, 300);
    }, 150);
  };

  const handleSlideChange = (index: number) => {
    if (index !== currentImageIndex) {
      setIsImageChanging(true);
      setTimeout(() => {
        setCurrentImageIndex(index);
        setTimeout(() => {
          setIsImageChanging(false);
        }, 300);
      }, 150);
    }
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
        {isMobile ? (
          <Carousel className="w-full h-full" onSlideChange={handleSlideChange} opts={{
            dragFree: true,
            loop: images.length > 1,
            align: "center"
          }}>
            <CarouselContent className="h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <AspectRatio ratio={1} className="h-full">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={image}
                        alt={`${name} - ${index + 1}`}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="w-full h-full relative overflow-hidden">
            <div 
              className={cn(
                "w-full h-full transition-all duration-500",
                isImageChanging ? "opacity-0 scale-105" : "opacity-100 scale-100",
                isHovered ? "scale-105" : ""
              )}
            >
              <img 
                src={images[currentImageIndex]} 
                alt={`${name} - ${type}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        {isHovered && images.length > 1 && !isMobile && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5 text-black" />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-5 w-5 text-black" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <span 
                key={index}
                className={cn(
                  "h-1.5 rounded-full bg-white/80 transition-all",
                  currentImageIndex === index ? "w-5" : "w-1.5 opacity-60"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlideChange(index);
                }}
                style={{ cursor: 'pointer' }}
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
            "bg-white text-black py-1 px-3 rounded-full border-0 font-medium",
            isMobile ? "text-sm" : "text-base py-1.5 px-4"
          )}>
            {type}
          </Badge>
          <button 
            onClick={handleFavoriteClick} 
            onMouseDown={handleRippleEffect}
            className={cn(
              "rounded-full bg-white flex items-center justify-center transition-all duration-300 relative overflow-hidden",
              isMobile ? "h-9 w-9" : "h-9 w-9",
              isAnimating && favorite && "animate-heartbeat"
            )}
          >
            <Heart 
              className={cn(
                "transition-all duration-300", 
                isMobile ? "h-4.5 w-4.5" : "h-5 w-5",
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
