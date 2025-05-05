
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, Edit2, User, Music, Calendar, CheckCircle, MapPin } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, reloadUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [preferredArtistTypes, setPreferredArtistTypes] = useState<string[]>([]);
  const [memberSince, setMemberSince] = useState<string>("");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          console.log("No hay usuario autenticado");
          return;
        }
        
        // Cargar datos del perfil desde la tabla profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error("Error al cargar perfil:", profileError);
          throw profileError;
        }
        
        console.log("Datos del perfil cargados:", profileData);
        setProfile(profileData);
        
        // Obtener géneros favoritos y tipos de artistas preferidos desde user.user_metadata
        // y usarlos como respaldo si no están en profiles
        let genres = [];
        let artistTypes = [];
        
        if (profileData.favorite_genres && profileData.favorite_genres.length > 0) {
          genres = profileData.favorite_genres;
        } else if (user.user_metadata?.favorite_genres) {
          genres = user.user_metadata.favorite_genres;
        }
        
        if (profileData.preferred_artist_types && profileData.preferred_artist_types.length > 0) {
          artistTypes = profileData.preferred_artist_types;
        } else if (user.user_metadata?.preferred_artist_types) {
          artistTypes = user.user_metadata.preferred_artist_types;
        }
        
        setFavoriteGenres(genres);
        setPreferredArtistTypes(artistTypes);
        
        // Formatear fecha de creación
        if (profileData.created_at) {
          const createdDate = new Date(profileData.created_at);
          setMemberSince(createdDate.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }));
        }
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del perfil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user, toast]);

  const getImageForGenre = (genre: string) => {
    const genreMap: Record<string, string> = {
      'Pop': '/images/genres/pop.jpg',
      'Rock': '/images/genres/rock.jpg',
      'Electrónica': '/images/genres/electronica.jpg',
      'Hip Hop': '/images/genres/hiphop.jpg',
      'Reggaetón': '/images/genres/reggaeton.jpg',
      'Jazz': '/images/genres/jazz.jpg',
      'Techno': '/images/genres/techno.jpg',
      'R&B': '/images/genres/rnb.jpg',
      'Clásica': '/images/genres/clasica.jpg',
      'House': '/images/genres/house.jpg',
      'Latino': '/images/genres/latino.jpg',
      'Indie': '/images/genres/indie.jpg',
      'Metal': '/images/genres/metal.jpg',
      'Folk': '/images/genres/folk.jpg',
      'Funk': '/images/genres/funk.jpg',
    };
    
    return genreMap[genre] || '/images/genres/default.jpg';
  };
  
  const getImageForArtistType = (type: string) => {
    const typeMap: Record<string, string> = {
      'DJ': '/images/artists/dj.jpg',
      'Cantante': '/images/artists/cantante.jpg',
      'Banda': '/images/artists/banda.jpg',
      'Pianista': '/images/artists/pianista.jpg',
      'Saxofonista': '/images/artists/saxofonista.jpg',
      'Guitarrista': '/images/artists/guitarrista.jpg',
      'Violinista': '/images/artists/violinista.jpg',
      'Trompetista': '/images/artists/trompetista.jpg',
      'Baterista': '/images/artists/baterista.jpg',
    };
    
    return typeMap[type] || '/images/artists/default.jpg';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                <AvatarFallback className="bg-vyba-gray text-vyba-tertiary">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{profile?.name || 'Usuario'} {profile?.last_name || ''}</h2>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
              
              <Button 
                variant="terciary" 
                size="sm" 
                className="mt-2"
                onClick={() => navigate('/user-onboarding')}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Editar perfil
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-vyba-tertiary" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{profile?.city || 'No especificada'}{profile?.province ? `, ${profile.province}` : ''}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-vyba-tertiary" />
                <div>
                  <p className="text-sm text-gray-500">Miembro desde</p>
                  <p className="font-medium">{memberSince || 'Fecha desconocida'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-vyba-tertiary" />
                <div>
                  <p className="text-sm text-gray-500">Estado de la cuenta</p>
                  <p className="font-medium">Activa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Music className="mr-2 h-5 w-5 text-vyba-tertiary" />
                Mis géneros musicales favoritos
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/user-onboarding')}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
            
            {favoriteGenres && favoriteGenres.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {favoriteGenres.map((genre) => (
                  <div key={genre} className="flex flex-col items-center space-y-2">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={getImageForGenre(genre)}
                        alt={genre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/genres/default.jpg';
                        }}
                      />
                    </div>
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                      {genre}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No has seleccionado géneros favoritos</p>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Music className="mr-2 h-5 w-5 text-vyba-tertiary" />
                Tipos de artistas que me interesan
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/user-onboarding')}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
            
            {preferredArtistTypes && preferredArtistTypes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {preferredArtistTypes.map((type) => (
                  <div key={type} className="flex flex-col items-center space-y-2">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <img
                        src={getImageForArtistType(type)}
                        alt={type}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/artists/default.jpg';
                        }}
                      />
                    </div>
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                      {type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No has seleccionado tipos de artistas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
