
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
      {/* Título con padding normal */}
      <div className="max-w-7xl mx-auto px-6 md:px-0">
        <h2 className="text-3xl font-black mb-6">Recomendados</h2>
      </div>
      
      {/* Carrusel a todo ancho en móvil */}
      <div className={`relative ${isMobile ? 'w-full' : 'max-w-7xl mx-auto'} overflow-hidden`}>
        <Carousel
          className="w-full"
          opts={{
            align: "center",
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
        >
          <CarouselContent className={`${isMobile ? '-ml-4 pl-4' : '-ml-6'}`}>
            {artists.map((artist) => (
              <CarouselItem
                key={artist.id}
                className={`${isMobile ? 'pl-4 pr-2' : 'pl-6'} ${isMobile ? 'basis-4/5' : 'basis-1/3'}`}
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
