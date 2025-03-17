
import React, { useState } from "react";
import { Heart, LeftArrow, RightArrow, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtistProfileCardProps {
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  isFavorite?: boolean;
  onClick?: () => void;
  onFavoriteToggle?: () => void;
  className?: string;
}

const ArtistProfileCard = ({
  name,
  type,
  description,
  images,
  rating,
  priceRange,
  isFavorite = false,
  onClick,
  onFavoriteToggle,
  className,
}: ArtistProfileCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) onFavoriteToggle();
  };

  return (
    <div
      className={cn(
        "card-artist h-full cursor-pointer transition-all duration-300 hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      {/* Imagen con controles en hover */}
      <div
        className="relative aspect-[3/2] overflow-hidden rounded-t-xl"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <img
          src={images[currentImageIndex]}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Controles de navegación de imágenes */}
        {images.length > 1 && showControls && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-all hover:bg-black/50"
              aria-label="Imagen anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-all hover:bg-black/50"
              aria-label="Siguiente imagen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Indicadores de imágenes */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full ${
                  index === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/60"
                } transition-all`}
              />
            ))}
          </div>
        )}

        {/* Botón de favorito */}
        <button
          onClick={handleFavoriteClick}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-black transition-all hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
          aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
        >
          <Heart
            className={cn(
              "favorite-icon h-5 w-5 transition-all",
              isFavorite
                ? "fill-red-500 text-red-500"
                : "fill-transparent text-gray-600 dark:text-gray-300"
            )}
          />
        </button>
      </div>

      {/* Información del artista */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <span className="artist-type text-gray-600 dark:text-gray-300">{type}</span>
          <span className="text-sm font-medium">{priceRange}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ArtistProfileCard;
