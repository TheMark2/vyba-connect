import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Loader2, FileHeart } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cachedQuery, paginatedQuery } from '@/integrations/supabase/config';

// Definir la interfaz para las listas de favoritos
interface FavoriteList {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  description?: string | null;
  count?: number;
}

interface FavoriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistName: string;
  artistId: string;
  onConfirm: () => void;
  isFavorite: boolean;
}

// Esquema de validación para crear nueva lista
const newListSchema = z.object({
  name: z.string().min(1, 'El nombre de la lista es obligatorio')
});

const FavoriteDialog = ({ 
  open, 
  onOpenChange, 
  artistName,
  artistId,
  onConfirm, 
  isFavorite 
}: FavoriteDialogProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'select' | 'create' | 'remove'>('select');
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLists, setIsFetchingLists] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  // Form para crear nueva lista
  const form = useForm<z.infer<typeof newListSchema>>({
    resolver: zodResolver(newListSchema),
    defaultValues: {
      name: ''
    }
  });

  // Pre-cargar las listas cuando el componente se monta
  useEffect(() => {
    if (user) {
      fetchFavoriteLists();
    }
  }, [user]);
  
  // Determinar el paso inicial basado en el estado actual
  useEffect(() => {
    if (!open) return;

    if (isFavorite) {
      setStep('remove');
    } else if (!isFetchingLists && favoriteLists.length === 0) {
      setStep('create');
    } else {
      setStep('select');
    }
    
    form.reset();
  }, [open, isFavorite, isFetchingLists, favoriteLists.length]);

  const fetchFavoriteLists = async () => {
    if (!user) return;
    
    try {
      setIsFetchingLists(true);
      
      // Usar la función de paginación con caché
      const { data: listsData, error: listsError } = await cachedQuery(
        `favorite_lists:${user.id}`,
        () => paginatedQuery('favorite_lists', {
          filters: { user_id: user.id },
          orderBy: { column: 'created_at', ascending: false },
          select: 'id, name, created_at'
        })
      );
      
      if (listsError) throw listsError;
      
      // Obtener los conteos usando la función get_artist_count
      const enrichedLists = await Promise.all(listsData.data.map(async (list) => {
        const { data: countData, error: countError } = await supabase
          .rpc('get_artist_count', { list_id: list.id });
          
        if (countError) {
          console.error(`Error al obtener conteo para lista ${list.id}:`, countError);
          return {
            id: list.id,
            name: list.name,
            count: 0
          };
        }
        
        return {
          id: list.id,
          name: list.name,
          count: countData || 0
        };
      }));
      
      setFavoriteLists(enrichedLists);
    } catch (error) {
      console.error('Error al cargar listas de favoritos:', error);
      toast.error('No se pudieron cargar tus listas de favoritos');
    } finally {
      setIsFetchingLists(false);
    }
  };
  
  const handleCreateNewList = async (values: z.infer<typeof newListSchema>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Crear nueva lista
      const { data: newList, error: listError } = await supabase
        .from('favorite_lists')
        .insert({
          name: values.name.trim(),
          user_id: user.id
        })
        .select()
        .single();
      
      if (listError) throw listError;
      
      // Añadir el artista a la nueva lista
      const { error: artistError } = await supabase
        .from('favorite_artists')
        .insert({
          list_id: newList.id,
          user_id: user.id,
          artist_id: artistId,
          artist_name: artistName
        });
      
      if (artistError) throw artistError;
      
      // Actualizar la lista local de favoritos
      setFavoriteLists(prev => [{
        ...newList,
        count: 1
      }, ...prev]);
      
      // Llamar a la función de éxito
      onConfirm();
      
      // Cerrar el diálogo
      onOpenChange(false);
      
      toast.success('Lista creada y artista añadido', {
        icon: "❤️",
        position: "bottom-center",
      });
      
    } catch (error) {
      console.error('Error al crear lista:', error);
      toast.error('No se pudo crear la lista');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleListClick = async (listId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Verificar si el artista ya está en esta lista específica
      const { data: existingEntry, error: checkError } = await supabase
        .from('favorite_artists')
        .select('*')
        .eq('list_id', listId)
        .eq('user_id', user.id)
        .eq('artist_id', artistId)
        .single();
      
      // Corregido: Solo mostramos error si encontramos un artista con mismo ID en la misma lista
      if (existingEntry) {
        toast.error(`${artistName} ya está en esta lista`);
        setIsLoading(false);
        return;
      }
      
      // Añadir el artista a la lista seleccionada
      const { error } = await supabase
        .from('favorite_artists')
        .insert({
          list_id: listId,
          user_id: user.id,
          artist_id: artistId,
          artist_name: artistName
        });
      
      if (error) {
        console.error('Error al añadir artista:', error);
        throw error;
      }
      
      // Actualizar el conteo en la lista local
      setFavoriteLists(prev => prev.map(list => 
        list.id === listId 
          ? { ...list, count: (list.count || 0) + 1 }
          : list
      ));
      
      // Llamar a la función de éxito
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveFromFavorites = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Eliminar el artista de todas las listas
      const { error } = await supabase
        .from('favorite_artists')
        .delete()
        .match({ 
          user_id: user.id,
          artist_id: artistId
        });
      
      if (error) throw error;
      
      // Llamar a la función de éxito
      onConfirm();
      
      // Cerrar el diálogo
      onOpenChange(false);
      
      toast.success(`${artistName} eliminado de favoritos`, {
        icon: "👋",
        position: "bottom-center",
      });
      
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
      toast.error('No se pudo eliminar de favoritos');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderizar el paso de selección de lista con skeleton durante la carga
  const renderSelectStep = () => (
    <div className="flex flex-col py-4 px-4">
      <div className="w-full mb-4">
        {isFetchingLists ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="overflow-hidden animate-pulse">
                <div className="aspect-square w-full rounded-3xl bg-vyba-gray/50" />
                <div className="py-2">
                  <div className="h-5 w-3/4 mb-1 bg-vyba-gray/50 rounded" />
                  <div className="h-4 w-1/2 bg-vyba-gray/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : favoriteLists.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {favoriteLists.map(list => (
              <div 
                key={list.id}
                onClick={() => handleListClick(list.id)}
                className="cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:opacity-80"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-vyba-gray flex items-center justify-center">
                  <Heart className="w-12 h-12 text-vyba-navy" />
                </div>
                <div className="py-2">
                  <h4 className="font-medium text-base truncate">{list.name}</h4>
                  <p className="text-sm text-vyba-tertiary mb-0">{list.count} favoritos</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-vyba-gray rounded-xl">
            <FileHeart className="h-12 w-12 mx-auto mb-4 stroke-[1.5]" />
            <h3 className="text-xl font-medium mb-8">No tienes listas de favoritos</h3>
            <Button 
              variant="terciary" 
              onClick={() => setStep('create')}
            >
              Crear mi primera lista
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  
  // Renderizar el paso de creación de lista
  const renderCreateStep = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateNewList)} className="space-y-6 px-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>Nombre de la lista</Label>
              <FormControl>
                <Input 
                  placeholder="Ej: Mis DJs favoritos" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setNewListName(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="terciary" 
            type="submit"
            disabled={!form.getValues().name.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Crear lista"
            )}
          </Button>
        </div>
      </form>
    </Form>
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
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Quitar"
          )}
        </Button>
      </div>
    </div>
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="px-6 py-4">
          <DialogTitle className="text-center">
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
          <DialogFooter className="py-2 px-6">
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
