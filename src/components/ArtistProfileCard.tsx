import React, { useState, useRef, useEffect, TouchEvent } from "react";
import { Heart, ChevronLeft, ChevronRight, Star, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import AuthDialog from "@/components/auth/authdialog";
import FavoriteDialog from "@/components/FavoriteDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from 'react-router-dom';

interface ArtistProfileCardProps {
  id?: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  className?: string;
  to?: string;
  isRecommended?: boolean;
  hideHeart?: boolean;
  regularBadge?: boolean;
  regularText?: boolean;
}

const ArtistProfileCard = ({
  id,
  name,
  type,
  description,
  images,
  rating,
  priceRange,
  onFavoriteToggle,
  isFavorite = false,
  className,
  to,
  isRecommended = false,
  hideHeart = false,
  regularBadge = false,
  regularText = false
}: ArtistProfileCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDarkImage, setIsDarkImage] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showFavoriteDialog, setShowFavoriteDialog] = useState(false);
  const isMobile = useIsMobile();
  const lastClickTimeRef = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const { isAuthenticated } = useAuth();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    // Remove the ripple element after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 800);
    
    if (isAuthenticated) {
      setShowFavoriteDialog(true);
    } else {
      setShowLoginDialog(true);
    }
  };

  const toggleFavorite = () => {
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
    
    // Si estamos quitando de favoritos, no es necesario mostrar el diálogo
    if (favorite && !newFavoriteState) {
      toast.success(`${name} eliminado de favoritos`, {
        icon: "👋",
        position: "bottom-center",
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTimeRef.current;
    if (timeSinceLastClick < 300 && lastClickTimeRef.current !== 0) {
      if (isAuthenticated) {
        setShowFavoriteDialog(true);
      } else {
        setShowLoginDialog(true);
      }
    } else {
      if (to) {
        // If to is provided, use Link component
        // Assuming Link component from react-router-dom
        // Replace with actual Link component usage
      } else if (onFavoriteToggle) {
        onFavoriteToggle();
      }
    }
    lastClickTimeRef.current = currentTime;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    // Remove the ripple element after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 800);
    
    if (images.length <= 1) return;
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    // Remove the ripple element after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 800);
    
    if (images.length <= 1) return;
    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const handleSlideChange = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    // Remove the ripple element after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 800);
    
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
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    } else if (diff < -threshold) {
      setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    }
  };

  useEffect(() => {
    if (images.length <= 0 || !images[currentImageIndex]) {
      setIsDarkImage(false);
      return;
    }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = images[currentImageIndex];
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsDarkImage(false);
        return;
      }
      const width = img.width;
      const height = img.height / 3; // Solo analizamos el tercio superior

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let totalBrightness = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        totalBrightness += brightness;
      }
      const avgBrightness = totalBrightness / (imageData.length / 4);
      setIsDarkImage(avgBrightness < 0.5);
    };
    img.onerror = () => {
      setIsDarkImage(false);
    };
  }, [currentImageIndex, images]);

  const CardContent = () => (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-3xl transition-all duration-300 ease-in-out",
        className
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
              className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out" 
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
        
        {images.length > 1 && <>
          <button 
            onClick={handlePrevImage} 
            className={cn(
              "absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full opacity-90 hover:opacity-100 transition-all duration-300 z-10 w-7 h-7 flex items-center justify-center", 
              isMobile ? "opacity-90" : isHovered ? "opacity-90" : "opacity-0", 
              isDarkImage ? "bg-white/30 backdrop-blur-xl" : "bg-black/30 backdrop-blur-xl"
            )} 
            aria-label="Imagen anterior"
          >
            <ChevronLeft 
              className={cn(
                "h-5 w-5", 
                isDarkImage ? "text-white" : "text-white"
              )} 
            />
          </button>
          <button 
            onClick={handleNextImage} 
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full opacity-90 hover:opacity-100 transition-all duration-300 z-10 w-7 h-7 flex items-center justify-center", 
              isMobile ? "opacity-90" : isHovered ? "opacity-90" : "opacity-0", 
              isDarkImage ? "bg-white/30 backdrop-blur-xl" : "bg-black/30 backdrop-blur-xl"
            )} 
            aria-label="Siguiente imagen"
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4", 
                isDarkImage ? "text-white" : "text-white"
              )} 
            />
          </button>
        </>}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <button 
                key={index} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300", 
                  currentImageIndex === index ? "bg-white" : "bg-white/30 backdrop-blur-xl"
                )} 
                onClick={(e) => handleSlideChange(index, e)} 
                aria-label={`Ir a imagen ${index + 1}`} 
              />
            ))}
          </div>
        )}
        
        {!hideHeart && isRecommended === false && (
          <button 
            onClick={handleFavoriteClick} 
            className={cn(
              "absolute top-2 right-2 z-10 backdrop-blur-xl rounded-full p-1.5 w-9 h-9 flex items-center justify-center transition-colors duration-300", 
              isDarkImage ? "bg-white/30" : "bg-black/30"
            )} 
            aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-all duration-300", 
                favorite ? "fill-black stroke-black" : "fill-transparent stroke-white"
              )} 
            />
          </button>
        )}
        
        <Badge 
          variant="secondary" 
          className={cn(
            "absolute top-2 left-2 text-sm backdrop-blur-xl text-white z-10 px-4 py-1.5 dark:text-white rounded-full transition-colors duration-300 font-figtree", 
            regularBadge || isRecommended ? "font-medium" : "font-medium",
            isDarkImage ? "bg-white/30" : "bg-black/30"
          )}
        >
          {type}
        </Badge>
      </div>
      
      {isRecommended ? (
        <div className="pt-3 flex flex-col gap-1 bg-transparent">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-normal text-vyba-navy font-figtree">{name}</h3>
            <p className="text-base text-vyba-tertiary font-normal font-figtree">{priceRange}</p>
          </div>
        </div>
      ) : (
        <div className="pt-3 flex flex-col bg-transparent">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-vyba-navy font-figtree">{name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-black stroke-black dark:fill-white dark:stroke-white" />
              <span className="text-base font-medium text-vyba-navy">{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-base text-vyba-tertiary dark:text-gray-400 line-clamp-1 font-light mb-0 font-figtree mb-1">{description}</p>
          <p className="text-base font-medium text-vyba-navy font-figtree flex items-center gap-2">
            <span className="font-vyba-tertiary font-light">desde</span> {priceRange}
          </p>
        </div>
      )}
    </div>
  );

  return to ? (
    <Link to={to} className="block">
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

export default ArtistProfileCard;
