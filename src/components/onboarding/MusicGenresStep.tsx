
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Plus, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MusicGenresStepProps {
  onSelect: (genres: string[]) => void;
  initialValues?: string[];
}

const defaultGenres = [
  { id: 'techno', name: 'Techno', icon: <Music className="w-6 h-6" /> },
  { id: 'house', name: 'House', icon: <Music className="w-6 h-6" /> },
  { id: 'pop', name: 'Pop', icon: <Music className="w-6 h-6" /> },
  { id: 'rock', name: 'Rock', icon: <Music className="w-6 h-6" /> },
  { id: 'latin', name: 'Latin', icon: <Music className="w-6 h-6" /> },
  { id: 'jazz', name: 'Jazz', icon: <Music className="w-6 h-6" /> },
  { id: 'reggaeton', name: 'Reggaeton', icon: <Music className="w-6 h-6" /> },
  { id: 'hip-hop', name: 'Hip Hop', icon: <Music className="w-6 h-6" /> },
];

const MusicGenresStep: React.FC<MusicGenresStepProps> = ({ onSelect, initialValues = [] }) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialValues);
  const [activePress, setActivePress] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newGenre, setNewGenre] = useState('');
  const [customGenres, setCustomGenres] = useState<Array<{ id: string; name: string; icon: JSX.Element }>>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Cargar géneros personalizados si existen en initialValues pero no están en defaultGenres
    const loadCustomGenres = () => {
      if (initialValues && initialValues.length > 0) {
        const customGenresFromInitial = initialValues
          .filter(genreId => !defaultGenres.some(defaultGenre => defaultGenre.id === genreId))
          .map(genreId => ({
            id: genreId,
            name: genreId.charAt(0).toUpperCase() + genreId.slice(1).replace(/-/g, ' '),
            icon: <Music className="w-6 h-6" />
          }));
        
        if (customGenresFromInitial.length > 0) {
          setCustomGenres(customGenresFromInitial);
        }
      }
    };

    loadCustomGenres();
  }, [initialValues]);

  const handleSelect = async (genreId: string) => {
    let updatedGenres: string[];
    
    if (selectedGenres.includes(genreId)) {
      updatedGenres = selectedGenres.filter(id => id !== genreId);
    } else {
      updatedGenres = [...selectedGenres, genreId];
    }
    
    setSelectedGenres(updatedGenres);
    onSelect(updatedGenres);
    
    // Intentar actualizar directamente en Supabase
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Actualizar en auth.users
        await supabase.auth.updateUser({
          data: {
            favorite_genres: updatedGenres
          }
        });
        
        // También actualizar en profiles
        const { error } = await supabase
          .from('profiles')
          .update({ 
            favorite_genres: updatedGenres 
          })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error al actualizar géneros en profiles:', error);
          toast.error('Error al guardar tus preferencias');
        }
      }
    } catch (error) {
      console.error('Error al guardar preferencias musicales:', error);
      toast.error('Error al guardar tus preferencias');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseDown = (genreId: string) => {
    setActivePress(genreId);
  };

  const handleMouseUp = () => {
    setActivePress(null);
  };

  const handleAddGenre = async () => {
    if (newGenre.trim()) {
      const genreId = newGenre.toLowerCase().replace(/\s+/g, '-');
      const newGenreObj = {
        id: genreId,
        name: newGenre.trim(),
        icon: <Music className="w-6 h-6" />
      };
      
      setCustomGenres(prev => [...prev, newGenreObj]);
      const updatedGenres = [...selectedGenres, genreId];
      setSelectedGenres(updatedGenres);
      onSelect(updatedGenres);
      
      // También actualizar en Supabase
      try {
        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Actualizar en auth.users
          await supabase.auth.updateUser({
            data: {
              favorite_genres: updatedGenres
            }
          });
          
          // También actualizar en profiles
          const { error } = await supabase
            .from('profiles')
            .update({ 
              favorite_genres: updatedGenres 
            })
            .eq('id', user.id);
            
          if (error) {
            console.error('Error al actualizar géneros en profiles:', error);
            toast.error('Error al guardar tus preferencias');
          }
        }
      } catch (error) {
        console.error('Error al guardar preferencias musicales:', error);
        toast.error('Error al guardar tus preferencias');
      } finally {
        setIsSaving(false);
      }
      
      setNewGenre('');
      setShowAddDialog(false);
    }
  };

  const handleDeleteGenre = async (genreId: string) => {
    setCustomGenres(prev => prev.filter(genre => genre.id !== genreId));
    const updatedGenres = selectedGenres.filter(id => id !== genreId);
    setSelectedGenres(updatedGenres);
    onSelect(updatedGenres);
    
    // También actualizar en Supabase
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Actualizar en auth.users
        await supabase.auth.updateUser({
          data: {
            favorite_genres: updatedGenres
          }
        });
        
        // También actualizar en profiles
        const { error } = await supabase
            .from('profiles')
            .update({ 
              favorite_genres: updatedGenres 
            })
            .eq('id', user.id);
            
        if (error) {
          console.error('Error al actualizar géneros en profiles:', error);
          toast.error('Error al guardar tus preferencias');
        }
      }
    } catch (error) {
      console.error('Error al eliminar género musical:', error);
      toast.error('Error al guardar tus preferencias');
    } finally {
      setIsSaving(false);
    }
  };

  const allGenres = [...defaultGenres, ...customGenres];

  return (
    <>
      <div className="w-full max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <h6 className="text-lg font-medium mb-4 text-vyba-navy">Escoge tus géneros musicales</h6>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mx-auto" role="group" aria-label="Géneros musicales">
            {allGenres.map(genre => (
              <Badge
                key={genre.id}
                variant="default"
                className={cn(
                  "flex flex-col items-start justify-center cursor-pointer transition-all duration-150 relative",
                  "text-base font-medium px-8 py-6 rounded-xl gap-2",
                  selectedGenres.includes(genre.id)
                    ? "bg-vyba-gray text-vyba-navy font-medium bg-vyba-tertiary/20"
                    : "bg-vyba-gray text-vyba-tertiary hover:text-vyba-navy",
                  activePress === genre.id ? "transform scale-95" : "",
                  isSaving && "opacity-70 pointer-events-none"
                )}
                onClick={() => handleSelect(genre.id)}
                onMouseDown={() => handleMouseDown(genre.id)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {genre.icon}
                <span>{genre.name}</span>
                {!defaultGenres.find(g => g.id === genre.id) && (
                  <button
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-vyba-tertiary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGenre(genre.id);
                    }}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </Badge>
            ))}
            
            <Badge
              variant="default"
              className={cn(
                "flex flex-col items-start justify-center cursor-pointer transition-all duration-150",
                "text-base font-medium px-8 py-6 rounded-xl gap-2",
                "bg-vyba-gray text-vyba-tertiary hover:text-vyba-navy",
                activePress === 'add' ? "transform scale-95" : "",
                isSaving && "opacity-70 pointer-events-none"
              )}
              onClick={() => setShowAddDialog(true)}
              onMouseDown={() => handleMouseDown('add')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Plus className="w-6 h-6" />
              <span>Añadir otro</span>
            </Badge>
          </div>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Añadir género musical</DialogTitle>
          </DialogHeader>
          <div className="space-y-8 px-8">
            <div className="space-y-2">
              <Label htmlFor="genre-name">Nombre del género</Label>
              <Input
                id="genre-name"
                type="text"
                placeholder="Ej: Electronic"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0"
              />
            </div>
            <Button 
              variant="terciary"
              type="button" 
              className="w-full"
              onClick={handleAddGenre}
              disabled={!newGenre.trim() || isSaving}
            >
              Añadir género
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MusicGenresStep;
