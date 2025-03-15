
import React, { useRef, useState, useEffect } from "react";
import ArtistProfileCard from "./ArtistProfileCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Artist {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  rating: number;
  priceRange: string;
  isFavorite?: boolean;
}

interface ArtistsListProps {
  artists: Artist[];
  onArtistClick?: (artist: Artist) => void;
  onFavoriteToggle?: (artist: Artist) => void;
}

const ArtistsList = ({
  artists,
  onArtistClick,
  onFavoriteToggle,
}: ArtistsListProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const isMobile = useIsMobile();
  
  // Actualizar los contadores cuando cambia el API
  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  // Función para verificar si hay más contenido para desplazar
  const checkScrollable = () => {
    if (carouselRef.current) {
      const container = carouselRef.current.querySelector('[data-carousel-content]');
      if (container) {
        const isScrollable = container.scrollWidth > container.clientWidth;
        const isScrolledToEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 20;
        setShowGradient(isScrollable && !isScrolledToEnd);
      }
    }
  };

  // Verificar al montar y cuando cambian los artistas
  useEffect(() => {
    checkScrollable();
    // Añadir un ligero retraso para asegurar que todo está renderizado
    const timer = setTimeout(checkScrollable, 100);
    return () => clearTimeout(timer);
  }, [artists]);

  // Calcular el ancho del elemento basado en tamaño de pantalla
  const getItemWidth = () => {
    if (isMobile) {
      return 'calc(85% - 0.5rem)'; // Móvil: 1 tarjeta + menos de la siguiente
    } else if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'calc(45% - 0.75rem)'; // Tablet: 2 tarjetas + un poco menos de la siguiente
    } else if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      return 'calc(33% - 0.75rem)'; // Escritorio pequeño: 3 tarjetas + menos de la siguiente
    } else {
      return 'calc(25% - 0.75rem)'; // Escritorio grande: 4 tarjetas con menos visibilidad de las extras
    }
  };

  return (
    <div className="relative w-full" ref={carouselRef}>      
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
        onScroll={checkScrollable}
      >
        <CarouselContent 
          className="-ml-3"
          data-carousel-content
        >
          {artists.map((artist, index) => (
            <CarouselItem
              key={artist.id}
              className={cn(
                "pl-3 pr-3",
                index === 0 && current === 0 ? "ml-6" : "ml-0"
              )}
              style={{
                width: getItemWidth(),
                minWidth: getItemWidth(),
                flex: `0 0 ${getItemWidth()}`
              }}
            >
              <ArtistProfileCard
                name={artist.name}
                type={artist.type}
                description={artist.description}
                image={artist.image}
                rating={artist.rating}
                priceRange={artist.priceRange}
                isFavorite={artist.isFavorite}
                onClick={() => onArtistClick && onArtistClick(artist)}
                onFavoriteToggle={() => onFavoriteToggle && onFavoriteToggle(artist)}
                className="h-full"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Overlay de degradado que solo se muestra cuando hay más contenido */}
      {showGradient && (
        <div
          className="absolute right-0 top-0 h-full w-20 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.9) 80%, rgba(255,255,255,1) 100%)"
          }}
        />
      )}
      
      {/* Indicadores de página para pantallas móviles */}
      {isMobile && count > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "w-6 bg-black" : "w-2 bg-gray-300"
              )}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Ir a la página ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistsList;
