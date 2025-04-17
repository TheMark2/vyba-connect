
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Headphones, Music } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // Lista reducida de géneros musicales populares
  const musicGenres = ["Pop", "Rock", "Hip-Hop", "Electrónica", "Reggaetón", "House", "Trap", "Jazz", "Indie", "R&B", "Techno", "Salsa", "Bachata", "Cumbia", "Metal"];

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
    // Simplemente alternamos entre dos iconos
    if (['Electrónica', 'House', 'Techno', 'Trap'].includes(genre)) {
      return <Headphones className="w-4 h-4" />;
    }
    return <Music className="w-4 h-4" />;
  };

  return (
    <div className="content-container">
      <div className="form-container text-center">
        <h1 className="form-title">
          Tus géneros musicales
        </h1>
        <p className="font-light mb-8 max-w-md mx-auto">
          Selecciona los estilos musicales en los que te especializas o que ofreces.
        </p>
        
        {/* Contador de selecciones */}
        <p className="text-sm text-gray-500 mb-4">
          {selectedGenres.length} de {maxSelections} seleccionados
        </p>
        
        {/* Grid de géneros musicales */}
        <div className={`flex flex-wrap justify-center gap-3 ${isMobile ? 'max-w-[90vw]' : 'max-w-xl'} mx-auto`}>
          {musicGenres.map(genre => (
            <Badge 
              key={genre} 
              variant="outline" 
              className={`
                py-3 px-6 cursor-pointer transition-all duration-150
                flex items-center gap-2 text-sm font-medium rounded-full border-none
                ${selectedGenres.includes(genre) ? 'bg-[#D9D9D9] dark:bg-[#444444]' : 'bg-[#F7F7F7] dark:bg-vyba-dark-secondary hover:bg-[#E9E9E9] dark:hover:bg-vyba-dark-secondary/80'}
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
