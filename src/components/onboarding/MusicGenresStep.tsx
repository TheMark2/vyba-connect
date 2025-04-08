
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { MUSIC_GENRES } from "@/constants/music";
import { Headphones, Music } from 'lucide-react';

interface MusicGenresStepProps {
  onSelect: (genres: string[]) => void;
  initialValues?: string[];
  maxSelections?: number;
}

const MusicGenresStep: React.FC<MusicGenresStepProps> = ({ 
  onSelect, 
  initialValues = [], 
  maxSelections = 5 
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialValues || []);
  const [activePress, setActivePress] = useState<string | null>(null);

  // Géneros populares para mostrar en la primera fila
  const popularGenres = ["Pop", "Rock", "Hip-Hop", "Electrónica", "Reggaetón", "House", "Trap", "Jazz"];
  
  // Obtener algunos géneros adicionales para las filas siguientes
  const additionalGenres = MUSIC_GENRES
    .filter(genre => !popularGenres.includes(genre))
    .slice(0, 16);

  useEffect(() => {
    // Si hay valores iniciales, notificamos al componente padre
    if (initialValues && initialValues.length > 0) {
      onSelect(initialValues);
    }
  }, [initialValues, onSelect]);

  const handleSelect = (genre: string) => {
    let newSelectedGenres;
    
    if (selectedGenres.includes(genre)) {
      // Si ya está seleccionado, lo quitamos
      newSelectedGenres = selectedGenres.filter(g => g !== genre);
    } else {
      // Si no está seleccionado y no hemos llegado al máximo, lo añadimos
      if (selectedGenres.length < maxSelections) {
        newSelectedGenres = [...selectedGenres, genre];
      } else {
        // Si llegamos al máximo, no hacemos nada
        return;
      }
    }
    
    setSelectedGenres(newSelectedGenres);
    onSelect(newSelectedGenres);
  };
  
  const handleMouseDown = (genre: string) => {
    setActivePress(genre);
  };
  
  const handleMouseUp = () => {
    setActivePress(null);
  };

  // Generar un icono para cada género
  const getGenreIcon = (genre: string) => {
    // Simplemente alternamos entre dos iconos para este ejemplo
    if (['Electrónica', 'House', 'Techno', 'Trance', 'Drum & Bass', 'Dubstep'].includes(genre)) {
      return <Headphones className="w-4 h-4" />;
    }
    return <Music className="w-4 h-4" />;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pt-28 px-4 md:px-8">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 dark:text-white">
          Tus géneros musicales
        </h2>
        <p className="text-gray-500 text-center mb-8 max-w-md mx-auto">
          Selecciona los estilos musicales en los que te especializas o que ofreces.
        </p>
        
        {/* Contador de selecciones */}
        <p className="text-sm text-gray-500 mb-4">
          {selectedGenres.length} de {maxSelections} seleccionados
        </p>
        
        {/* Primera fila - Géneros populares */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {popularGenres.map(genre => (
            <Badge
              key={genre}
              variant="outline"
              className={`
                py-3 px-6 cursor-pointer transition-all duration-150 h-12
                flex items-center gap-2 text-sm font-medium rounded-full
                ${selectedGenres.includes(genre) 
                  ? 'bg-[#D9D9D9] dark:bg-[#444444]' 
                  : 'bg-[#F7F7F7] dark:bg-vyba-dark-secondary hover:bg-[#E9E9E9] dark:hover:bg-vyba-dark-secondary/80'
                }
                ${activePress === genre ? 'transform scale-95' : ''}
              `}
              onClick={() => handleSelect(genre)}
              onMouseDown={() => handleMouseDown(genre)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {getGenreIcon(genre)}
              {genre}
            </Badge>
          ))}
        </div>
        
        {/* Segunda fila - Géneros adicionales (primera parte) */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {additionalGenres.slice(0, 8).map(genre => (
            <Badge
              key={genre}
              variant="outline"
              className={`
                py-3 px-6 cursor-pointer transition-all duration-150 h-12
                flex items-center gap-2 text-sm font-medium rounded-full
                ${selectedGenres.includes(genre) 
                  ? 'bg-[#D9D9D9] dark:bg-[#444444]' 
                  : 'bg-[#F7F7F7] dark:bg-vyba-dark-secondary hover:bg-[#E9E9E9] dark:hover:bg-vyba-dark-secondary/80'
                }
                ${activePress === genre ? 'transform scale-95' : ''}
              `}
              onClick={() => handleSelect(genre)}
              onMouseDown={() => handleMouseDown(genre)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {getGenreIcon(genre)}
              {genre}
            </Badge>
          ))}
        </div>
        
        {/* Tercera fila - Géneros adicionales (segunda parte) */}
        <div className="flex flex-wrap justify-center gap-2">
          {additionalGenres.slice(8).map(genre => (
            <Badge
              key={genre}
              variant="outline"
              className={`
                py-3 px-6 cursor-pointer transition-all duration-150 h-12
                flex items-center gap-2 text-sm font-medium rounded-full
                ${selectedGenres.includes(genre) 
                  ? 'bg-[#D9D9D9] dark:bg-[#444444]' 
                  : 'bg-[#F7F7F7] dark:bg-vyba-dark-secondary hover:bg-[#E9E9E9] dark:hover:bg-vyba-dark-secondary/80'
                }
                ${activePress === genre ? 'transform scale-95' : ''}
              `}
              onClick={() => handleSelect(genre)}
              onMouseDown={() => handleMouseDown(genre)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {getGenreIcon(genre)}
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicGenresStep;
