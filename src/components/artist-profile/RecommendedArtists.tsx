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

const RecommendedArtists = ({ artists }: RecommendedArtistsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!artists || artists.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="max-w-7xl mx-auto mb-6 flex flex-col gap-1">
        <h2 className="text-3xl font-semibold">Recomendados</h2>
        <p className="text-sm font-light text-[#969494]">Sabemos que estos artistas te van a gustar</p>
      </div>

      {/* Carrusel Mobile */}
      {isMobile && (
        <div className="relative w-full">
          <Carousel
            className="w-full"
            opts={{ align: "start", loop: false, skipSnaps: false }}
          >
            <CarouselContent className="px-4 gap-4">
              {artists.map((artist) => (
                <CarouselItem
                  key={artist.id}
                  className="basis-[85%] shrink-0"
                >
                  <ArtistProfileCard
                    name={artist.name}
                    type={artist.type}
                    description={artist.description}
                    images={artist.images}
                    rating={artist.rating}
                    priceRange={artist.priceRange}
                    isFavorite={artist.isFavorite}
                    onClick={() => navigate(`/artista/${artist.id}`)}
                    onFavoriteToggle={() =>
                      toast.success(
                        artist.isFavorite
                          ? "Eliminado de favoritos"
                          : "Añadido a favoritos",
                        {
                          icon: artist.isFavorite ? "👋" : "❤️",
                          position: "bottom-center",
                        }
                      )
                    }
                    isRecommended={true}
                    hideHeart={true}
                    regularBadge={true}
                    regularText={true}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}

      {/* Carrusel Desktop */}
      {!isMobile && (
        <div className="relative w-full overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: false,
                skipSnaps: false
              }}
            >
              <CarouselContent className="gap-6 pl-0">
                {artists.map((artist) => (
                  <CarouselItem
                    key={artist.id}
                    className="w-[320px] shrink-0"
                  >
                    <ArtistProfileCard
                      name={artist.name}
                      type={artist.type}
                      description={artist.description}
                      images={artist.images}
                      rating={artist.rating}
                      priceRange={artist.priceRange}
                      isFavorite={artist.isFavorite}
                      onClick={() => navigate(`/artista/${artist.id}`)}
                      onFavoriteToggle={() =>
                        toast.success(
                          artist.isFavorite
                            ? "Eliminado de favoritos"
                            : "Añadido a favoritos",
                          {
                            icon: artist.isFavorite ? "👋" : "❤️",
                            position: "bottom-center"
                          }
                        )
                      }
                      isRecommended={true}
                      hideHeart={true}
                      regularBadge={true}
                      regularText={true}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      )}


    </div>
  );
};

export default RecommendedArtists;
