import React from "react";
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
  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {/* Initial spacer item */}
          <CarouselItem className="pl-6 md:pl-10 max-w-[1px] min-w-[1px]" />
          
          {artists.map((artist) => (
            <CarouselItem 
              key={artist.id} 
              className="pl-4 pr-0"
              // Adjusted width to make 4 full cards with 5th more visible
              style={{ 
                width: 'calc(23% - 1rem)',
                minWidth: 'calc(23% - 1rem)',
                flex: '0 0 calc(23% - 1rem)'
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
      
      {/* Gradient overlay on the right side to indicate more content */}
      <div 
        className="absolute right-0 top-0 h-full w-24 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,1) 100%)"
        }}
      />
    </div>
  );
};

export default ArtistsList;