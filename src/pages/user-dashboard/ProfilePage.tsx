
import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Phone, ShieldX } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MUSIC_GENRES, MUSICIAN_TYPES } from '@/constants/music';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, userName, avatarUrl } = useAuth();
  const [joinDate, setJoinDate] = useState<string>('');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [preferredArtistTypes, setPreferredArtistTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (user?.id) {
          // Obtener datos del perfil directamente de la tabla profiles
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('favorite_genres, preferred_artist_types, created_at')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error al obtener datos de perfil:', profileError);
            // Si hay error al obtener de profiles, intentar obtener de metadatos de usuario
            if (user.user_metadata) {
              setFavoriteGenres(user.user_metadata.favorite_genres || []);
              setPreferredArtistTypes(user.user_metadata.preferred_artist_types || []);
            }
          } else if (profileData) {
            // Usar datos de la tabla profiles
            setFavoriteGenres(profileData.favorite_genres || []);
            setPreferredArtistTypes(profileData.preferred_artist_types || []);
            
            // Establecer fecha de creación si está disponible
            if (profileData.created_at) {
              const date = new Date(profileData.created_at);
              const month = date.toLocaleString('es-ES', { month: 'long' });
              const year = date.getFullYear();
              setJoinDate(`${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`);
            }
          }
        }
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
        toast.error('Error al cargar tus preferencias musicales');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.created_at) {
      const date = new Date(user.created_at);
      const month = date.toLocaleString('es-ES', { month: 'long' });
      const year = date.getFullYear();
      setJoinDate(`${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`);
    }

    fetchUserData();
  }, [user]);

  // Depuración
  useEffect(() => {
    if (user) {
      console.log('User metadata:', user.user_metadata);
      console.log('Favorite genres loaded:', favoriteGenres);
      console.log('Preferred artist types loaded:', preferredArtistTypes);
    }
  }, [user, favoriteGenres, preferredArtistTypes]);

  return (
    <UserDashboardLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold mb-8">Mi perfil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Columna izquierda - Solo tarjeta de perfil */}
          <div>
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="flex items-start gap-6">
                <div className="w-36 h-36 rounded-full overflow-hidden bg-vyba-beige">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={userName || 'Usuario'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-0">{userName || 'Usuario'}</h2>
                  <p className="text-vyba-tertiary mb-2">{user?.email}</p>
                  <Badge variant="secondary" className="text-sm bg-red-100 gap-2 text-red-500">
                    <ShieldX className="h-4 w-4 text-red-500" />
                    Sin móvil
                  </Badge>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-base text-vyba-navy mb-2">
                  Eres miembro desde
                </p>
                <p className="font-medium text-vyba-navy">
                  {joinDate}
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Resto de secciones */}
          <div className="space-y-8">
            {/* Información personal */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Información personal</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-base text-vyba-navy mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-vyba-navy">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-base text-vyba-navy mb-1">Móvil</p>
                  <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm bg-red-100 gap-2 text-red-500">
                    <ShieldX className="h-4 w-4 text-red-500" />
                    Sin verificar
                  </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Mapa de ubicación */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Ubicación</h3>
              <div className="flex items-center gap-2">
                <p className="font-medium text-vyba-navy mb-4">Sant Feliu de Codines, provincia de Barcelona</p>
              </div>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-vyba-beige">
                {/* Aquí irá el componente de mapa */}
                <div className="w-full h-full bg-[#1B4339]"></div>
              </div>
            </div>

            <Separator />

            {/* Preferencias musicales */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Tus preferencias musicales</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-base text-vyba-navy mb-3">Géneros favoritos</p>
                  {!isLoading && (
                    <>
                      <div className="flex items-center -space-x-12 py-12">
                        {favoriteGenres.slice(0, 4).map((genre, index) => (
                          <div 
                            key={genre}
                            className={`w-40 h-60 rounded-lg bg-vyba-beige ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'}`}
                          >
                            <img 
                              src={`/images/generos/${genre.toLowerCase()}.png`} 
                              alt={genre} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/images/generos/pop.png"; // Imagen por defecto
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {favoriteGenres.map(genre => (
                          <Badge key={genre} variant="secondary">{genre}</Badge>
                        ))}
                        {favoriteGenres.length === 0 && (
                          <p className="text-vyba-tertiary">No has seleccionado géneros favoritos</p>
                        )}
                      </div>
                    </>
                  )}
                  {isLoading && (
                    <div className="py-8 flex justify-center">
                      <div className="animate-pulse text-vyba-tertiary">Cargando preferencias...</div>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-base text-vyba-navy mb-3">Tipos de artistas favoritos</p>
                  {!isLoading && (
                    <>
                      <div className="flex -space-x-8 py-4">
                        {preferredArtistTypes.slice(0, 4).map((type) => (
                          <div 
                            key={type}
                            className="w-24 h-24 rounded-full bg-vyba-beige border border-white border-4"
                          >
                            <img 
                              src={`/images/artistas/${type.toLowerCase().replace(/ /g, '_')}.png`} 
                              alt={type}
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.currentTarget.src = "/images/artistas/ed_sheeran.png"; // Imagen por defecto
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {preferredArtistTypes.map(type => (
                          <Badge key={type} variant="secondary">{type}</Badge>
                        ))}
                        {preferredArtistTypes.length === 0 && (
                          <p className="text-vyba-tertiary">No has seleccionado tipos de artistas favoritos</p>
                        )}
                      </div>
                    </>
                  )}
                  {isLoading && (
                    <div className="py-8 flex justify-center">
                      <div className="animate-pulse text-vyba-tertiary">Cargando preferencias...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default ProfilePage;
