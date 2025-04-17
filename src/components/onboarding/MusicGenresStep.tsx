
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Headphones, Music, Plus, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { MUSIC_GENRES } from '@/constants/music';

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
  const musicGenres = MUSIC_GENRES.slice(0, 15);

  // Estado para manejar géneros personalizados
  const [customGenres, setCustomGenres] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customGenre, setCustomGenre] = useState('');

  useEffect(() => {
    // Si hay valores iniciales, notificamos al componente padre
    if (initialValues && initialValues.length > 0) {
      setSelectedGenres(initialValues);
      // Separar los géneros predefinidos de los personalizados
      const customOnes = initialValues.filter(genre => !MUSIC_GENRES.includes(genre));
      if (customOnes.length > 0) {
        setCustomGenres(customOnes);
      }
      onSelect(initialValues);
    }
  }, [initialValues, onSelect]);

  const handleSelect = (genre: string) => {
    let newSelectedGenres;
    if (selectedGenres.includes(genre)) {
      // Si ya está seleccionado, lo quitamos
      newSelectedGenres = selectedGenres.filter(g => g !== genre);
      
      // Si es un género personalizado, también lo eliminamos de la lista de personalizados
      if (customGenres.includes(genre)) {
        setCustomGenres(prev => prev.filter(g => g !== genre));
      }
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

  const handleAddCustomGenre = () => {
    const trimmed = customGenre.trim();
    if (!trimmed || selectedGenres.includes(trimmed) || selectedGenres.length >= maxSelections) return;
  
    // Añadir a los géneros personalizados
    setCustomGenres(prev => [...prev, trimmed]);
    
    // Añadir a los géneros seleccionados
    const newGenres = [...selectedGenres, trimmed];
    setSelectedGenres(newGenres);
    onSelect(newGenres);
    
    setCustomGenre('');
    setShowCustomInput(false);
  };

  // Todos los géneros que se mostrarán (predefinidos + personalizados)
  const allDisplayedGenres = [...musicGenres, ...customGenres];

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
          {allDisplayedGenres.map(genre => (
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

          {!showCustomInput && selectedGenres.length < maxSelections && (
            <Badge
              variant="outline"
              className="py-3 px-6 cursor-pointer transition-all duration-150 flex items-center gap-2 text-sm font-medium rounded-full border-none bg-[#F7F7F7] dark:bg-vyba-dark-secondary hover:bg-[#E9E9E9] dark:hover:bg-vyba-dark-secondary/80"
              onClick={() => setShowCustomInput(true)}
            >
              <Plus className="h-4 w-4 text-black dark:text-white" />
              Otro
            </Badge>
          )}

          <AnimatePresence>
            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2 items-center"
              >
                <Input
                  type="text"
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  placeholder="Escribe un género"
                  className="min-w-[160px]"
                  autoFocus
                />
                <Button
                  variant="secondary"
                  onClick={handleAddCustomGenre}
                  className="px-6"
                >
                  Añadir
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default MusicGenresStep;
