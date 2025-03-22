
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
  
  // Referencias y estados para el gesto de deslizamiento
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const [dragTransform, setDragTransform] = useState<number>(0);
  
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
    if (images.length <= 1) return;
    
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(newIndex);
    resetDragState();
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    resetDragState();
  };

  const handleSlideChange = (index: number) => {
    if (index === currentImageIndex || index < 0 || index >= images.length) return;
    setCurrentImageIndex(index);
    resetDragState();
  };
  
  // Funciones para el gesto de deslizamiento
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transition = "none";
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - dragStartX.current;
    
    // Obtener el ancho real del contenedor
    const containerWidth = imageContainerRef.current?.clientWidth || 0;
    
    // Calcular el desplazamiento como porcentaje del ancho
    let newOffset = (currentImageIndex * -100) + (diffX / containerWidth * 100);
    
    // Añadir resistencia al llegar a los extremos
    if (newOffset > 0) {
      newOffset = newOffset * 0.3;
    } else if (newOffset < -100 * (images.length - 1)) {
      const overscroll = newOffset + 100 * (images.length - 1);
      newOffset = -100 * (images.length - 1) + overscroll * 0.3;
    }
    
    setDragTransform(newOffset);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    touchEndX.current = e.changedTouches[0].clientX;
    const diffX = touchEndX.current - touchStartX.current;
    const threshold = 50; // Umbral para cambiar de imagen
    
    if (diffX > threshold && currentImageIndex > 0) {
      // Deslizar a la izquierda (imagen anterior)
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (diffX < -threshold && currentImageIndex < images.length - 1) {
      // Deslizar a la derecha (imagen siguiente)
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      // Si el movimiento fue pequeño, vuelve a la imagen actual
      resetDragState();
    }
    
    isDragging.current = false;
  };
  
  const resetDragState = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transition = "transform 300ms ease-out";
    }
    setDragTransform(-currentImageIndex * 100);
  };
  
  // Restaurar la posición correcta cuando cambia currentImageIndex
  useEffect(() => {
    // Asegúrate de que el índice esté dentro de los límites
    if (currentImageIndex >= images.length) {
      setCurrentImageIndex(0);
    } else if (currentImageIndex < 0) {
      setCurrentImageIndex(images.length - 1);
    } else {
      setDragTransform(-currentImageIndex * 100);
    }
  }, [currentImageIndex, images.length]);
  
  // Agregar cleanup para eventos touch
  useEffect(() => {
    return () => {
      isDragging.current = false;
    };
  }, []);
  
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
        "relative w-full overflow-hidden rounded-2xl",
        "aspect-[1/1]"
      )}>
        <div 
          className="w-full h-full relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            ref={imageContainerRef}
            className={cn(
              "flex transition-transform duration-300 ease-out h-full w-full",
              isHovered ? "scale-105" : ""
            )}
            style={{ 
              width: `${images.length * 100}%`,
              transform: `translateX(${dragTransform}%)`,
            }}
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="relative h-full flex-shrink-0"
                style={{ width: `${100 / images.length}%` }}
              >
                <img 
                  src={image} 
                  alt={`${name} - ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable="false"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10 shadow-md",
                isMobile ? "opacity-90" : (isHovered ? "opacity-90" : "opacity-0")
              )}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4 text-black" />
            </button>
            <button 
              onClick={handleNextImage}
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10 shadow-md",
                isMobile ? "opacity-90" : (isHovered ? "opacity-90" : "opacity-0")
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
        
        <Badge variant="secondary" className="absolute top-3 left-3 font-medium text-xs bg-white/80 backdrop-blur-sm text-black z-10 shadow-sm">
          {type}
        </Badge>
      </div>
      
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
