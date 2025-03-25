
import React from "react";
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

  return (
    <div className="mb-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-6">Recomendados</h2>
      </div>
      <div className="relative max-w-full mx-auto">
        <Carousel 
          opts={{
            align: "start",
            loop: false
          }} 
          className="max-w-7xl mx-auto"
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
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
  );
};

export default RecommendedArtists;
