
import React from "react";
import ArtistProfileCard from "./ArtistProfileCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {artists.map((artist) => (
        <ArtistProfileCard
          key={artist.id}
          name={artist.name}
          type={artist.type}
          description={artist.description}
          image={artist.image}
          rating={artist.rating}
          priceRange={artist.priceRange}
          isFavorite={artist.isFavorite}
          onClick={() => onArtistClick && onArtistClick(artist)}
          onFavoriteToggle={() => onFavoriteToggle && onFavoriteToggle(artist)}
        />
      ))}
    </div>
  );
};

export default ArtistsList;
