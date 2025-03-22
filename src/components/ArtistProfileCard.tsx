import React, { useState, useRef, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
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

  const changeImage = (newIndex: number, direction: 'left' | 'right') => {
    if (newIndex === currentImageIndex) return;
    
    setPreviousImageIndex(currentImageIndex);
    setSlideDirection(direction);
    setIsImageChanging(true);
    
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setTimeout(() => {
        setIsImageChanging(false);
      }, 300);
    }, 150);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    changeImage(newIndex, 'left');
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    changeImage(newIndex, 'right');
  };

  const handleSlideChange = (index: number) => {
    if (index === currentImageIndex) return;
    
    const direction = index > currentImageIndex ? 'right' : 'left';
    changeImage(index, direction);
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
      {/* Imagen y Carousel en estilo Airbnb */}
      <div className={cn(
        "relative w-full overflow-hidden rounded-2xl",
        isMobile ? "aspect-[1/1]" : "aspect-[1/1]"
      )}>
        {isMobile ? (
          <Carousel 
            className="w-full h-full" 
            onSlideChange={handleSlideChange} 
            opts={{
              dragFree: true,
              loop: images.length > 1,
              align: "center"
            }}
          >
            <CarouselContent className="h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative w-full h-full aspect-square">
                    <div className="w-full h-full relative overflow-hidden">
                      <img
                        src={image}
                        alt={`${name} - ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      {/* Gradient overlay - bottom to top */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 pointer-events-none" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="w-full h-full relative overflow-hidden">
            {/* Current Image */}
            <div 
              className={cn(
                "absolute w-full h-full transition-all duration-500 ease-in-out",
                isImageChanging 
                  ? slideDirection === 'right' 
                    ? "-translate-x-full opacity-0" 
                    : "translate-x-full opacity-0"
                  : "translate-x-0 opacity-100",
                isHovered ? "scale-105" : ""
              )}
            >
              <img 
                src={images[previousImageIndex]} 
                alt={`${name} - ${type}`} 
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay - bottom to top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 pointer-events-none" />
            </div>
            
            {/* New Image (coming in) */}
            <div 
              className={cn(
                "absolute w-full h-full transition-all duration-500 ease-in-out",
                isImageChanging 
                  ? "translate-x-0 opacity-100" 
                  : slideDirection === 'right' 
                    ? "translate-x-full opacity-0" 
                    : "-translate-x-full opacity-0",
                isHovered ? "scale-105" : ""
              )}
            >
              <img 
                src={images[currentImageIndex]} 
                alt={`${name} - ${type}`} 
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay - bottom to top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>
        )}
        
        {/* Controles de imagen al estilo Airbnb */}
        {isHovered && images.length > 1 && !isMobile && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10 shadow-md"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4 text-black" />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10 shadow-md"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </button>
          </>
        )}

        {/* Indicadores de página estilo Airbnb */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <span 
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  currentImageIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
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
        
        {/* Botón favorito estilo Airbnb */}
        <button 
          onClick={handleFavoriteClick} 
          className="absolute top-3 right-3 z-10 shadow-sm" 
          aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart 
            className={cn(
              "h-6 w-6 transition-colors duration-300",
              favorite ? "fill-red-500 stroke-white" : "fill-transparent stroke-white stroke-[1.5px]"
            )} 
          />
        </button>
        
        {/* Etiqueta tipo en estilo Airbnb */}
        <Badge variant="secondary" className="absolute top-3 left-3 font-medium text-xs bg-white/80 backdrop-blur-sm text-black z-10 shadow-sm">
          {type}
        </Badge>
      </div>
      
      {/* Información del artista en estilo Airbnb */}
      <div className="pt-3 flex flex-col gap-1 bg-transparent">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-black stroke-black" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{description}</p>
        <p className="text-sm font-medium mt-0.5">
          <span className="font-bold">{priceRange}</span>
        </p>
      </div>
    </div>
  );
};

export default ArtistProfileCard;