import React, { useState, useEffect, useRef } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Phone, ShieldX, Cog, FolderCog, NavigationOff, AlertCircle, Camera, Check, Telescope, ChevronLeft, Plus, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LocationMap from '@/components/LocationMap';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProfilePhotoStep from '@/components/onboarding/ProfilePhotoStep';
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

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
  favorite_genres: string[];
  preferred_artist_types: string[];
  onboarding_status: string | null;
}

interface MusicPreferences {
  favorite_genres: string[];
  preferred_artist_types: string[];
}

const ProfilePage = () => {
  const { user, userName, avatarUrl, reloadUserData } = useAuth();
  const [joinDate, setJoinDate] = useState<string>('');
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [musicPreferences, setMusicPreferences] = useState<MusicPreferences>({
    favorite_genres: [],
    preferred_artist_types: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [locationCoordinates, setLocationCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user?.created_at) {
      const date = new Date(user.created_at);
      const month = date.toLocaleString('es-ES', { month: 'long' });
      const year = date.getFullYear();
      setJoinDate(`${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`);
    }
  }, [user]);

  // Sincronizar avatarUrl del contexto cuando cambie
  useEffect(() => {
    if (avatarUrl) {
      console.log('ProfilePage: Actualizando avatarUrl desde el contexto de autenticación:', avatarUrl);
      
      // Pequeño hack para asegurar que la imagen se actualiza en el DOM
      // incluso si la URL sigue siendo la misma (pero el contenido cambió)
      setTimeout(() => {
        const avatarImg = document.querySelector('.profile-avatar img') as HTMLImageElement;
        if (avatarImg) {
          // Forzar recarga añadiendo un parámetro de caché
          const cacheBuster = `?t=${Date.now()}`;
          const baseUrl = avatarUrl.split('?')[0]; // Eliminar cualquier parámetro existente
          avatarImg.src = `${baseUrl}${cacheBuster}`;
          console.log('ProfilePage: Imagen de avatar forzada a actualizar con:', avatarImg.src);
        }
      }, 100);
    }
  }, [avatarUrl]);

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
        <div className="flex flex-col text-center bg-vyba-gray rounded-2xl p-8 items-center justify-center space-y-4">
          <FolderCog className="h-8 w-8 text-vyba-navy" />
          <p className="text-vyba-navy font-medium">No has seleccionado preferencias musicales aún.</p>
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
                <div key={genre} className={`w-40 h-60 rounded-lg bg-vyba-beige border border-white border-4 ${index % 2 === 0 ? 'rotate-12' : '-rotate-12'}`}>
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

  // Función para manejar selección de archivos
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No se seleccionó ningún archivo");
      return;
    }
    
    console.log("Archivo seleccionado:", file.name, file.type, file.size);
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no válido", {
        description: "Por favor, selecciona una imagen (JPG, PNG, GIF o WEBP)"
      });
      return;
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Archivo demasiado grande", {
        description: "La imagen no debe exceder los 5MB"
      });
      return;
    }
    
    setIsPhotoUploading(true);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      console.log("Vista previa generada correctamente");
      setPhotoPreview(preview);
      setNewPhoto(file);
      setNewPhotoUrl(preview);
      setIsPhotoUploading(false);
    };
    
    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
      toast.error("Error al leer el archivo", {
        description: "No se pudo procesar la imagen seleccionada"
      });
      setIsPhotoUploading(false);
    };
    
    reader.readAsDataURL(file);
    
    // Reiniciar input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  };

  // Función específica para subir la imagen
  const uploadImageToSupabase = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      // Intentar verificar/crear el bucket
      try {
        const { data: bucketExists } = await supabase.storage.getBucket('useravatar');
        if (!bucketExists) {
          await supabase.storage.createBucket('useravatar', { public: true });
        }
      } catch (err) {
        console.error("Error al verificar bucket:", err);
        // Continuar de todos modos
      }
      
      // Subir la imagen
      const { data, error } = await supabase.storage
        .from('useravatar')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Construir URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zkucuolpubthcnsgjtso.supabase.co";
      return `${supabaseUrl}/storage/v1/object/public/useravatar/${fileName}`;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      return null;
    }
  };

  // Función para guardar cambios de avatar
  const handleSaveAvatar = async () => {
    if (!user) {
      toast.error("No hay sesión activa");
      return;
    }
    
    setShowPhotoDialog(false);
    const loadingToast = toast.loading("Actualizando foto de perfil...");
    
    try {
      let finalAvatarUrl = newPhotoUrl;
      
      // Si hay un archivo de imagen, subirlo a Supabase
      if (newPhoto) {
        console.log("Subiendo nueva foto al servidor...", newPhoto.name);
        const uploadedUrl = await uploadImageToSupabase(newPhoto, user.id);
        if (!uploadedUrl) {
          toast.dismiss(loadingToast);
          toast.error("Error al subir la imagen");
          return;
        }
        finalAvatarUrl = uploadedUrl;
        console.log("Imagen subida correctamente:", finalAvatarUrl);
      }
      
      if (!finalAvatarUrl) {
        toast.dismiss(loadingToast);
        toast.error("No hay imagen para actualizar");
        return;
      }
      
      console.log("Actualizando perfil con nueva URL:", finalAvatarUrl);
      
      // Actualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: finalAvatarUrl })
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Error al actualizar perfil:", profileError);
        throw profileError;
      }
      
      // Actualizar metadatos de usuario
      const { error: userError } = await supabase.auth.updateUser({
        data: { avatar_url: finalAvatarUrl }
      });
      
      if (userError) {
        console.error("Error al actualizar metadatos:", userError);
      }
      
      // Recargar datos
      await reloadUserData();
      
      // Limpiar estados
      setNewPhoto(null);
      setNewPhotoUrl(null);
      setPhotoPreview(null);
      
      toast.dismiss(loadingToast);
      toast.success("Foto de perfil actualizada");
      
    } catch (error) {
      console.error("Error al guardar avatar:", error);
      toast.dismiss(loadingToast);
      toast.error("Error al actualizar la foto de perfil");
    }
  };

  return (
    <UserDashboardLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold mb-8">Mi perfil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Columna izquierda - Solo tarjeta de perfil */}
          <div>
            <div className="bg-vyba-gray rounded-3xl p-8 sticky top-5">
              <div className="flex items-start gap-6">
                <div 
                  className="w-36 h-36 rounded-full overflow-hidden bg-vyba-beige cursor-pointer relative group profile-avatar"
                  onClick={() => setShowPhotoDialog(true)}
                >
                  {avatarUrl ? (
                    <>
                      <img 
                        src={avatarUrl} 
                        alt={userName || 'Usuario'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error al cargar la imagen:', avatarUrl);
                          // Si falla la carga, mostrar inicial
                          (e.target as HTMLImageElement).style.display = 'none';
                          // Mostrar fallback con inicial
                          const fallback = e.currentTarget.parentElement?.querySelector('.fallback-avatar');
                          if (fallback) {
                            fallback.classList.remove('hidden');
                          }
                        }}
                      />
                      <div className="fallback-avatar hidden w-full h-full flex items-center justify-center text-2xl font-semibold">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
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
            {/* Alerta de perfil incompleto */}
            {(profileData?.onboarding_status === 'pending' || profileData?.onboarding_status === 'skipped') && (
              <Alert className="bg-vyba-gray border-none rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center shrink-0 w-12 h-12 bg-[#C13515] rounded-full">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex justify-between w-full gap-2 items-center">
                    <AlertTitle className="text-xl font-medium text-vyba-navy">Perfil incompleto</AlertTitle>
                    <Button variant="terciary" onClick={() => navigate('/user-onboarding')}>Completar perfil</Button>
                  </div>
                </div>
              </Alert>
            )}

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
                    : ''}
                </p>
              </div>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-vyba-gray/10">
                {profileData?.city && profileData?.province ? (
                  <LocationMap 
                    latitude={locationCoordinates?.lat || 40.4167754}
                    longitude={locationCoordinates?.lng || -3.7037902}
                    radius={5}
                    location={`${profileData.city}, ${profileData.province}`}
                  />
                ) : (
                  <div className="w-full h-full bg-vyba-gray flex flex-col items-center justify-center space-y-6 p-8">
                    <NavigationOff className="h-8 w-8 text-vyba-navy" />
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-vyba-navy font-medium text-lg">No se ha especificado la ubicación</p>
                      <p className="text-vyba-navy text-sm text-center">La ubicación no es pública, solo se comparte con los artistas contactados, además no pedimos una ubicación exacta sino solo una ciudad</p>
                    </div>
                    <Button variant="terciary" onClick={() => navigate('/user-onboarding')}>Actualizar preferencias</Button>
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

      {/* Diálogo de cambio de foto de perfil */}
      <ResponsiveDialog
        open={showPhotoDialog}
        onOpenChange={(open) => {
          if (!open) {
            setNewPhoto(null);
            setNewPhotoUrl(null);
            setPhotoPreview(null);
          }
          setShowPhotoDialog(open);
        }}
        title="Cambiar foto de perfil"
        centerTitle={true}
      >
        <input
          type="file"
          id="photo-upload"
          ref={photoInputRef}
          accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {/* Selector de foto de perfil */}
        <div className="flex flex-col items-center">
          <div 
            className={`
              w-40 h-40 rounded-full 
              border-2 ${isPhotoUploading ? 'border-gray-300' : 'border-dashed border-gray-300 hover:border-vyba-navy'} 
              flex items-center justify-center
              ${photoPreview || newPhotoUrl || avatarUrl ? 'bg-transparent' : 'bg-[#F7F7F7]'}
              overflow-hidden cursor-pointer relative group
              transition-all
            `}
            onClick={() => photoInputRef.current?.click()}
          >
            {isPhotoUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <span className="text-sm">Procesando...</span>
              </div>
            ) : photoPreview || newPhotoUrl ? (
              <Avatar className="w-full h-full">
                <AvatarImage 
                  src={photoPreview || newPhotoUrl || ''} 
                  alt="Vista previa" 
                  className="object-cover"
                  onError={(e) => {
                    console.error('Error al cargar la imagen previa');
                    // Cambiar el fallback a visible
                    const fallback = e.currentTarget.parentElement?.querySelector('[data-radix-avatar-fallback]');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }} 
                />
                <AvatarFallback className="text-4xl bg-black text-white">
                  <Plus className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
            ) : avatarUrl ? (
              <Avatar className="w-full h-full">
                <AvatarImage 
                  src={`${avatarUrl}?t=${Date.now()}`} 
                  alt="Foto actual" 
                  className="object-cover"
                  onError={(e) => {
                    console.error('Error al cargar la imagen actual');
                    // Cambiar el fallback a visible
                    const fallback = e.currentTarget.parentElement?.querySelector('[data-radix-avatar-fallback]');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }} 
                />
                <AvatarFallback className="text-4xl bg-black text-white">
                  <Plus className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-gray-400 group-hover:text-gray-600 transition-all duration-300" />
                <span className="text-sm text-gray-500">Arrastra o haz clic</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Cambiar foto</span>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            Formatos aceptados: JPG, PNG, GIF, WEBP (máx. 5MB)
          </div>
        </div>
        
        <div className="mt-8">
          <Button 
            variant="terciary" 
            onClick={handleSaveAvatar} 
            className="w-full"
            disabled={(!newPhoto && !newPhotoUrl) || isPhotoUploading}
          >
            Guardar cambios
          </Button>
        </div>
      </ResponsiveDialog>
    </UserDashboardLayout>
  );
};

export default ProfilePage;
