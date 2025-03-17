
import React, { useState, useRef } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const lastClickTimeRef = useRef<number>(0);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  const toggleFavorite = () => {
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    setIsAnimating(true);
    
    // Solo mostrar el corazón central si es un "like" (no cuando se quita el like)
    if (newFavoriteState) {
      setShowCenterHeart(true);
      setTimeout(() => {
        setShowCenterHeart(false);
      }, 800);
    }
    
    // Mostrar toast para feedback adicional
    toast.success(favorite ? "Eliminado de favoritos" : "Añadido a favoritos", {
      icon: favorite ? "👋" : "❤️",
      duration: 1500,
      position: "bottom-center"
    });
    
    // Detener la animación después de 600ms
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
    
    // Si el doble clic es menor a 300ms, consideramos que es un doble clic
    if (timeSinceLastClick < 300 && lastClickTimeRef.current !== 0) {
      toggleFavorite();
    } else {
      // Si es un clic simple, actualizamos el tiempo y ejecutamos onClick si existe
      if (onClick) {
        onClick();
      }
    }
    
    lastClickTimeRef.current = currentTime;
  };

  // Función para manejar el efecto de onda desde el punto de clic
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
    
    // Eliminar el elemento después de la animación
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      setCurrentImageIndex(images.length - 1);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
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
      {/* Imagen principal con etiqueta de tipo y botón favorito */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl">
        <div className="w-full h-full transition-transform duration-300" style={{
          transform: isHovered ? 'scale(1.07)' : 'scale(1)'
        }}>
          <img 
            src={images[currentImageIndex]} 
            alt={`${name} - ${type}`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Botones de navegación de imágenes */}
        {isHovered && images.length > 1 && (
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

        {/* Indicadores de imágenes */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <span 
                key={index}
                className={cn(
                  "h-1.5 rounded-full bg-white/80 transition-all",
                  currentImageIndex === index ? "w-5" : "w-1.5 opacity-60"
                )}
              />
            ))}
          </div>
        )}
        
        {/* Animación de corazón en el centro cuando se da like */}
        {showCenterHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart 
              className={cn(
                "h-20 w-20 fill-white stroke-white opacity-0 animate-fadeInOut z-10",
              )} 
            />
          </div>
        )}
        
        {/* Degradado negro de abajo a arriba */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between">
          <Badge variant="outline" className="bg-white text-black py-0.5 px-3 rounded-full border-0 text-xs font-medium">
            {type}
          </Badge>
          <button 
            onClick={handleFavoriteClick} 
            onMouseDown={handleRippleEffect}
            className={cn(
              "h-7 w-7 rounded-full bg-white flex items-center justify-center transition-all duration-300 relative overflow-hidden",
              isAnimating && favorite && "animate-heartbeat"
            )}
          >
            <Heart 
              className={cn(
                "h-3.5 w-3.5 transition-all duration-300", 
                favorite ? "fill-black stroke-black" : "stroke-black",
                isAnimating && favorite && "scale-110"
              )} 
            />
          </button>
        </div>
      </div>
      {/* Información del artista con margin-top */}
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
