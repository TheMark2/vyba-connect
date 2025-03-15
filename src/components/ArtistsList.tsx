
import React from "react";
import ArtistProfileCard from "./ArtistProfileCard";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
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
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {artists.map((artist) => (
          <CarouselItem key={artist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
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
      <CarouselPrevious className="left-1 md:-left-12 bg-black text-white hover:bg-black/80" />
      <CarouselNext className="right-1 md:-right-12 bg-black text-white hover:bg-black/80" />
    </Carousel>
  );
};

export default ArtistsList;
