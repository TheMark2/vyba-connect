
import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Phone, ShieldX } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LocationMap from '@/components/LocationMap';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  last_name: string | null;
  birth_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  city: string | null;
  province: string | null;
  coordinates: { lat: number; lng: number } | null;
  favorite_genres: string[];
  preferred_artist_types: string[];
}

interface MusicPreferences {
  favorite_genres: string[];
  preferred_artist_types: string[];
}

const ProfilePage = () => {
  const { user, userName, avatarUrl } = useAuth();
  const [joinDate, setJoinDate] = useState<string>('');
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [musicPreferences, setMusicPreferences] = useState<MusicPreferences>({
    favorite_genres: [],
    preferred_artist_types: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [locationCoordinates, setLocationCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.created_at) {
      const date = new Date(user.created_at);
      const month = date.toLocaleString('es-ES', { month: 'long' });
      const year = date.getFullYear();
      setJoinDate(`${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`);
    }
  }, [user]);

  // Geocodificar la dirección del usuario cuando cambie profileData
  useEffect(() => {
    const geocodeLocation = async () => {
      if (!profileData?.city || !profileData?.province) return;
      
      try {
        // Obtener el token de Mapbox desde la función de Supabase
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (tokenError) {
          console.error('Error al obtener el token de Mapbox:', tokenError);
          return;
        }
        
        const mapboxToken = tokenData.token;
        if (!mapboxToken) {
          console.error('No se pudo obtener el token de Mapbox');
          return;
        }
        
        // Geocodificar la ubicación
        const query = `${profileData.city}, ${profileData.province}, España`;
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=es&limit=1`
        );
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setLocationCoordinates({ lat, lng });
          
          // Actualizar profileData con las coordenadas
          setProfileData(prevData => {
            if (!prevData) return null;
            return {
              ...prevData,
              coordinates: { lat, lng }
            };
          });
        } else {
          // Si no hay resultados, usar coordenadas por defecto de Madrid
          setLocationCoordinates({ lat: 40.4167754, lng: -3.7037902 });
        }
      } catch (error) {
        console.error('Error al geocodificar la ubicación:', error);
        // En caso de error, usar coordenadas por defecto
        setLocationCoordinates({ lat: 40.4167754, lng: -3.7037902 });
      }
    };
    
    geocodeLocation();
  }, [profileData?.city, profileData?.province]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          console.log('Datos del perfil:', data);
          setProfileData(data as Profile);
        }
      } catch (error) {
        console.error('Error al cargar los datos del perfil:', error);
        toast.error('Error al cargar los datos del perfil');
      }
    };
    fetchProfileData();
  }, [user]);

  // Obtener preferencias musicales
  useEffect(() => {
    const fetchMusicPreferences = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('favorite_genres, preferred_artist_types, name, email, avatar_url, location')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error al cargar preferencias musicales:', error);
          toast.error('No se pudieron cargar tus preferencias musicales');
          return;
        }

        if (data) {
          console.log('Datos del perfil cargados:', data);
          setMusicPreferences({
            favorite_genres: Array.isArray(data.favorite_genres) ? data.favorite_genres : [],
            preferred_artist_types: Array.isArray(data.preferred_artist_types) ? data.preferred_artist_types : []
          });
        } else {
          console.log('No se encontraron datos del perfil');
          // Si no hay datos, mostrar el estado vacío
          setMusicPreferences({
            favorite_genres: [],
            preferred_artist_types: []
          });
        }
      } catch (error) {
        console.error('Error al cargar preferencias musicales:', error);
        toast.error('No se pudieron cargar tus preferencias musicales');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicPreferences();
  }, [user]);

  // Renderizar el contenido de preferencias musicales
  const renderMusicPreferences = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div>
            <div className="h-6 w-48 bg-vyba-gray rounded mb-3"></div>
            <div className="flex items-center -space-x-12 py-12">
              {[1, 2, 3].map((index) => (
                <div key={index} className="w-40 h-60 rounded-lg bg-vyba-gray"></div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-6 w-48 bg-vyba-gray rounded mb-3"></div>
            <div className="flex -space-x-8 py-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="w-24 h-24 rounded-full bg-vyba-gray"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (!musicPreferences.favorite_genres.length && !musicPreferences.preferred_artist_types.length) {
      return (
        <div className="text-center py-8">
          <p className="text-vyba-tertiary">No has seleccionado preferencias musicales aún.</p>
          <Button 
            variant="terciary"
            onClick={() => navigate('/user-onboarding')}
            className="mt-4"
          >
            Completar preferencias
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {musicPreferences.favorite_genres.length > 0 && (
          <div>
            <p className="text-base text-vyba-navy mb-3">Géneros favoritos</p>
            <div className="flex items-center -space-x-12 py-12">
              {musicPreferences.favorite_genres.map((genre, index) => (
                <div key={genre} className={`w-40 h-60 rounded-lg bg-vyba-beige ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'}`}>
                  <img 
                    src={`/images/generos/${genre.toLowerCase()}.png`} 
                    alt={genre} 
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      // Si la imagen no existe, mostrar un fallback
                      (e.target as HTMLImageElement).src = '/images/generos/default.png';
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {musicPreferences.favorite_genres.map(genre => (
                <Badge key={genre} variant="secondary">{genre}</Badge>
              ))}
            </div>
          </div>
        )}

        {musicPreferences.preferred_artist_types.length > 0 && (
          <div>
            <p className="text-base text-vyba-navy mb-3">Tipos de artistas favoritos</p>
            <div className="flex -space-x-8 py-4">
              {musicPreferences.preferred_artist_types.map((artist, index) => (
                <div key={artist} className="w-24 h-24 rounded-full bg-vyba-beige border border-white border-4">
                  <img 
                    src={`/images/artistas/${artist.toLowerCase().replace(' ', '_')}.png`} 
                    alt={artist} 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Si la imagen no existe, mostrar un fallback
                      (e.target as HTMLImageElement).src = '/images/artistas/default.png';
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {musicPreferences.preferred_artist_types.map(artist => (
                <Badge key={artist} variant="secondary">{artist}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <UserDashboardLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold mb-8">Mi perfil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Columna izquierda - Solo tarjeta de perfil */}
          <div>
            <div className="bg-gray-50 rounded-3xl p-8 sticky top-5">
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
                <p className="font-medium text-vyba-navy mb-4">
                  {profileData?.city && profileData?.province 
                    ? `${profileData.city}, ${profileData.province}`
                    : 'Ubicación no especificada'}
                </p>
              </div>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden">
                {(locationCoordinates || (profileData?.coordinates)) ? (
                  <LocationMap 
                    latitude={locationCoordinates?.lat || profileData?.coordinates?.lat || 40.4167754}
                    longitude={locationCoordinates?.lng || profileData?.coordinates?.lng || -3.7037902}
                    radius={5}
                  />
                ) : (
                  <div className="w-full h-full bg-vyba-beige flex items-center justify-center">
                    <p className="text-vyba-tertiary">Cargando ubicación...</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Preferencias musicales */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Tus preferencias musicales</h3>
              {renderMusicPreferences()}
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default ProfilePage;
