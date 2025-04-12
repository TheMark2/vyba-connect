
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import ArtistProfileCard from "../ArtistProfileCard";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (!artists || artists.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-6">Recomendados</h2>
      </div>
      <div className="relative max-w-7xl mx-auto overflow-hidden">
        <Carousel
          className="w-full"
          opts={{
            align: 0.35, // Ajustado a un valor entre 0 y 1 para posicionar el ítem activo más a la izquierda del centro
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-5">
            {artists.map((artist) => (
              <CarouselItem
                key={artist.id}
                className={`pl-5 ${isMobile ? 'basis-4/5' : 'basis-1/4'}`}
              >
                <div className="w-full">
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
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default RecommendedArtists;
