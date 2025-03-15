
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
  const isMobile = useIsMobile();
  
  // Function to check if there's more content to scroll
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

  // Check on mount and when artists change
  useEffect(() => {
    checkScrollable();
    // Add a slight delay to ensure everything is rendered
    const timer = setTimeout(checkScrollable, 100);
    return () => clearTimeout(timer);
  }, [artists]);

  // Calculate item width based on screen size
  const getItemWidth = () => {
    if (isMobile) {
      return 'calc(80% - 1rem)'; // Mobile: 1 card + a bit of the next
    } else if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'calc(40% - 1rem)'; // Tablet: 2 cards + a bit of the next
    } else if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      return 'calc(30% - 1rem)'; // Small desktop: 3 cards + a bit of the next
    } else {
      return 'calc(22% - 1rem)'; // Large desktop: 4.5 cards (4 cards + half of the next one)
    }
  };

  return (
    <div className="relative w-full overflow-hidden" ref={carouselRef}>
      <Carousel
        className="w-full pl-4 md:pl-6 lg:pl-8"
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
          {artists.map((artist) => (
            <CarouselItem
              key={artist.id}
              className="pl-4 pr-4"
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
      
      {/* Gradient overlay that only shows when there's more content */}
      {showGradient && (
        <div
          className="absolute right-0 top-0 h-full w-24 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,1) 100%)"
          }}
        />
      )}
    </div>
  );
};

export default ArtistsList;
