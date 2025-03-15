import React, { useRef, useState, useEffect } from "react";
import ArtistProfileCard from "./ArtistProfileCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

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

  return (
    <div className="relative w-full overflow-hidden" ref={carouselRef}>
      <Carousel
        className="w-full"
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
          {/* Initial spacer item */}
          <CarouselItem className="pl-6 md:pl-10 max-w-[1px] min-w-[1px]" />
          
          {artists.map((artist) => (
            <CarouselItem
              key={artist.id}
              className="pl-4 pr-4"  // Added right padding for gap
              // Adjusted width to make 4 full cards with 5th more visible
              style={{
                width: 'calc(23% - 1.5rem)',
                minWidth: 'calc(23% - 1.5rem)',
                flex: '0 0 calc(23% - 1.5rem)'
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