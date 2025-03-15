
import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ArtistProfileCardProps {
  name: string;
  type: string;
  description: string;
  image: string;
  rating: number;
  priceRange: string;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  className?: string;
  onClick?: () => void;
}

const ArtistProfileCard = ({
  name,
  type,
  description,
  image,
  rating,
  priceRange,
  onFavoriteToggle,
  isFavorite = false,
  className,
  onClick
}: ArtistProfileCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-transparent transition-all duration-300",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: isHovered ? 'pointer' : 'default'
      }}
    >
      {/* Imagen principal con etiqueta de tipo y botón favorito */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl">
        <div
          className="w-full h-full transition-transform duration-300"
          style={{
            transform: isHovered ? 'scale(1.07)' : 'scale(1)',
          }}
        >
          <img
            src={image}
            alt={`${name} - ${type}`}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Degradado negro de abajo a arriba */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between">
          <Badge
            variant="outline"
            className="bg-white text-black py-0.5 px-2 rounded-full border-0 text-xs font-medium"
          >
            {type}
          </Badge>
          <button
            onClick={handleFavoriteClick}
            className="h-7 w-7 rounded-full bg-white flex items-center justify-center transition-colors duration-300"
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-colors duration-300",
                favorite ? "fill-black stroke-black" : "stroke-black"
              )}
            />
          </button>
        </div>
      </div>
      {/* Información del artista con margin-top */}
      <div className="pt-4 mt-2 flex flex-col gap-1 bg-transparent">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-bold">{name}</h3>
          <span className="text-base font-bold">{rating.toFixed(1)}</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-1">{description}</p>
        <p className="text-base font-bold">
          de {priceRange}
        </p>
      </div>
      
      {/* Removing the style jsx tag that's causing the error */}
    </div>
  );
};

export default ArtistProfileCard;
