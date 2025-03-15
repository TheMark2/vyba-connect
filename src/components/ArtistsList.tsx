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
  
  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
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

  useEffect(() => {
    checkScrollable();
    const timer = setTimeout(checkScrollable, 100);
    return () => clearTimeout(timer);
  }, [artists]);

  const getItemWidth = () => {
    if (isMobile) {
      return 'calc(80% - 1rem)';
    } else if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'calc(40% - 1rem)';
    } else if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      return 'calc(30% - 1rem)';
    } else {
      return 'calc(22% - 1rem)';
    }
  };

  return (
    <div className="relative w-full" ref={carouselRef}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          {/* Espacio para contenido adicional si se necesita */}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => api?.scrollPrev()}
            disabled={current === 0}
            size="icon"
            variant="outline"
            className="rounded-full border-gray-200 h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button
            onClick={() => api?.scrollNext()}
            disabled={current === count - 1}
            size="icon"
            variant="outline"
            className="rounded-full border-gray-200 h-10 w-10"
          >
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">Siguiente</span>
          </Button>
        </div>
      </div>
      
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
          className="-ml-4"
          data-carousel-content
        >
          {artists.map((artist, index) => (
            <CarouselItem
              key={artist.id}
              className={cn(
                "pl-4 pr-4",
                index === 0 && current === 0 ? "ml-8" : "ml-0"
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
      
      {showGradient && (
        <div
          className="absolute right-0 top-0 h-full w-24 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,1) 100%)"
          }}
        />
      )}
      
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
