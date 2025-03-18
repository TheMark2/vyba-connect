
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
  images: string[];
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
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  
  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      checkScrollable();
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
    
    const handleResize = () => {
      checkScrollable();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [artists]);

  const getItemWidth = () => {
    if (isMobile) {
      return 'calc(70% - 1rem)'; // Smaller width to show more of next card on mobile
    } else if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'calc(65% - 1rem)'; 
    } else if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'calc(38% - 1rem)'; // Show ~2.5 cards on tablets
    } else if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      return 'calc(28% - 1rem)'; // Show ~3.5 cards on small desktops
    } else if (typeof window !== 'undefined' && window.innerWidth < 1536) {
      return 'calc(21% - 1rem)'; // Show ~4.5 cards on desktops
    } else {
      return 'calc(18% - 1rem)'; // Show ~5.5 cards on large screens
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
          className="-ml-5" // Increased negative margin for larger gap
          data-carousel-content
        >
          {artists.map((artist, index) => (
            <CarouselItem
              key={artist.id}
              className={cn(
                "pl-5 pr-2", // Increased padding for larger gap
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
                images={artist.images}
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
          className="absolute right-0 top-0 h-full w-12 pointer-events-none"
          style={{
            background: document.documentElement.classList.contains('dark')
              ? "linear-gradient(90deg, rgba(44,44,43,0) 0%, rgba(44,44,43,0.5) 40%, rgba(44,44,43,0.9) 80%, rgba(44,44,43,1) 100%)"
              : "linear-gradient(90deg, rgba(250,248,246,0) 0%, rgba(250,248,246,0.5) 40%, rgba(250,248,246,0.9) 80%, rgba(250,248,246,1) 100%)"
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
                i === current ? "w-6 bg-black dark:bg-white" : "w-2 bg-gray-300 dark:bg-gray-600"
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
