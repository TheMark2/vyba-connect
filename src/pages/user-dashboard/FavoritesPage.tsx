import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Heart, ChevronLeft, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import ArtistProfileCard from '@/components/ArtistProfileCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define interfaces
interface FavoriteList {
  id: string;
  name: string;
  image: string;
  count: number;
  artists?: ArtistInfo[];
}

interface ArtistInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  isFavorite: boolean;
}

// Esquema de validación para crear nueva lista
const newListSchema = z.object({
  name: z.string().min(1, 'El nombre de la lista es obligatorio')
});

const FavoritesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<FavoriteList | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [listToDelete, setListToDelete] = useState<FavoriteList | null>(null);

  // Form para crear nueva lista
  const form = useForm<z.infer<typeof newListSchema>>({
    resolver: zodResolver(newListSchema),
    defaultValues: {
      name: ''
    }
  });

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      fetchFavoriteLists();
    }
  }, [isAuthenticated, navigate]);

  // Cargar las listas de favoritos
  const fetchFavoriteLists = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Obtener listas de favoritos del usuario
      const { data: listsData, error: listsError } = await supabase
        .from('favorite_lists' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (listsError) throw listsError;
      
      if (!listsData || listsData.length === 0) {
        setFavoriteLists([]);
        setIsLoading(false);
        return;
      }
      
      // Para cada lista, obtener conteo y una imagen representativa
      const enrichedLists = await Promise.all(listsData.map(async (list: any) => {
        // Obtener los artistas favoritos para esta lista
        const { data: favoritesData, error: favoritesError, count } = await supabase
          .from('favorite_artists' as any)
          .select('artist_id', { count: 'exact' })
          .eq('list_id', list.id)
          .eq('user_id', user.id);
          
        if (favoritesError) throw favoritesError;
        
        // Obtener la primera imagen para mostrar (si hay favoritos)
        let image = '/images/placeholder-favorite.webp'; // Imagen por defecto
        
        if (favoritesData && favoritesData.length > 0) {
          // Obtener detalles del primer artista para usar su imagen
          const { data: artistData } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', (favoritesData as any)[0].artist_id)
            .single();
            
          if (artistData && (artistData as any).avatar_url) {
            image = (artistData as any).avatar_url;
          }
        }
        
        return {
          id: list.id,
          name: list.name,
          image: image,
          count: count || 0
        };
      }));
      
      setFavoriteLists(enrichedLists);
    } catch (error) {
      console.error('Error al cargar listas de favoritos:', error);
      toast.error('No se pudieron cargar tus listas de favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar artistas de una lista específica
  const fetchListArtists = async (listId: string) => {
    if (!user) return;
    
    try {
      // Obtener los IDs de artistas favoritos
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorite_artists' as any)
        .select('artist_id')
        .eq('list_id', listId)
        .eq('user_id', user.id);
        
      if (favoritesError) throw favoritesError;
      
      if (!favoritesData || favoritesData.length === 0) {
        return [];
      }
      
      // Obtener detalles de los artistas
      const artistIds = (favoritesData as any[]).map(fav => fav.artist_id);
      
      const { data: artistsData, error: artistsError } = await supabase
        .from('profiles')
        .select('id, name, type, description, images, rating, price_range')
        .in('id', artistIds)
        .eq('is_artist', true);
        
      if (artistsError) throw artistsError;
      
      if (!artistsData) return [];
      
      // Transformar datos al formato requerido
      return (artistsData as any[]).map(artist => ({
        id: artist.id,
        name: artist.name || 'Artista',
        type: artist.type || 'Músico',
        description: artist.description || '',
        images: artist.images || ['/images/placeholder-artist.webp'],
        rating: artist.rating || 4.5,
        priceRange: artist.price_range || '€€',
        isFavorite: true
      }));
    } catch (error) {
      console.error('Error al cargar artistas de la lista:', error);
      toast.error('No se pudieron cargar los artistas de esta lista');
      return [];
    }
  };

  const handleCreateList = () => {
    setIsCreatingList(true);
  };

  const onSubmitNewList = async (values: z.infer<typeof newListSchema>) => {
    if (!user) return;
    
    try {
      // Crear nueva lista en la base de datos
      const { data, error } = await supabase
        .from('favorite_lists' as any)
        .insert({
          name: values.name,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Añadir la nueva lista al estado
      setFavoriteLists(prev => [{
        id: (data as any).id,
        name: (data as any).name,
        image: '/images/placeholder-favorite.webp',
        count: 0
      }, ...prev]);
      
      setIsCreatingList(false);
      form.reset();
      toast.success('Lista creada correctamente');
    } catch (error) {
      console.error('Error al crear lista:', error);
      toast.error('No se pudo crear la lista');
    }
  };

  const handleListClick = async (list: FavoriteList) => {
    try {
      // Obtener artistas de esta lista
      const artists = await fetchListArtists(list.id);
      
      // Actualizar la lista seleccionada con los artistas
      setSelectedList({
        ...list,
        artists: artists
      });
      
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error al cargar detalles de la lista:', error);
      toast.error('No se pudieron cargar los detalles de esta lista');
    }
  };

  const handleBackToLists = () => {
    setSelectedList(null);
  };

  const handleRemoveFromFavorites = async (artistId: string) => {
    if (!selectedList || !user) return;
    
    try {
      // Eliminar de la base de datos
      const { error } = await supabase
        .from('favorite_artists' as any)
        .delete()
        .match({ 
          user_id: user.id,
          list_id: selectedList.id,
          artist_id: artistId
        });
      
      if (error) throw error;
      
      // Actualizar el estado local primero para una UI responsiva
      setSelectedList(prevSelected => {
        if (!prevSelected) return null;
        
        const updatedArtists = prevSelected.artists?.filter(artist => artist.id !== artistId) || [];
        
        return {
          ...prevSelected,
          artists: updatedArtists,
          count: updatedArtists.length
        };
      });
      
      // Actualizar la lista principal
      setFavoriteLists(prevLists => {
        return prevLists.map(list => {
          if (list.id === selectedList.id) {
            return {
              ...list,
              count: list.count - 1
            };
          }
          return list;
        });
      });
      
      toast.success('Artista eliminado de favoritos', {
        position: "bottom-center",
      });
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
      toast.error('No se pudo eliminar el artista de favoritos');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, list: FavoriteList) => {
    e.stopPropagation(); // Evita que se active el onClick del padre
    setListToDelete(list);
    setShowDeleteDialog(true);
  };

  const handleDeleteList = async () => {
    if (!listToDelete || !user) return;
    
    try {
      // Primero eliminar todas las relaciones de favoritos
      const { error: favoritesError } = await supabase
        .from('favorite_artists' as any)
        .delete()
        .match({
          user_id: user.id,
          list_id: listToDelete.id
        });
        
      if (favoritesError) throw favoritesError;
      
      // Después eliminar la lista
      const { error } = await supabase
        .from('favorite_lists' as any)
        .delete()
        .eq('id', listToDelete.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Actualizar el estado local para eliminar la lista
      setFavoriteLists(prevLists => 
        prevLists.filter(list => list.id !== listToDelete.id)
      );
      
      toast.success(`"${listToDelete.name}" ha sido eliminada`);
      setShowDeleteDialog(false);
      setListToDelete(null);
    } catch (error) {
      console.error('Error al eliminar la lista:', error);
      toast.error('No se pudo eliminar la lista');
    }
  };

  // Renderizar skeletons para la carga
  const renderSkeletons = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[1, 2, 3, 4, 5, 6].map(item => (
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

  // Renderizar la vista de listas
  const renderListsView = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-semibold">Mis listas de favoritos</h1>
        <Button 
          variant="terciary" 
          className="flex items-center gap-2"
          onClick={handleCreateList}
        >
          <Plus className="h-4 w-4" />
          Crear lista
        </Button>
      </div>
      
      {isLoading ? (
        renderSkeletons()
      ) : favoriteLists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {favoriteLists.map(list => (
            <div 
              key={list.id}
              onClick={() => handleListClick(list)}
              className="cursor-pointer overflow-hidden transition-all duration-300 ease-in-out group"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
                <img 
                  src={list.image} 
                  alt={list.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white fill-white opacity-70" />
                </div>
                {/* Botón de eliminar que aparece con hover */}
                <div 
                  className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => handleDeleteClick(e, list)}
                >
                  <div className="bg-white rounded-full p-2 shadow-md cursor-pointer hover:scale-110 transition-transform">
                    <X className="h-4 w-4 text-vyba-navy" />
                  </div>
                </div>
              </div>
              <div className="py-2">
                <h4 className="font-medium text-base truncate">{list.name}</h4>
                <p className="text-sm text-vyba-tertiary mb-0">{list.count} favoritos</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No tienes listas de favoritos</h3>
          <p className="text-vyba-tertiary mb-6 max-w-md mx-auto">
            Crea tu primera lista de favoritos para empezar a guardar artistas que te gusten
          </p>
          <Button 
            variant="terciary" 
            onClick={handleCreateList}
          >
            Crear lista de favoritos
          </Button>
        </div>
      )}

      {/* Diálogo de confirmación para eliminar lista */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar lista de favoritos</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar la lista "{listToDelete?.name}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDeleteList}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear nueva lista */}
      <Dialog open={isCreatingList} onOpenChange={setIsCreatingList}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear lista de favoritos</DialogTitle>
            <DialogDescription>
              Dale un nombre a tu nueva lista de favoritos
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitNewList)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la lista</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Mis DJs favoritos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreatingList(false);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Crear lista</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );

  // Renderizar la vista de artistas en una lista seleccionada
  const renderSelectedListView = () => {
    if (!selectedList) return null;
    
    return (
      <>
        <div className="flex flex-col items-start justify-start gap-4 mb-6">
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={handleBackToLists}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-semibold mb-2 mt-8">{selectedList.name}</h1>
            <p className="text-vyba-tertiary mb-0">{selectedList.count} artistas favoritos</p>
          </div>
        </div>
        
        {selectedList.artists && selectedList.artists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {selectedList.artists.map(artist => (
              <ArtistProfileCard
                key={artist.id}
                id={artist.id}
                name={artist.name}
                type={artist.type}
                description={artist.description}
                images={artist.images}
                rating={artist.rating}
                priceRange={artist.priceRange}
                isFavorite={true}
                onFavoriteToggle={() => handleRemoveFromFavorites(artist.id)}
                onClick={() => navigate(`/artista/${artist.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-vyba-tertiary">No hay artistas en esta lista</p>
          </div>
        )}
      </>
    );
  };

  return (
    <UserDashboardLayout>
      <main className="container mx-auto px-6 py-12">
        {selectedList ? renderSelectedListView() : renderListsView()}
      </main>
    </UserDashboardLayout>
  );
};

export default FavoritesPage; 