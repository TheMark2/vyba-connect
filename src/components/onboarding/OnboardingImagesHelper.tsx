import React from 'react';
import { cn } from '@/lib/utils';

type ImageCategory = 'genres' | 'artists';

// Mapeo de género/tipo a URL de imagen
const imageMap: Record<ImageCategory, Record<string, string>> = {
  genres: {
    'pop': '/images/genres/pop.jpg',
    'rock': '/images/genres/rock.jpg',
    'electrónica': '/images/genres/electronica.jpg',
    'hip hop': '/images/genres/hip-hop.jpg',
    'reggaetón': '/images/genres/reggaeton.jpg',
    'jazz': '/images/genres/jazz.jpg',
    'techno': '/images/genres/techno.jpg',
    'r&b': '/images/genres/r-b.jpg',
    'clásica': '/images/genres/clasica.jpg',
    'house': '/images/genres/house.jpg',
    'latino': '/images/genres/latino.jpg',
    'indie': '/images/genres/indie.jpg',
    'metal': '/images/genres/metal.jpg',
    'folk': '/images/genres/folk.jpg',
    'funk': '/images/genres/funk.jpg',
  },
  artists: {
    'dj': '/images/artists/dj.jpg',
    'cantante': '/images/artists/cantante.jpg',
    'banda': '/images/artists/banda.jpg',
    'pianista': '/images/artists/pianista.jpg',
    'saxofonista': '/images/artists/saxofonista.jpg',
    'guitarrista': '/images/artists/guitarrista.jpg',
    'violinista': '/images/artists/violinista.jpg',
    'trompetista': '/images/artists/trompetista.jpg',
    'baterista': '/images/artists/baterista.jpg',
  }
};

// Colores de fondo para usar cuando no hay imagen disponible
const backgroundColors: Record<ImageCategory, string[]> = {
  genres: [
    'bg-blue-500', 'bg-purple-600', 'bg-green-500', 'bg-red-500', 
    'bg-orange-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500',
    'bg-yellow-500', 'bg-cyan-600', 'bg-amber-600', 'bg-lime-600',
    'bg-emerald-600', 'bg-rose-600', 'bg-fuchsia-600'
  ],
  artists: [
    'bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-red-600',
    'bg-orange-600', 'bg-teal-600', 'bg-pink-600', 'bg-indigo-600',
    'bg-yellow-600'
  ]
};

// Obtener la URL de la imagen para un género o tipo de artista
export const getImageUrl = (category: ImageCategory, name: string): string => {
  const key = name.toLowerCase();
  return imageMap[category][key] || `/images/${category}/default.jpg`;
};

// Renderizar el contenedor de la imagen con fallback
export const ImageContainer: React.FC<{
  category: ImageCategory;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}> = ({ category, name, isSelected, onClick, children }) => {
  const [hasError, setHasError] = React.useState(false);
  const key = name.toLowerCase();
  const colorIndex = 
    category === 'genres' 
      ? Math.abs(key.charCodeAt(0) + (key.charCodeAt(1) || 0)) % backgroundColors.genres.length
      : Math.abs(key.charCodeAt(0) + (key.charCodeAt(1) || 0)) % backgroundColors.artists.length;
  
  const bgColorClass = backgroundColors[category][colorIndex];

  return (
    <div 
      className={cn(
        "w-full aspect-[3/2] rounded-lg overflow-hidden relative mb-2 transition-all duration-300",
        isSelected 
          ? "transform" 
          : "hover:opacity-90 hover:shadow-md"
      )}
      style={{
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.3s ease'
      }}
      onClick={onClick}
    >
      {!hasError ? (
        <img 
          src={getImageUrl(category, name)}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={`w-full h-full ${bgColorClass} flex items-center justify-center`}>
          <span className="text-white text-lg font-medium">{name}</span>
        </div>
      )}
      {children}
    </div>
  );
};

export default {
  getImageUrl,
  ImageContainer
}; 