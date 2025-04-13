import React, { useState, useRef, useEffect, TouchEvent } from "react";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const lastClickTimeRef = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  
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

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleSlideChange = (index: number) => {
    if (index === currentImageIndex || index < 0 || index >= images.length) return;
    setCurrentImageIndex(index);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current || images.length <= 1) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = Math.abs(currentX - touchStartX.current);
    
    if (diffX > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging.current) return;
    
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    const threshold = 50; // Umbral para cambiar de imagen
    
    isDragging.current = false;
    
    if (diff > threshold) {
      setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    } else if (diff < -threshold) {
      setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
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
      <div className={cn("relative w-full overflow-hidden rounded-3xl", "aspect-[1.05/1]")}>
        <div 
          className="relative w-full h-full overflow-hidden" 
          onTouchStart={handleTouchStart} 
          onTouchMove={handleTouchMove} 
          onTouchEnd={handleTouchEnd}
        >
          {images.map((image, index) => (
            <div 
              key={index} 
              className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                zIndex: index === currentImageIndex ? 1 : 0
              }}
            >
              <img 
                src={image} 
                alt={`${name} - ${index + 1}`} 
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isHovered ? "scale-105" : ""
                )}
                draggable="false" 
                loading={index === 0 ? "eager" : "lazy"} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 pointer-events-none" />
            </div>
          ))}
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage} 
              className={cn(
                "absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10 w-7 h-7 flex items-center justify-center", 
                isMobile ? "opacity-90" : isHovered ? "opacity-90" : "opacity-0"
              )} 
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4 text-black" />
            </button>
            <button 
              onClick={handleNextImage} 
              className={cn(
                "absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10 w-7 h-7 flex items-center justify-center", 
                isMobile ? "opacity-90" : isHovered ? "opacity-90" : "opacity-0"
              )} 
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <button 
                key={index} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300 backdrop-blur-xl",
                  currentImageIndex === index 
                    ? "bg-white" 
                    : "bg-white/30"
                )} 
                onClick={e => {
                  e.stopPropagation();
                  handleSlideChange(index);
                }} 
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {showCenterHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className={cn("h-16 w-16 fill-black stroke-white opacity-0 animate-fadeInOut z-10")} />
          </div>
        )}
        
        <button 
          onClick={handleFavoriteClick} 
          className="absolute top-2 right-2 z-10 bg-white/30 backdrop-blur-xl rounded-full p-1.5 w-9 h-9 flex items-center justify-center" 
          aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors duration-300", 
              favorite ? "fill-black stroke-black" : "fill-transparent stroke-white"
            )} 
          />
        </button>
        
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 font-bold text-sm bg-white/30 backdrop-blur-xl text-white z-10 px-4 py-1.5 dark:text-white rounded-full"
        >
          {type}
        </Badge>
      </div>
      
      <div className="pt-3 flex flex-col gap-1 bg-transparent">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-black stroke-black dark:fill-white dark:stroke-white" />
            <span className="text-base font-bold">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-base text-gray-500 dark:text-gray-400 line-clamp-1">{description}</p>
        <p className="text-sm font-bold">
          {priceRange}
        </p>
      </div>
    </div>
  );
};

export default ArtistProfileCard;