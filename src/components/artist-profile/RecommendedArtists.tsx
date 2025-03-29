
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Marquee } from "@/components/ui/marquee";
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
      <div className="relative max-w-7xl mx-auto overflow-hidden">
        <Marquee 
          pauseOnHover 
          className="py-4" 
          gap="0.75rem"
        >
          {artists.map(artist => (
            <div key={artist.id} className="w-[300px] flex-shrink-0">
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
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default RecommendedArtists;
