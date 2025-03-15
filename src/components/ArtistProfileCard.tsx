
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
  onClick,
}: ArtistProfileCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite);

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
        "flex flex-col overflow-hidden bg-transparent transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Imagen principal con etiqueta de tipo y botón favorito */}
      <div className="relative aspect-[4/3]">
        <img
          src={image}
          alt={`${name} - ${type}`}
          className="w-full h-full object-cover rounded-3xl"
        />
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between">
          <Badge 
            variant="outline" 
            className="bg-white text-black py-2 px-4 rounded-full border-0 font-medium"
          >
            {type}
          </Badge>
          
          <button 
            onClick={handleFavoriteClick}
            className="h-10 w-10 rounded-full bg-white flex items-center justify-center transition-colors duration-300"
          >
            <Heart 
              className={cn("h-5 w-5 transition-colors duration-300", 
                favorite ? "fill-black stroke-black" : "stroke-black"
              )} 
            />
          </button>
        </div>
      </div>
      
      {/* Información del artista */}
      <div className="p-5 flex flex-col gap-1 bg-transparent">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{name}</h3>
          <span className="text-lg font-bold">{rating.toFixed(1)}</span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-1">{description}</p>
        
        <p className="text-lg font-bold mt-2">
          de {priceRange}
        </p>
      </div>
    </div>
  );
};

export default ArtistProfileCard;
