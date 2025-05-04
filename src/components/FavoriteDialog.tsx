import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

// Definir la interfaz para las listas de favoritos
interface FavoriteList {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  image?: string;
  count?: number;
}

interface FavoriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistName: string;
  onConfirm: () => void;
  isFavorite: boolean;
}

const FavoriteDialog = ({ 
  open, 
  onOpenChange, 
  artistName, 
  onConfirm, 
  isFavorite 
}: FavoriteDialogProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'select' | 'create' | 'remove'>('select');
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [newListName, setNewListName] = useState('');
  
  // Cargar las listas de favoritos del usuario
  useEffect(() => {
    if (open && user) {
      fetchFavoriteLists();
    }
  }, [open, user]);
  
  // Determinar el paso inicial basado en si el artista ya es favorito
  useEffect(() => {
    if (open) {
      setStep(isFavorite ? 'remove' : 'select');
      setNewListName('');
    }
  }, [open, isFavorite]);
  
  const fetchFavoriteLists = async () => {
    if (!user) return;
    
    try {
      setIsFetchingLists(true);
      
      // Para pruebas, simulamos que tenemos listas de favoritos
      // En una implementación real, esta consulta debe hacerse a una tabla real de "favorite_lists"
      const mockLists = [
        {
          id: '1',
          name: 'Mis artistas favoritos',
          user_id: user.id,
          created_at: new Date().toISOString(),
          image: '/images/dj1.webp',
          count: 5
        },
        {
          id: '2',
          name: 'DJs para eventos',
          user_id: user.id,
          created_at: new Date().toISOString(),
          image: '/images/dj2.webp',
          count: 3
        },
        {
          id: '3',
          name: 'Guitarristas',
          user_id: user.id,
          created_at: new Date().toISOString(),
          image: '/images/dj3.webp',
          count: 2
        }
      ];
      
      // Carga casi instantánea para mejor experiencia de usuario
      setTimeout(() => {
        setFavoriteLists(mockLists);
        setIsFetchingLists(false);
      }, 100);
      
      // En una implementación real, el código sería así:
      /*
      const { data, error } = await supabase
        .from('favorite_lists')
        .select('*, favorite_artists:favorite_artists(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFavoriteLists(data || []);
      */
      
    } catch (error) {
      console.error('Error al cargar listas de favoritos:', error);
      toast.error('No se pudieron cargar tus listas de favoritos');
      setIsFetchingLists(false);
    }
  };
  
  const handleCreateNewList = async () => {
    if (!user || !newListName.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Para pruebas, simulamos la creación de una nueva lista
      const newList: FavoriteList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        image: '/images/dj4.webp',
        count: 1
      };
      
      // En una implementación real, el código sería así:
      /*
      const { data: newList, error } = await supabase
        .from('favorite_lists')
        .insert({
          name: newListName.trim(),
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      */
      
      // Actualizar la lista local de favoritos
      setFavoriteLists(prev => [newList, ...prev]);
      
      // Añadir el artista a la lista sin demora
      addToFavoriteList(newList.id);
      
      toast.success('Lista creada y artista añadido');
    } catch (error) {
      console.error('Error al crear lista:', error);
      toast.error('No se pudo crear la lista');
      setIsLoading(false);
    }
  };
  
  const handleListClick = (listId: string) => {
    addToFavoriteList(listId);
  };
  
  const addToFavoriteList = async (listId: string) => {
    if (!user || !listId) return;
    
    try {
      // Para pruebas, simulamos la adición a favoritos
      // En una implementación real, aquí guardaríamos en Supabase:
      /*
      const { error } = await supabase
        .from('favorite_artists')
        .insert({
          list_id: listId,
          artist_id: artistId, // Necesitaríamos el ID del artista
          user_id: user.id,
          artist_name: artistName // Opcional, para facilitar consultas
        });
      
      if (error) throw error;
      */
      
      // Llamar a la función de éxito proporcionada por el componente padre
      onConfirm();
      
      // Cerrar el diálogo
      onOpenChange(false);
      
      toast.success(`${artistName} añadido a favoritos`, {
        icon: "❤️",
        position: "bottom-center",
      });
      
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
      toast.error('No se pudo añadir a favoritos');
    }
  };
  
  const handleRemoveFromFavorites = () => {
    // Para pruebas, simulamos la eliminación de favoritos
    // En una implementación real, aquí eliminaríamos de Supabase:
    /*
    const { error } = await supabase
      .from('favorite_artists')
      .delete()
      .match({ 
        user_id: user.id,
        artist_id: artistId // Necesitaríamos el ID del artista
      });
    
    if (error) throw error;
    */
    
    // Llamar a la función de éxito proporcionada por el componente padre
    onConfirm();
    
    // Cerrar el diálogo
    onOpenChange(false);
    
    toast.success(`${artistName} eliminado de favoritos`, {
      icon: "👋",
      position: "bottom-center",
    });
  };
  
  // Renderizar skeletons para la carga
  const renderSkeletons = () => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {[1, 2, 3, 4].map(item => (
        <div key={item} className="overflow-hidden">
          <Skeleton className="aspect-square w-full rounded-3xl bg-vyba-gray" />
          <div className="py-2">
            <Skeleton className="h-5 w-3/4 mb-1 bg-vyba-gray" />
            <Skeleton className="h-4 w-1/2 bg-vyba-gray" />
          </div>
        </div>
      ))}
    </div>
  );
  
  // Renderizar el paso de selección de lista
  const renderSelectStep = () => (
    <div className="flex flex-col py-4 px-4">
      <div className="w-full mb-4">
        
        {isFetchingLists ? (
          renderSkeletons()
        ) : favoriteLists.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {favoriteLists.map(list => (
              <div 
                key={list.id}
                onClick={() => handleListClick(list.id)}
                className="cursor-pointer overflow-hidden transition-all duration-300 ease-in-out"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
                  <img 
                    src={list.image || '/images/placeholder.jpg'} 
                    alt={list.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-2">
                  <h4 className="font-medium text-base truncate">{list.name}</h4>
                  <p className="text-sm text-vyba-tertiary mb-0">{list.count || 0} favoritos</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <p className="text-gray-500 mb-4">No tienes listas de favoritos</p>
            <Button 
              variant="terciary" 
              onClick={() => setStep('create')}
            >
              Crear tu primera lista
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  
  // Renderizar el paso de creación de lista
  const renderCreateStep = () => (
    <div className="flex flex-col py-4 px-4">
      <div className="w-full mb-6">
        <Label htmlFor="list-name" className="mb-2 block text-sm">Nombre de la lista</Label>
        <Input
          id="list-name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Ej: Mis DJs favoritos"
          className="w-full"
        />
      </div>
      
      <div className="flex gap-3 w-full">
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={() => setStep('select')}
        >
          Volver
        </Button>
        
        <Button 
          variant="terciary" 
          className="flex-1"
          onClick={handleCreateNewList}
          disabled={!newListName.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Crear y añadir"
          )}
        </Button>
      </div>
    </div>
  );
  
  // Renderizar el paso de eliminación de favoritos
  const renderRemoveStep = () => (
    <div className="flex flex-col items-center py-4 px-4">
      <h3 className="text-lg font-medium mb-6 text-center">
        ¿Quieres quitar a {artistName} de tus favoritos?
      </h3>
      
      <div className="flex gap-3 w-full">
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
        
        <Button 
          variant="default" 
          className="flex-1 bg-red-500 hover:bg-red-600"
          onClick={handleRemoveFromFavorites}
        >
          Quitar
        </Button>
      </div>
    </div>
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center px-4 mb-2">
            {step === 'remove' ? "Quitar de favoritos" : 
             step === 'create' ? "Crear lista de favoritos" : 
             "Añadir a favoritos"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {step === 'select' && renderSelectStep()}
          {step === 'create' && renderCreateStep()}
          {step === 'remove' && renderRemoveStep()}
        </div>
        
        {step === 'select' && (
          <DialogFooter className="py-2 px-4">
            <Button 
              variant="terciary" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setStep('create')}
            >
              <Plus className="h-4 w-4" />
              Crear nueva lista
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteDialog; 