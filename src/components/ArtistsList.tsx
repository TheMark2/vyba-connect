
import React from "react";
import ArtistProfileCard from "./ArtistProfileCard";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

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
    <div className="relative w-full">
      <Carousel
        className="w-full pl-6 md:pl-10"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
      >
        <CarouselContent className="ml-0">
          {artists.map((artist) => (
            <CarouselItem key={artist.id} className="pl-4 pr-2 md:basis-1/3 lg:basis-1/4 sm:basis-1/2">
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
      {/* Gradiente a la derecha para indicar que hay más contenido */}
      <div className="absolute right-0 top-0 h-full w-16 pointer-events-none" 
        style={{ 
          background: "linear-gradient(90deg, rgba(250,248,246,0) 0%, rgba(250,248,246,1) 100%)" 
        }}
      />
    </div>
  );
};

export default ArtistsList;
