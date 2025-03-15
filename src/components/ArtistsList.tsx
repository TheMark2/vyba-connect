
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
    <div className="relative">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {artists.map((artist) => (
            <CarouselItem key={artist.id} className="pl-2 md:pl-4 md:basis-1/4 lg:basis-1/4">
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
      <div className="absolute right-0 top-0 h-full w-24 pointer-events-none" 
        style={{ 
          background: "linear-gradient(90deg, rgba(250,248,246,0) 0%, rgba(250,248,246,1) 100%)" 
        }}
      />
    </div>
  );
};

export default ArtistsList;
