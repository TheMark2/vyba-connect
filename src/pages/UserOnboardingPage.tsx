import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Home, 
  Music, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon,
  Save,
  CheckCircle,
  Target,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription, 
  DialogFooter,
} from "@/components/ui/dialog";
import ProfilePhotoStep from '@/components/onboarding/ProfilePhotoStep';
import LocationMapSelector from '@/components/onboarding/LocationMapSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import OnboardingCompletionHandler from '@/components/onboarding/OnboardingCompletionHandler';
import { useAuth } from '@/contexts/AuthContext';
import { ImageContainer } from '@/components/onboarding/OnboardingImagesHelper';
import SelectedImagesStack from '@/components/onboarding/SelectedImagesStack';

// Tipos de datos
interface OnboardingData {
  profilePhoto?: File | null;
  profilePhotoUrl?: string;
  location?: string;
  city?: string;
  province?: string;
  favoriteGenres?: string[];
  preferredArtistTypes?: string[];
  coordinates?: { lat: number, lng: number };
}

interface StepGroup {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalSteps: number;
}

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
  onboarding_status: 'pending' | 'completed' | 'skipped';
}

// Convertir archivo a base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const WelcomeScreen = () => {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-6xl font-semibold">¡Te damos la bienvenida!</h1>
        <p className="text-xl text-vyba-tertiary">Configura tu perfil para encontrar la mejor música</p>
      </div>

      <div className="mt-16 grid grid-cols-4 grid-rows-3 gap-4 aspect-[16/9] max-w-6xl mx-auto">
        {/* Imagen grande a la izquierda */}
        <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/user-image/user1.webp" 
            alt="Evento musical" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Imagen mediana arriba derecha */}
        <div className="col-span-2 row-span-1 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/user-image/user2.webp" 
            alt="Amigos en concierto" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Imagen mediana centro derecha */}
        <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/user-image/user3.webp" 
            alt="Fiesta" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Imagen mediana centro derecha */}
        <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/user-image/user4.webp" 
            alt="DJ en acción" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Imagen grande abajo */}
        <div className="col-span-4 row-span-1 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/user-image/user5.webp" 
            alt="Festival" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

