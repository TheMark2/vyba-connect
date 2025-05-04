
import React from "react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { ArtistProfileCardProps } from "@/types/artist-profile-card";
import { useNavigate } from "react-router-dom";

// Define la interfaz para los datos de artistas
interface Artist {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  isFavorite: boolean;
}

export interface ArtistsListProps {
  artists: Artist[];
  onFavoriteToggle?: (artistId: string) => void;
  isMobile?: boolean;
  filterType?: string;
  onArtistClick?: (artist: Artist) => void;
}

// Componente ArtistsList
const ArtistsList: React.FC<ArtistsListProps> = ({
  artists,
  onFavoriteToggle,
  isMobile = false,
  filterType,
  onArtistClick
}) => {
  const navigate = useNavigate();

  // Filtrar artistas si se proporciona un tipo de filtro
  const filteredArtists = filterType
    ? artists.filter((artist) => artist.type === filterType)
    : artists;

  // Manejador para hacer clic en un artista
  const handleArtistClick = (artist: Artist) => {
    if (onArtistClick) {
      onArtistClick(artist);
    } else {
      navigate(`/artista/${artist.id}`);
    }
  };

  // Manejador para alternar favoritos
  const handleFavoriteToggle = (artistId: string) => {
    if (onFavoriteToggle) {
      onFavoriteToggle(artistId);
    }
  };

  return (
    <div
      className={`grid ${
        isMobile
          ? "grid-cols-2 gap-4"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      }`}
    >
      {filteredArtists.map((artist) => (
        <ArtistProfileCard
          key={artist.id}
          id={artist.id}
          name={artist.name}
          type={artist.type}
          description={artist.description}
          images={artist.images}
          rating={artist.rating}
          priceRange={artist.priceRange}
          isFavorite={artist.isFavorite}
          onClick={() => handleArtistClick(artist)}
          onFavoriteToggle={() => handleFavoriteToggle(artist.id)}
          className={isMobile ? "mb-2" : ""}
        />
      ))}
    </div>
  );
};

export default ArtistsList;
