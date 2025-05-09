// Aquí necesitamos corregir las referencias a data en las respuestas de paginatedQuery y cachedQuery
// Actualiza los accesos a data para manejar correctamente la estructura de respuesta

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Plus, Trash, MoreVertical } from 'lucide-react';
import ArtistProfileCard from '@/components/ArtistProfileCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { cachedQuery, paginatedQuery } from '@/integrations/supabase/config';

// Definir interfaces para los tipos
interface FavoriteList {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  user_id: string;
  count?: number;
}

interface FavoriteArtist {
  id: string;
  artist_id: string;
  artist_name: string;
  list_id: string;
  user_id: string;
  created_at: string;
}

interface ArtistData {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  price_range: string;
  // Otros campos según se necesite
}

const FavoritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesList, setFavoritesList] = useState<FavoriteList[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [artists, setArtists] = useState<ArtistData[]>([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [createListDialogOpen, setCreateListDialogOpen] = useState(false);
  const [deleteListDialogOpen, setDeleteListDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<FavoriteList | null>(null);
  const [editListDialogOpen, setEditListDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<FavoriteList | null>(null);
  const [editedListName, setEditedListName] = useState('');

  // Cargar listas de favoritos al montar el componente
  useEffect(() => {
    if (user) {
      loadFavoriteLists();
    }
  }, [user]);

  // Cargar artistas cuando se selecciona una lista
  useEffect(() => {
    if (selectedList) {
      loadArtistsInList(selectedList);
    }
  }, [selectedList]);

  const loadFavoriteLists = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Usar la función cachedQuery para optimizar
      const result = await cachedQuery(
        `favorite_lists:${user.id}`,
        () => paginatedQuery('favorite_lists', {
          filters: { user_id: user.id },
          orderBy: { column: 'created_at', ascending: false },
          select: 'id, name, description, created_at, user_id'
        })
      );

      // Corregido: Verificar la estructura de result antes de acceder a data
      if (result.error) throw result.error;
      
      // Acceder a los datos de manera segura
      const lists = result.data || [];
      
      // Obtener el conteo de artistas para cada lista
      const listsWithCount = await Promise.all(lists.map(async (list) => {
        const { data: countData, error: countError } = await supabase
          .rpc('get_artist_count', { list_id: list.id });
        
        if (countError) {
          console.error(`Error al obtener conteo para lista ${list.id}:`, countError);
          return { ...list, count: 0 };
        }
        
        return { ...list, count: countData || 0 };
      }));
      
      setFavoritesList(listsWithCount);
      
      // Seleccionar la primera lista si existe
      if (listsWithCount.length > 0 && !selectedList) {
        setSelectedList(listsWithCount[0].id);
      }
      
    } catch (error) {
      console.error('Error al cargar listas de favoritos:', error);
      toast.error('No se pudieron cargar tus listas de favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadArtistsInList = async (listId: string) => {
    try {
      setIsLoadingArtists(true);
      
      // Obtener los artistas de la lista seleccionada
      const { data: artistsData, error: artistsError } = await supabase
        .from('favorite_artists')
        .select('artist_id, artist_name')
        .eq('list_id', listId);
      
      if (artistsError) throw artistsError;
      
      // Mapear los resultados a la estructura ArtistData
      const mappedArtists: ArtistData[] = artistsData.map(artist => ({
        id: artist.artist_id,
        name: artist.artist_name,
        type: 'artist', // Ajusta según sea necesario
        description: 'Descripción no disponible', // Ajusta según sea necesario
        images: [], // Ajusta según sea necesario
        rating: 0, // Ajusta según sea necesario
        price_range: 'N/A' // Ajusta según sea necesario
      }));
      
      setArtists(mappedArtists);
    } catch (error) {
      console.error('Error al cargar artistas:', error);
      toast.error('No se pudieron cargar los artistas de esta lista');
    } finally {
      setIsLoadingArtists(false);
    }
  };

  const createNewList = async () => {
    if (!user) return;
    
    try {
      setIsCreatingList(true);
      
      // Crear la nueva lista en la base de datos
      const { data: newList, error: listError } = await supabase
        .from('favorite_lists')
        .insert({
          name: newListName.trim(),
          user_id: user.id
        })
        .select()
        .single();
      
      if (listError) throw listError;
      
      // Actualizar el estado local con la nueva lista
      setFavoritesList(prev => [...prev, {
        id: newList.id,
        name: newList.name,
        description: newList.description,
        created_at: newList.created_at,
        user_id: newList.user_id,
        count: 0
      }]);
      
      // Cerrar el diálogo y limpiar el nombre
      setCreateListDialogOpen(false);
      setNewListName('');
      
      toast.success('Lista creada con éxito', {
        icon: "✅",
        position: "bottom-center",
      });
      
    } catch (error) {
      console.error('Error al crear la lista:', error);
      toast.error('No se pudo crear la lista');
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleDeleteList = async () => {
    if (!user || !listToDelete) return;
    
    try {
      // Eliminar la lista de la base de datos
      const { error: deleteError } = await supabase
        .from('favorite_lists')
        .delete()
        .eq('id', listToDelete.id)
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      
      // Actualizar el estado local eliminando la lista
      setFavoritesList(prev => prev.filter(list => list.id !== listToDelete.id));
      
      // Cerrar el diálogo y limpiar la lista a eliminar
      setDeleteListDialogOpen(false);
      setListToDelete(null);
      
      // Si la lista eliminada era la seleccionada, deseleccionar
      if (selectedList === listToDelete.id) {
        setSelectedList(null);
        setArtists([]);
      }
      
      toast.success('Lista eliminada con éxito', {
        icon: "🗑️",
        position: "bottom-center",
      });
      
    } catch (error) {
      console.error('Error al eliminar la lista:', error);
      toast.error('No se pudo eliminar la lista');
    }
  };

  const handleRenameList = async () => {
    if (!user || !listToEdit) return;
    
    try {
      // Actualizar el nombre de la lista en la base de datos
      const { data: updatedList, error: updateError } = await supabase
        .from('favorite_lists')
        .update({ name: editedListName.trim() })
        .eq('id', listToEdit.id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Actualizar el estado local con el nuevo nombre
      setFavoritesList(prev => prev.map(list => 
        list.id === listToEdit.id ? { ...list, name: updatedList.name } : list
      ));
      
      // Cerrar el diálogo y limpiar los estados
      setEditListDialogOpen(false);
      setListToEdit(null);
      setEditedListName('');
      
      toast.success('Lista renombrada con éxito', {
        icon: "📝",
        position: "bottom-center",
      });
      
    } catch (error) {
      console.error('Error al renombrar la lista:', error);
      toast.error('No se pudo renombrar la lista');
    }
  };

  const handleRemoveFromFavorites = async (artistId: string) => {
    if (!user || !selectedList) return;
    
    try {
      // Eliminar el artista de la lista seleccionada
      const { error: deleteError } = await supabase
        .from('favorite_artists')
        .delete()
        .eq('list_id', selectedList)
        .eq('artist_id', artistId)
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      
      // Actualizar el estado local eliminando el artista
      setArtists(prev => prev.filter(artist => artist.id !== artistId));
      
      // Actualizar el conteo en la lista local
      setFavoritesList(prev => prev.map(list => 
        list.id === selectedList 
          ? { ...list, count: (list.count || 1) - 1 }
          : list
      ));
      
      toast.success('Artista eliminado de la lista', {
        icon: "💔",
        position: "bottom-center",
      });
      
    } catch (error) {
      console.error('Error al eliminar el artista:', error);
      toast.error('No se pudo eliminar el artista de la lista');
    }
  };

  const renderEmptyState = () => (
    <div className="text-center py-12 bg-vyba-gray rounded-xl">
      <Heart className="h-12 w-12 mx-auto mb-4 stroke-[1.5]" />
      <h3 className="text-xl font-medium mb-8">No tienes artistas en esta lista</h3>
      <Button 
        variant="terciary" 
        onClick={() => navigate('/')}
      >
        Descubrir artistas
      </Button>
    </div>
  );

  const renderListsSkeleton = () => (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(item => (
        <div key={item} className="overflow-hidden animate-pulse">
          <div className="aspect-square w-full rounded-3xl bg-vyba-gray/50" />
          <div className="py-2">
            <div className="h-5 w-3/4 mb-1 bg-vyba-gray/50 rounded" />
            <div className="h-4 w-1/2 bg-vyba-gray/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderArtistsSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
  );

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Mis favoritos</h1>
          <Button 
            variant="terciary"
            className="flex items-center gap-2"
            onClick={() => setCreateListDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Nueva lista
          </Button>
        </div>
        
        <Tabs defaultValue={selectedList || ''} className="w-full">
          <TabsList className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
            {isLoading ? (
              renderListsSkeleton()
            ) : favoritesList.length > 0 ? (
              favoritesList.map(list => (
                <TabsTrigger 
                  key={list.id} 
                  value={list.id}
                  onClick={() => setSelectedList(list.id)}
                  className="data-[state=active]:bg-secondary data-[state=active]:text-foreground"
                >
                  {list.name}
                  <Badge variant="outline" className="ml-2">{list.count || 0}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="ml-auto h-8 w-8 p-0 rounded-full">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setListToEdit(list);
                        setEditedListName(list.name);
                        setEditListDialogOpen(true);
                      }}>
                        Renombrar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setListToDelete(list);
                        setDeleteListDialogOpen(true);
                      }} className="text-red-500">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TabsTrigger>
              ))
            ) : (
              <div className="text-center py-12 bg-vyba-gray rounded-xl col-span-3">
                <Heart className="h-12 w-12 mx-auto mb-4 stroke-[1.5]" />
                <h3 className="text-xl font-medium mb-8">No tienes listas de favoritos</h3>
                <Button 
                  variant="terciary" 
                  onClick={() => setCreateListDialogOpen(true)}
                >
                  Crear mi primera lista
                </Button>
              </div>
            )}
          </TabsList>
          
          <div className="w-full">
            {selectedList ? (
              <TabsContent value={selectedList} className="space-y-4">
                {isLoadingArtists ? (
                  renderArtistsSkeleton()
                ) : artists.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {artists.map(artist => (
                      <div key={artist.id}>
                        <ArtistProfileCard artist={artist} />
                        <Button 
                          variant="secondary" 
                          className="w-full mt-2"
                          onClick={() => handleRemoveFromFavorites(artist.id)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  renderEmptyState()
                )}
              </TabsContent>
            ) : (
              <div className="text-center py-12 bg-vyba-gray rounded-xl">
                <Heart className="h-12 w-12 mx-auto mb-4 stroke-[1.5]" />
                <h3 className="text-xl font-medium mb-8">Selecciona o crea una lista de favoritos</h3>
              </div>
            )}
          </div>
        </Tabs>
        
        {/* Dialog para crear nueva lista */}
        <Dialog open={createListDialogOpen} onOpenChange={setCreateListDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva lista</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la lista</Label>
                <Input 
                  id="name" 
                  placeholder="Ej: Mis DJs favoritos" 
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button 
                variant="default" 
                onClick={() => createNewList()}
                disabled={isCreatingList || !newListName.trim()}
              >
                {isCreatingList ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Creando...</span>
                  </div>
                ) : 'Crear lista'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para eliminar lista */}
        <Dialog open={deleteListDialogOpen} onOpenChange={setDeleteListDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar lista</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>¿Estás seguro de que quieres eliminar la lista "{listToDelete?.name}"?</p>
              <p className="text-gray-500 text-sm mt-2">Esta acción no se puede deshacer.</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteList()}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para editar lista */}
        <Dialog open={editListDialogOpen} onOpenChange={setEditListDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar lista</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre de la lista</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Nombre de la lista" 
                  value={editedListName}
                  onChange={(e) => setEditedListName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button 
                variant="default" 
                onClick={() => handleRenameList()}
                disabled={!editedListName.trim()}
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FavoritesPage;
