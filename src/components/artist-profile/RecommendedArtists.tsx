
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ArtistProfileCard from "../ArtistProfileCard";

interface Artist {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  isFavorite?: boolean;
}

interface RecommendedArtistsProps {
  artists: Artist[];
}

const RecommendedArtists = ({ artists }: RecommendedArtistsProps) => {
  const navigate = useNavigate();
  const [api, setApi] = useState<any>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Configurar el desplazamiento automático continuo
  useEffect(() => {
    if (!api || artists.length <= 4) return;
    
    const startAutoScroll = () => {
      // Limpiar cualquier intervalo anterior
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
      
      // Crear un intervalo para mover la animación
      const scrollSpeed = 30; // ms entre cada movimiento (menor = más rápido)
      
      autoScrollRef.current = setInterval(() => {
        if (api && !isPaused) {
          // Verificar si estamos al final del carrusel
          const isAtEnd = api.internalEngine().scrollProgress() >= 0.99;
          
          if (isAtEnd) {
            // Si estamos al final, volver al principio suavemente
            api.scrollTo(0);
          } else {
            // Avanzar un paso pequeño (el método scrollNext() avanza al siguiente slide completo,
            // en lugar usamos scrollSnaps y scrollProgress para un movimiento continuo)
            const progress = api.internalEngine().scrollProgress();
            const next = api.scrollSnapList()[Math.min(
              Math.floor(progress * api.scrollSnapList().length) + 1,
              api.scrollSnapList().length - 1
            )];
            
            // Usa scrollTo con animación (no saltamos directamente)
            api.scrollTo(next, { duration: scrollSpeed * 10 });
          }
        }
      }, scrollSpeed);
    };
    
    startAutoScroll();
    
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [api, artists.length, isPaused]);
  
  // Pausar el desplazamiento cuando el usuario interactúa con el carrusel
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="mb-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-6">Recomendados</h2>
      </div>
      <div 
        className="relative max-w-full mx-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel 
          opts={{
            align: "start",
            loop: true,
            dragFree: true
          }} 
          className="max-w-7xl mx-auto"
          setApi={setApi}
        >
          <CarouselContent>
            {artists.map(artist => (
              <CarouselItem key={artist.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ArtistProfileCard 
                  name={artist.name}
                  type={artist.type}
                  description={artist.description}
                  images={artist.images}
                  rating={artist.rating}
                  priceRange={artist.priceRange}
                  isFavorite={artist.isFavorite}
                  onClick={() => navigate(`/artista/${artist.id}`)} 
                  onFavoriteToggle={() => {
                    toast.success(artist.isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos", {
                      icon: artist.isFavorite ? "👋" : "❤️",
                      position: "bottom-center"
                    });
                  }} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 w-12 h-12" />
          <CarouselNext className="right-2 w-12 h-12" />
        </Carousel>
      </div>
    </div>
  );
};

export default RecommendedArtists;