// Componente principal
const UserOnboardingPage = () => {
  const navigate = useNavigate();
  const { reloadUserData } = useAuth();
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentStepInGroup, setCurrentStepInGroup] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profilePhoto: null,
    profilePhotoUrl: '',
    location: '',
    city: '',
    province: '',
    favoriteGenres: [],
    preferredArtistTypes: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepGroups: StepGroup[] = [
    {
      id: 0,
      title: "",
      description: "",
      icon: <Camera className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    },
    {
      id: 1,
      title: "",
      description: "",
      icon: <Home className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    },
    {
      id: 2,
      title: "",
      description: "",
      icon: <Music className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    }
  ];

  // Actualizar datos del formulario
  const updateOnboardingData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  // Manejadores para cada paso
  const handleProfilePhotoChange = async (photo: File | null, photoUrl?: string | null) => {
    console.log("UserOnboardingPage: Recibida foto de perfil:", photo?.name);
    console.log("UserOnboardingPage: Recibida previsualización:", photoUrl ? "URL disponible" : "Sin URL");
    
    // Actualizar el archivo de foto
    updateOnboardingData('profilePhoto', photo);
    
    // Si recibimos una URL de previsualización, usarla directamente
    if (photoUrl) {
      console.log("UserOnboardingPage: Actualizando profilePhotoUrl con la previsualización recibida");
      updateOnboardingData('profilePhotoUrl', photoUrl);
      return;
    }
    
    // Si no hay foto y tampoco una URL predefinida, limpiar la URL
    if (!photo && !onboardingData.profilePhotoUrl?.startsWith('/')) {
      console.log("UserOnboardingPage: Limpiando profilePhotoUrl");
      updateOnboardingData('profilePhotoUrl', null);
    }
  };

  const handleLocationSelect = (locationData: {
    lat: number;
    lng: number;
    city: string;
    province: string;
    formattedAddress: string;
    confirmed: boolean;
  }) => {
    updateOnboardingData('city', locationData.city);
    updateOnboardingData('province', locationData.province);
    updateOnboardingData('location', locationData.formattedAddress);
    updateOnboardingData('coordinates', {
      lat: locationData.lat,
      lng: locationData.lng
    });
    
    // Actualizar estado de confirmación basado en la propiedad confirmed de locationData
    setIsLocationConfirmed(locationData.confirmed);
    
    console.log("Ubicación seleccionada:", locationData);
  };

  const handleGenreToggle = (genre: string) => {
    setOnboardingData(prev => {
      const currentGenres = prev.favoriteGenres || [];
      if (currentGenres.includes(genre)) {
        return { ...prev, favoriteGenres: currentGenres.filter(g => g !== genre) };
      } else {
        return { ...prev, favoriteGenres: [...currentGenres, genre] };
      }
    });
  };

  const handleArtistTypeToggle = (type: string) => {
    setOnboardingData(prev => {
      const currentTypes = prev.preferredArtistTypes || [];
      if (currentTypes.includes(type)) {
        return { ...prev, preferredArtistTypes: currentTypes.filter(t => t !== type) };
      } else {
        return { ...prev, preferredArtistTypes: [...currentTypes, type] };
      }
    });
  };

  // Navegación entre pasos
  const handleNext = () => {
    const currentGroupObj = stepGroups[currentGroup];
    
    if (currentStepInGroup < currentGroupObj.totalSteps - 1) {
      setCurrentStepInGroup(currentStepInGroup + 1);
    } else if (currentGroup < stepGroups.length - 1) {
      setCurrentGroup(currentGroup + 1);
      setCurrentStepInGroup(0);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStepInGroup > 0) {
      setCurrentStepInGroup(currentStepInGroup - 1);
    } else if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
      setCurrentStepInGroup(stepGroups[currentGroup - 1].totalSteps - 1);
    }
  };

  const handleCancel = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = async () => {
    try {
      setIsLoading(true);
      // Guardar los datos actuales en localStorage para poder retomarlos
      if (onboardingData.profilePhotoUrl) {
        localStorage.setItem('userOnboardingData', JSON.stringify({
          ...onboardingData,
          profilePhoto: null // No guardar el File object
        }));
      }
      
      // Actualizar el estado del usuario para marcar que ha completado el onboarding
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      
      // Actualizar metadatos para marcar el onboarding como completado
      await supabase.auth.updateUser({
        data: {
          onboarding_status: 'completed'
        }
      });
      
      // Establecer bandera para mostrar el diálogo de bienvenida
      localStorage.setItem('is_from_registration', 'true');
      
      toast.success('¡Bienvenido a Vyba!');
      setShowExitDialog(false);
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error al guardar datos temporales:', error);
      toast.error('Error al guardar los datos');
      setShowExitDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      setIsLoading(true);
      // Actualizar el estado del usuario para marcar que ha completado el onboarding
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      
      // Actualizar el perfil en la tabla profiles
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_status: 'skipped'
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Establecer bandera para mostrar el diálogo de bienvenida
      localStorage.setItem('is_from_registration', 'true');
      
      toast.success('¡Bienvenido a Vyba!');
      setShowExitDialog(false);
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error al omitir onboarding:', error);
      toast.error('Error al procesar tu solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar la finalización del onboarding
  const handleFinish = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // 1. Verificar usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      let avatarUrl = onboardingData.profilePhotoUrl;

      // Si hay una nueva foto de perfil, subirla a Supabase Storage
      if (onboardingData.profilePhoto) {
        const file = onboardingData.profilePhoto;
        const fileExt = file.name.split('.').pop();
        // Crear el nombre del archivo con el formato correcto para las políticas de seguridad
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        console.log('Subiendo imagen al bucket useravatar:', fileName);
        
        // Subir la imagen al bucket 'useravatar'
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('useravatar')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Error al subir la imagen:', uploadError);
          throw new Error('Error al subir la imagen de perfil');
        }

        console.log('Imagen subida correctamente:', uploadData);
        
        // Construir URL directamente - Más confiable que getPublicUrl
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zkucuolpubthcnsgjtso.supabase.co";
        avatarUrl = `${supabaseUrl}/storage/v1/object/public/useravatar/${fileName}`;
        
        console.log('URL pública de la imagen:', avatarUrl);
      }
      
      // Si seleccionamos un avatar predefinido (que comienza con /)
      if (onboardingData.profilePhotoUrl && onboardingData.profilePhotoUrl.startsWith('/')) {
        avatarUrl = onboardingData.profilePhotoUrl;
        console.log('Usando avatar predefinido:', avatarUrl);
      }
      
      // 2. Obtener el perfil actual
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, onboarding_status')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error al obtener el perfil:', profileError);
        throw new Error('Error al obtener el perfil');
      }

      // 2. Preparar objeto con los datos a guardar
      const profileData = {
        id: user.id,
        email: user.email,
        // Avatar
        avatar_url: avatarUrl || null,
        // Ubicación
        location: onboardingData.location || '',
        city: onboardingData.city || '',
        province: onboardingData.province || '',
        // Preferencias musicales
        favorite_genres: onboardingData.favoriteGenres || [],
        preferred_artist_types: onboardingData.preferredArtistTypes || [],
        // Importante: marcar el onboarding como completado
        onboarding_status: 'completed' as const
      };
      
      console.log('Datos a guardar en profiles:', profileData);
      
      // Actualizar el perfil
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error('Error al guardar el perfil:', upsertError);
        throw new Error('Error al guardar el perfil');
      }

      // Actualizar los metadatos del usuario
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          avatar_url: avatarUrl,
          onboarding_completed: true
        }
      });

      if (updateUserError) {
        console.error('Error al actualizar metadatos del usuario:', updateUserError);
        throw new Error('Error al actualizar metadatos del usuario');
      }

      // 3. Limpiar el estado de onboarding
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('onboardingStep');
      localStorage.removeItem('onboardingSkipped');

      // 4. Recargar datos del usuario
      await reloadUserData();

      // 5. Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error al finalizar onboarding:', error);
      toast.error('Error al guardar tu perfil');
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar si se puede avanzar
  const canGoNext = () => {
    if (currentGroup === 0) {
      // La foto de perfil no es obligatoria
      return true;
    } else if (currentGroup === 1) {
      // Ciudad y provincia son obligatorios, y la ubicación debe estar confirmada
      return !!(onboardingData.city && onboardingData.province && isLocationConfirmed);
    } else if (currentGroup === 2) {
      // Al menos un género de música es obligatorio
      return onboardingData.favoriteGenres && onboardingData.favoriteGenres.length > 0;
    }
    
    return true;
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentGroup) {
      case 0:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-semibold mb-4">Foto de perfil</h2>
              <p className="text-lg text-vyba-tertiary">
                Sube una foto de perfil o escoge algún avatar predefinido
              </p>
            </div>
            <ProfilePhotoStep 
              onPhotoChange={handleProfilePhotoChange}
              initialPhoto={onboardingData.profilePhotoUrl}
              initialPhotoFile={onboardingData.profilePhoto}
            />
            <div className="grid grid-cols-6 md:grid-cols-10 gap-4 mt-12">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].map((num, index) => (
                <div 
                  key={num}
                  className={`
                    cursor-pointer relative transition-all duration-300 
                    rounded-full overflow-hidden aspect-square
                    opacity-0 scale-90 animate-[scale-in_0.4s_ease-out_forwards]
                  `}
                  style={{
                    animationDelay: `${index * 50}ms` // 50ms de retraso entre cada avatar
                  }}
                  onClick={() => {
                    // Usar avatares predefinidos
                    updateOnboardingData('profilePhotoUrl', `/images/user-image/avatar${num}.webp`);
                    updateOnboardingData('profilePhoto', null);
                  }}
                >
                  <img 
                    src={`/images/user-image/avatar${num}.webp`} 
                    alt={`Avatar ${num}`}
                    className="w-full h-full object-cover" 
                  />
                  {onboardingData.profilePhotoUrl === `/images/user-image/avatar${num}.webp` && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center animate-[fade-in_0.2s_ease-out]">
                      <Check className="text-white animate-[scale-in_0.3s_ease-out]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-semibold mb-4">¿De dónde eres?</h2>
              <p className="text-lg text-vyba-tertiary">
                Información esencial para que los artistas vean tu localidad
              </p>
            </div>
            <div className="space-y-6">
              <LocationMapSelector 
                onLocationSelect={handleLocationSelect}
                initialCity={onboardingData.city}
                initialProvince={onboardingData.province}
                onValidityChange={setIsLocationConfirmed}
              />
            </div>
          </div>
        );
        
      case 2:
        const musicGenres = [
          "Pop", "Rock", "Electrónica", "Hip Hop", "Reggaetón", 
          "Jazz", "Techno", "R&B", "Clásica", "House", 
          "Latino", "Indie", "Metal", "Folk", "Funk"
        ];
        
        const artistTypes = [
          "DJ", "Cantante", "Banda", "Pianista", "Saxofonista", 
          "Guitarrista", "Violinista", "Trompetista", "Baterista"
        ];
        
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-semibold mb-4">¿Cuáles son tus gustos?</h2>
              <p className="text-lg text-vyba-tertiary">
                Indica tus gustos para que podamos darte solo lo que te gusta
              </p>
            </div>
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h3 className="text-lg font-medium mb-0">Géneros musicales favoritos</h3>
                  <SelectedImagesStack 
                    items={onboardingData.favoriteGenres || []} 
                    category="genres"
                    className="ml-0 sm:ml-4 mt-2 sm:mt-0"
                    maxVisible={4}
                  />
                </div>
                <p className="text-sm text-vyba-tertiary mt-0">Selecciona todos los que te gusten</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {musicGenres.map((genre) => {
                    const isSelected = (onboardingData.favoriteGenres || []).includes(genre);
                    return (
                      <div 
                        key={genre} 
                        className={cn(
                          "flex flex-col items-center cursor-pointer transition-all duration-300 group",
                          isSelected ? "scale-[1.02]" : ""
                        )}
                      >
                        <ImageContainer 
                          category="genres"
                          name={genre}
                          isSelected={isSelected}
                          onClick={() => handleGenreToggle(genre)}
                        >
                          <div 
                            className={cn(
                              "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300",
                              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                            )}
                          >
                            {isSelected && (
                              <Check className="text-white h-8 w-8 transition-transform duration-300" />
                            )}
                          </div>
                        </ImageContainer>
                        <span className={cn(
                          "text-sm font-medium text-center transition-colors duration-300",
                          isSelected ? "text-vyba-navy" : "text-vyba-tertiary group-hover:text-vyba-navy"
                        )}>
                          {genre}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium">Tipos de artistas que te interesan</h3>
                  <SelectedImagesStack 
                    items={onboardingData.preferredArtistTypes || []} 
                    category="artists"
                    className="ml-0 sm:ml-4 mt-2 sm:mt-0"
                    maxVisible={4}
                  />
                </div>
                <p className="text-sm text-vyba-tertiary">Selecciona todos los que te gusten</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {artistTypes.map((type) => {
                    const isSelected = (onboardingData.preferredArtistTypes || []).includes(type);
                    return (
                      <div 
                        key={type} 
                        className={cn(
                          "flex flex-col items-center cursor-pointer transition-all duration-300 group",
                          isSelected ? "scale-[1.02]" : ""
                        )}
                      >
                        <ImageContainer 
                          category="artists"
                          name={type}
                          isSelected={isSelected}
                          onClick={() => handleArtistTypeToggle(type)}
                        >
                          <div 
                            className={cn(
                              "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300",
                              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                            )}
                          >
                            {isSelected && (
                              <Check className="text-white h-8 w-8 transition-transform duration-300" />
                            )}
                          </div>
                        </ImageContainer>
                        <span className={cn(
                          "text-sm font-medium text-center transition-colors duration-300",
                          isSelected ? "text-vyba-navy" : "text-vyba-tertiary group-hover:text-vyba-navy"
                        )}>
                          {type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-xl z-50 border-b border-vyba-gray">
          <div className="px-6 md:px-12 py-3">
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={handleSkipOnboarding}
                className="text-vyba-tertiary hover:text-vyba-navy flex items-center gap-2"
              >
                Saltar y entrar
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-32">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-12 justify-center">
              <div className="text-start space-y-2">
                <h1 className="text-5xl font-semibold">{stepGroups[currentGroup].title}</h1>
                <p className="text-lg text-vyba-tertiary">{stepGroups[currentGroup].description}</p>
              </div>
              <div className="md:py-8">
                {renderCurrentStep()}
              </div>
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 w-full bg-white/50 backdrop-blur-sm">
          <div className="w-full h-1 bg-vyba-gray">
            <div 
              className="h-1 bg-vyba-navy transition-all duration-300 ease-out"
              style={{ width: `${((currentGroup + 1) / (stepGroups.length)) * 100}%` }}
            />
          </div>
          <div className="border-t">
            <div className="container mx-auto px-6 py-4">
              <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentGroup === 0 && currentStepInGroup === 0}
                  className="text-vyba-navy hover:text-vyba-navy/80"
                >
                  Anterior
                </Button>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-vyba-gray"
                >
                  Paso {currentGroup + 1} de {stepGroups.length}
                </Badge>
                <Button
                  variant="terciary"
                  onClick={handleNext}
                  disabled={!canGoNext()}
                >
                  {currentGroup === stepGroups.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Button>
              </div>
            </div>
          </div>
        </footer>

        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader className="text-center px-12">
              <DialogTitle>¿Estás seguro de que quieres salir?</DialogTitle>
              <DialogDescription>
                Tu progreso se guardará y podrás continuar más tarde.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4 px-12">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Información guardada:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {onboardingData.profilePhotoUrl && (
                      <div>
                        <p className="text-sm text-vyba-tertiary">Foto de perfil</p>
                        <p className="font-medium">✓ Configurada</p>
                      </div>
                    )}
                    {onboardingData.city && onboardingData.province && (
                      <div>
                        <p className="text-sm text-vyba-tertiary">Ubicación</p>
                        <p className="font-medium">{onboardingData.city}, {onboardingData.province}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {onboardingData.favoriteGenres && onboardingData.favoriteGenres.length > 0 && (
                      <div>
                        <p className="text-sm text-vyba-tertiary">Géneros musicales</p>
                        <p className="font-medium line-clamp-2">
                          {onboardingData.favoriteGenres.slice(0, 3).join(', ')}
                          {onboardingData.favoriteGenres.length > 3 && '...'}
                        </p>
                      </div>
                    )}
                    {onboardingData.preferredArtistTypes && onboardingData.preferredArtistTypes.length > 0 && (
                      <div>
                        <p className="text-sm text-vyba-tertiary">Tipos de artistas</p>
                        <p className="font-medium line-clamp-2">
                          {onboardingData.preferredArtistTypes.slice(0, 3).join(', ')}
                          {onboardingData.preferredArtistTypes.length > 3 && '...'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
                <Button 
                  variant="outline" 
                  onClick={() => setShowExitDialog(false)}
                >
                  Continuar editando
                </Button>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" onClick={handleSkipOnboarding} disabled={isLoading}>
                    Omitir y entrar
                  </Button>
                  <Button onClick={handleConfirmExit} disabled={isLoading}>
                    Guardar y salir
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <OnboardingCompletionHandler />
    </>
  );
};

export default UserOnboardingPage;
