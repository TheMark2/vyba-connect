
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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

const RecommendedArtists = ({
  artists
}: RecommendedArtistsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!artists || artists.length === 0) return null;

  return <div className="mb-16">
      {/* Título con padding normal */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col gap-1">
        <h2 className="text-3xl font-semibold">Recomendados</h2>
        <p className="text-sm font-light text-gray-500">Sabemos que estos artistas te van a gustar</p>
      </div>
      
      {/* Carrusel que se extiende a todo el ancho en móvil */}
      <div className={isMobile ? 'relative w-full' : 'relative max-w-7xl mx-auto'}>
        <div className={isMobile ? 'mx-[-1.5rem]' : ''}>
          <Carousel className="w-full" opts={{
          align: "center",
          loop: false,
          skipSnaps: false
        }}>
            <CarouselContent className={`${isMobile ? '-ml-1 pl-6' : '-ml-6'} gap-3`}>
              {artists.map((artist, index) => (
                <CarouselItem 
                  key={artist.id} 
                  className={`
                    ${isMobile ? 'pl-2 pr-2' : 'pl-6'} 
                    ${isMobile ? 'basis-4/5' : 'basis-1/3'}
                    ${index === artists.length - 1 ? 'mr-6' : ''}
                  `}
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
                      isRecommended={true}
                      hideHeart={true}
                      regularBadge={true}
                      regularText={true}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>;
};

export default RecommendedArtists;
