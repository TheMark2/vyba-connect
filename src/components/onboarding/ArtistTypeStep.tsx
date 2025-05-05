
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

interface ArtistTypeStepProps {
  onSelect: (types: string[]) => void;
  initialValues?: string[];
}

const defaultTypes = [
  { id: 'dj', name: 'DJ', icon: <Music className="w-6 h-6" /> },
  { id: 'cantante', name: 'Cantante', icon: <Music className="w-6 h-6" /> },
  { id: 'banda', name: 'Banda', icon: <Music className="w-6 h-6" /> },
  { id: 'pianista', name: 'Pianista', icon: <Music className="w-6 h-6" /> },
  { id: 'saxofonista', name: 'Saxofonista', icon: <Music className="w-6 h-6" /> },
  { id: 'guitarrista', name: 'Guitarrista', icon: <Music className="w-6 h-6" /> },
  { id: 'violinista', name: 'Violinista', icon: <Music className="w-6 h-6" /> },
  { id: 'trompetista', name: 'Trompetista', icon: <Music className="w-6 h-6" /> },
];

const ArtistTypeStep: React.FC<ArtistTypeStepProps> = ({ onSelect, initialValues = [] }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialValues);
  const [activePress, setActivePress] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newType, setNewType] = useState('');
  const [customTypes, setCustomTypes] = useState<Array<{ id: string; name: string; icon: JSX.Element }>>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Cargar tipos personalizados si existen en initialValues pero no están en defaultTypes
    const loadCustomTypes = () => {
      if (initialValues && initialValues.length > 0) {
        const customTypesFromInitial = initialValues
          .filter(typeId => !defaultTypes.some(defaultType => defaultType.id === typeId))
          .map(typeId => ({
            id: typeId,
            name: typeId.charAt(0).toUpperCase() + typeId.slice(1).replace(/-/g, ' '),
            icon: <Music className="w-6 h-6" />
          }));
        
        if (customTypesFromInitial.length > 0) {
          setCustomTypes(customTypesFromInitial);
        }
      }
    };

    loadCustomTypes();
  }, [initialValues]);

  const handleSelect = async (typeId: string) => {
    let updatedTypes: string[];
    
    if (selectedTypes.includes(typeId)) {
      updatedTypes = selectedTypes.filter(id => id !== typeId);
    } else {
      updatedTypes = [...selectedTypes, typeId];
    }
    
    setSelectedTypes(updatedTypes);
    onSelect(updatedTypes);
    
    // Intentar actualizar directamente en Supabase
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Actualizar en auth.users
        await supabase.auth.updateUser({
          data: {
            preferred_artist_types: updatedTypes
          }
        });
        
        // También actualizar en profiles
        const { error } = await supabase
          .from('profiles')
          .update({ 
            preferred_artist_types: updatedTypes 
          })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error al actualizar tipos de artistas en profiles:', error);
          toast.error('Error al guardar tus preferencias');
        }
      }
    } catch (error) {
      console.error('Error al guardar tipos de artistas:', error);
      toast.error('Error al guardar tus preferencias');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseDown = (typeId: string) => {
    setActivePress(typeId);
  };

  const handleMouseUp = () => {
    setActivePress(null);
  };

  const handleAddType = async () => {
    if (newType.trim()) {
      const typeId = newType.toLowerCase().replace(/\s+/g, '-');
      const newTypeObj = {
        id: typeId,
        name: newType.trim(),
        icon: <Music className="w-6 h-6" />
      };
      
      setCustomTypes(prev => [...prev, newTypeObj]);
      const updatedTypes = [...selectedTypes, typeId];
      setSelectedTypes(updatedTypes);
      onSelect(updatedTypes);
      
      // También actualizar en Supabase
      try {
        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Actualizar en auth.users
          await supabase.auth.updateUser({
            data: {
              preferred_artist_types: updatedTypes
            }
          });
          
          // También actualizar en profiles
          const { error } = await supabase
            .from('profiles')
            .update({ 
              preferred_artist_types: updatedTypes 
            })
            .eq('id', user.id);
            
          if (error) {
            console.error('Error al actualizar tipos de artistas en profiles:', error);
            toast.error('Error al guardar tus preferencias');
          }
        }
      } catch (error) {
        console.error('Error al guardar tipos de artistas:', error);
        toast.error('Error al guardar tus preferencias');
      } finally {
        setIsSaving(false);
      }
      
      setNewType('');
      setShowAddDialog(false);
    }
  };

  const handleDeleteType = async (typeId: string) => {
    setCustomTypes(prev => prev.filter(type => type.id !== typeId));
    const updatedTypes = selectedTypes.filter(id => id !== typeId);
    setSelectedTypes(updatedTypes);
    onSelect(updatedTypes);
    
    // También actualizar en Supabase
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Actualizar en auth.users
        await supabase.auth.updateUser({
          data: {
            preferred_artist_types: updatedTypes
          }
        });
        
        // También actualizar en profiles
        const { error } = await supabase
          .from('profiles')
          .update({ 
            preferred_artist_types: updatedTypes 
          })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error al actualizar tipos de artistas en profiles:', error);
          toast.error('Error al guardar tus preferencias');
        }
      }
    } catch (error) {
      console.error('Error al eliminar tipo de artista:', error);
      toast.error('Error al guardar tus preferencias');
    } finally {
      setIsSaving(false);
    }
  };

  const allTypes = [...defaultTypes, ...customTypes];

  return (
    <>
      <div className="w-full max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <h6 className="text-lg font-medium mb-4 text-vyba-navy">Escoge los tipos de artistas que te interesan</h6>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mx-auto" role="group" aria-label="Tipos de artistas">
            {allTypes.map(type => (
              <Badge
                key={type.id}
                variant="default"
                className={cn(
                  "flex flex-col items-start justify-center cursor-pointer transition-all duration-150 relative",
                  "text-base font-medium px-8 py-6 rounded-xl gap-2",
                  selectedTypes.includes(type.id)
                    ? "bg-vyba-gray text-vyba-navy font-medium bg-vyba-tertiary/20"
                    : "bg-vyba-gray text-vyba-tertiary hover:text-vyba-navy",
                  activePress === type.id ? "transform scale-95" : "",
                  isSaving && "opacity-70 pointer-events-none"
                )}
                onClick={() => handleSelect(type.id)}
                onMouseDown={() => handleMouseDown(type.id)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {type.icon}
                <span>{type.name}</span>
                {!defaultTypes.find(t => t.id === type.id) && (
                  <button
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-vyba-tertiary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteType(type.id);
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
            <DialogTitle className="text-center">Añadir tipo de artista</DialogTitle>
          </DialogHeader>
          <div className="space-y-8 px-8">
            <div className="space-y-2">
              <Label htmlFor="type-name">Nombre del tipo de artista</Label>
              <Input
                id="type-name"
                type="text"
                placeholder="Ej: Baterista"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0"
              />
            </div>
            <Button 
              variant="terciary"
              type="button" 
              className="w-full"
              onClick={handleAddType}
              disabled={!newType.trim() || isSaving}
            >
              Añadir tipo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtistTypeStep;
