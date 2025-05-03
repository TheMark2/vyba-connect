import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/layouts/OnboardingLayout';
import ArtistTypeStep from '@/components/onboarding/ArtistTypeStep';
import MusicGenresStep from '@/components/onboarding/MusicGenresStep';
import ProfilePhotoStep from '@/components/onboarding/ProfilePhotoStep';
import GalleryImagesStep from '@/components/onboarding/GalleryImagesStep';
import PhoneVerificationStep from '@/components/onboarding/PhoneVerificationStep';
import CachePriceStep from '@/components/onboarding/CachePriceStep';
import PriceStep from '@/components/onboarding/PriceStep';
import ArtistInfoStep from '@/components/onboarding/ArtistInfoStep';
import ConfirmationScreen from '@/components/onboarding/ConfirmationScreen';
import { Target, Camera, Phone, CheckCircle, ArrowRight, Save, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StepGroup {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalSteps: number;
}

interface OnboardingData {
  artistType?: string;
  artistName?: string;
  artistDescription?: string;
  musicGenres?: string[];
  profilePhoto?: File | null;
  profilePhotoUrl?: string;
  galleryImages?: File[];
  galleryImageUrls?: string[];
  phone?: string;
  isPhoneVerified?: boolean;
  price?: string;
}

// Función para convertir File a base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const WelcomeScreen = () => {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-6xl font-semibold">¡Te damos la bienvenida artista!</h1>
        <p className="text-xl text-vyba-tertiary">Responde algunas preguntas</p>
      </div>

      <div className="mt-16 grid grid-cols-4 grid-rows-3 gap-4 aspect-[16/9] max-w-6xl mx-auto">
        {/* Imagen grande a la izquierda */}
        <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/dj1.webp" 
            alt="DJ performing" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Imagen mediana arriba derecha */}
        <div className="col-span-2 row-span-1 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/dj2.webp" 
            alt="DJ setup" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Imagen mediana centro derecha */}
        <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/dj3.webp" 
            alt="Concert crowd" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Imagen mediana centro derecha */}
        <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/dj4.webp" 
            alt="Studio equipment" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Imagen grande abajo */}
        <div className="col-span-4 row-span-1 relative rounded-3xl overflow-hidden">
          <img 
            src="/images/dj5.webp" 
            alt="Festival stage" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const ArtistOnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentGroup, setCurrentGroup] = useState(-1);
  const [currentStepInGroup, setCurrentStepInGroup] = useState(0);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        toast({
          title: "Error",
          description: 'Debes iniciar sesión para acceder a esta página',
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }
      
      // Cargar datos existentes si los hay
      await loadUserData();
      setIsLoading(false);
    };
    
    checkAuth();
  }, [isAuthenticated]);

  // Cargar datos del usuario desde Supabase
  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase.auth.getUser();
      
      if (data?.user) {
        // Recuperar datos guardados en los metadatos del usuario
        const userMeta = data.user.user_metadata;
        
        setOnboardingData({
          artistType: userMeta?.artist_type,
          artistName: userMeta?.artist_name,
          artistDescription: userMeta?.artist_description,
          musicGenres: userMeta?.music_genres || [],
          profilePhotoUrl: userMeta?.avatar_url,
          galleryImageUrls: userMeta?.gallery_image_urls || [],
          phone: userMeta?.phone,
          isPhoneVerified: userMeta?.phone_verified,
          price: userMeta?.price
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      toast({
        title: "Error",
        description: 'No se pudieron cargar tus datos',
        variant: "destructive"
      });
    }
  };

  const stepGroups: StepGroup[] = [
    {
      id: -1,
      title: "",
      description: "",
      icon: <Target className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    },
    {
      id: 0,
      title: "",
      description: "",
      icon: <Target className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 3
    },
    {
      id: 1,
      title: "",
      description: "",
      icon: <Camera className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 2
    },
    {
      id: 2,
      title: "",
      description: "",
      icon: <Phone className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    },
    {
      id: 3,
      title: "",
      description: "",
      icon: <CheckCircle className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    }
  ];
  
  const updateOnboardingData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData(prevData => ({
      ...prevData,
      [key]: value
    }));
  };
  
  const handleArtistTypeSelect = (type: string) => updateOnboardingData('artistType', type);
  const handleMusicGenresSelect = (genres: string[]) => updateOnboardingData('musicGenres', genres);
  
  const handleProfilePhotoChange = async (photo: File | null) => {
    updateOnboardingData('profilePhoto', photo);
    if (photo) {
      try {
        const photoUrl = await fileToBase64(photo);
        updateOnboardingData('profilePhotoUrl', photoUrl);
      } catch (error) {
        console.error("Error converting profile photo to base64:", error);
      }
    } else {
      updateOnboardingData('profilePhotoUrl', null);
    }
  };

  const handleGalleryImagesChange = async (images: File[]) => {
    // Mantener las imágenes anteriores si no hay nuevas imágenes
    if (!images || images.length === 0) {
      return;
    }

    // Actualizar las imágenes en el estado
    updateOnboardingData('galleryImages', images);

    try {
      // Convertir las nuevas imágenes a base64
      const imageUrls = await Promise.all(
        images.map(image => fileToBase64(image))
      );

      // Actualizar las URLs en el estado
      updateOnboardingData('galleryImageUrls', imageUrls);
      console.log("Imágenes guardadas:", images.length, "URLs generadas:", imageUrls.length);
    } catch (error) {
      console.error("Error al convertir imágenes:", error);
    }
  };

  const handlePhoneChange = (phone: string) => updateOnboardingData('phone', phone);
  const handlePhoneVerification = (verified: boolean) => updateOnboardingData('isPhoneVerified', verified);
  const handlePriceChange = (price: string) => updateOnboardingData('price', price);
  const handleArtistNameChange = (name: string) => updateOnboardingData('artistName', name);
  const handleArtistDescriptionChange = (description: string) => updateOnboardingData('artistDescription', description);
  
  // Guardar datos del usuario en Supabase
  const saveUserData = async (completeOnboarding: boolean = false) => {
    if (!user) {
      toast({
        title: "Error",
        description: 'No hay usuario autenticado',
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 1. Si hay foto de perfil nueva, subirla a storage
      let avatarUrl = onboardingData.profilePhotoUrl;
      
      // Si es una URL que comienza con data:, es una nueva imagen para subir
      if (onboardingData.profilePhoto && onboardingData.profilePhotoUrl?.startsWith('data:')) {
        const fileExt = onboardingData.profilePhoto.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        // Verificar si existe el bucket 'avatars', si no, lo creamos
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.some(bucket => bucket.name === 'avatars')) {
          await supabase.storage.createBucket('avatars', {
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
        }
        
        // Subir a storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, onboardingData.profilePhoto);
          
        if (uploadError) {
          console.error('Error al subir avatar:', uploadError);
          throw uploadError;
        }
        
        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        if (urlData) {
          avatarUrl = urlData.publicUrl;
        }
      }
      
      // 2. Si hay imágenes de galería nuevas, subirlas a storage
      let galleryUrls: string[] = onboardingData.galleryImageUrls || [];
      
      if (onboardingData.galleryImages && onboardingData.galleryImages.length > 0) {
        // Verificar si existe el bucket 'gallery', si no, lo creamos
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.some(bucket => bucket.name === 'gallery')) {
          await supabase.storage.createBucket('gallery', {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
        }
        
        // Subir cada imagen
        const newUrls = await Promise.all(
          onboardingData.galleryImages.map(async (image, index) => {
            const fileExt = image.name.split('.').pop();
            const fileName = `${user.id}-gallery-${Date.now()}-${index}.${fileExt}`;
            
            // Solo subir imágenes que sean nuevas (representadas en base64)
            if (onboardingData.galleryImageUrls && 
                onboardingData.galleryImageUrls[index] && 
                onboardingData.galleryImageUrls[index].startsWith('data:')) {
              
              const { error } = await supabase.storage
                .from('gallery')
                .upload(fileName, image);
                
              if (error) {
                console.error(`Error al subir imagen ${index}:`, error);
                return null;
              }
              
              const { data } = supabase.storage
                .from('gallery')
                .getPublicUrl(fileName);
                
              return data?.publicUrl;
            }
            
            // Si no es nueva, mantener la URL que ya tiene
            return onboardingData.galleryImageUrls ? onboardingData.galleryImageUrls[index] : null;
          })
        );
        
        // Filtrar URLs nulas
        galleryUrls = newUrls.filter(url => url !== null) as string[];
      }
      
      // 3. Actualizar metadatos del usuario
      const { error } = await supabase.auth.updateUser({
        data: {
          // Datos del artista
          artist_type: onboardingData.artistType,
          artist_name: onboardingData.artistName,
          artist_description: onboardingData.artistDescription,
          music_genres: onboardingData.musicGenres,
          
          // Imágenes
          avatar_url: avatarUrl,
          gallery_image_urls: galleryUrls,
          
          // Otros datos
          phone: onboardingData.phone,
          phone_verified: onboardingData.isPhoneVerified,
          price: onboardingData.price,
          
          // Rol y estado
          role: 'artist',
          onboarding_completed: completeOnboarding
        }
      });
      
      if (error) throw error;
      
      toast({
        title: completeOnboarding ? "¡Perfil completado!" : "Datos guardados",
        description: completeOnboarding ? 
          "Tu perfil de artista ha sido configurado correctamente" : 
          "Tus datos han sido guardados y podrás continuar más tarde",
      });
      
    } catch (error) {
      console.error('Error al guardar datos del artista:', error);
      toast({
        title: "Error",
        description: 'Hubo un problema al guardar tus datos',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const currentGroupObj = stepGroups[currentGroup + 1];
    
    if (currentStepInGroup < currentGroupObj.totalSteps - 1) {
      setCurrentStepInGroup(currentStepInGroup + 1);
    } else if (currentGroup < stepGroups.length - 2) {
      // Guardar datos cada vez que se completa un grupo
      try {
        await saveUserData();
      } catch (error) {
        // Error ya manejado en saveUserData
        return;
      }
      
      setCurrentGroup(currentGroup + 1);
      setCurrentStepInGroup(0);
    } else {
      // Finalizar onboarding
      try {
        await saveUserData(true);
        navigate('/confirmation');
      } catch (error) {
        // Error ya manejado en saveUserData
      }
    }
  };
  
  const handleBack = () => {
    if (currentStepInGroup > 0) {
      setCurrentStepInGroup(currentStepInGroup - 1);
    } else if (currentGroup > -1) {
      setCurrentGroup(currentGroup - 1);
      setCurrentStepInGroup(stepGroups[currentGroup].totalSteps - 1);
    }
  };
  
  const handleCancel = () => {
    setShowExitDialog(true);
  };
  
  const handleConfirmExit = async () => {
    try {
      await saveUserData();
      navigate('/artist-benefits');
    } catch (error) {
      // Error ya manejado en saveUserData
    }
  };
  
  const canGoNext = () => {
    if (currentGroup === -1) {
      return true;
    }
    
    if (currentGroup === 0) {
      if (currentStepInGroup === 0) {
        return !!onboardingData.artistType;
      }
      return !!onboardingData.artistName && !!onboardingData.artistDescription;
    }
    
    if (currentGroup === 1) {
      return !!onboardingData.musicGenres && onboardingData.musicGenres.length > 0;
    }
    
    if (currentGroup === 2) {
      return !!onboardingData.phone;
    }
    
    if (currentGroup === 3) {
      return !!onboardingData.price;
    }
    
    return true;
  };
  
  const renderCurrentStep = () => {
    if (currentGroup === -1) {
      return <WelcomeScreen />;
    }

    if (currentGroup === stepGroups.length - 1) {
      return <ConfirmationScreen onboardingData={onboardingData} />;
    }

    switch (currentGroup) {
      case 0:
        switch (currentStepInGroup) {
          case 0:
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-semibold mb-4">¿Quién eres como artista?</h2>
                  <p className="text-lg text-vyba-tertiary">
                    Vamos a mostrar tu esencia para que los promotores y fans te conozcan al instante.
                  </p>
                </div>
                <ArtistTypeStep 
                  onSelect={handleArtistTypeSelect} 
                  initialValue={onboardingData.artistType}
                />
              </div>
            );
          case 1:
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-semibold mb-4">¿Cómo quieres que te conozcan?</h2>
                  <p className="text-lg text-vyba-tertiary">
                    Cuéntanos un poco sobre ti y tu música.
                  </p>
                </div>
                <ArtistInfoStep
                  onNameChange={handleArtistNameChange}
                  onDescriptionChange={handleArtistDescriptionChange}
                  initialName={onboardingData.artistName}
                  initialDescription={onboardingData.artistDescription}
                />
              </div>
            );
          case 2:
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-semibold mb-4">¿Qué música tocas?</h2>
                  <p className="text-lg text-vyba-tertiary">
                    Selecciona los géneros musicales que mejor definen tu estilo.
                  </p>
                </div>
                <MusicGenresStep
                  onSelect={handleMusicGenresSelect}
                  initialValues={onboardingData.musicGenres}
                />
              </div>
            );
        }
        break;

      case 1:
        switch (currentStepInGroup) {
          case 0:
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-semibold mb-4">Tu imagen también habla</h2>
                  <p className="text-lg text-vyba-tertiary">
                    Enséñales quién eres con tus fotos. Nada de subir cualquier cosa, esto es lo primero que van a ver de ti.
                  </p>
                </div>
                <ProfilePhotoStep 
                  onPhotoChange={handleProfilePhotoChange}
                  initialPhoto={onboardingData.profilePhotoUrl}
                  initialPhotoFile={onboardingData.profilePhoto}
                />
              </div>
            );
          case 1:
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-semibold mb-4">Tu galería</h2>
                  <p className="text-lg text-vyba-tertiary">
                    Añade fotos de tus actuaciones y momentos más especiales.
                  </p>
                </div>
                <GalleryImagesStep
                  onImagesChange={handleGalleryImagesChange}
                  initialImages={onboardingData.galleryImages}
                  initialPreviews={onboardingData.galleryImageUrls}
                />
              </div>
            );
        }
        break;

      case 2:
        if (currentStepInGroup === 0) {
          return (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-semibold mb-4">Protege tu cuenta con tu móvil</h2>
                <p className="text-lg text-vyba-tertiary">
                  Lo pedimos solo una vez y sirve para verificar y evitar problemas. Sin spam, sin dramas.
                </p>
              </div>
              <PhoneVerificationStep
                onPhoneChange={handlePhoneChange}
                initialValue={onboardingData.phone}
              />
            </div>
          );
        }
        break;

      case 3:
        if (currentStepInGroup === 0) {
          return (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-semibold mb-4">¡Casi listo!</h2>
                <p className="text-lg text-vyba-tertiary">
                  Establece tu caché para que los clientes sepan cuánto cobras por actuación.
                </p>
              </div>
              <PriceStep
                onPriceChange={handlePriceChange}
                initialValue={onboardingData.price}
                artistType={onboardingData.artistType}
              />
            </div>
          );
        }
        break;
    }
    
    return null;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vyba-navy mx-auto"></div>
          <p className="mt-4 text-vyba-tertiary">Cargando tus datos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-xl z-50 border-b border-vyba-gray">
        <div className="px-6 md:px-12 py-3">
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="text-vyba-tertiary hover:text-vyba-navy flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar y salir
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-6 pt-32 pb-32">
        <div className={cn(
          "mx-auto",
          currentGroup === stepGroups.length - 1 ? "max-w-7xl" : "max-w-4xl"
        )}>
          {currentGroup === -1 || currentGroup === stepGroups.length - 1 ? (
            <div className="py-8">
              {renderCurrentStep()}
            </div>
          ) : (
            <div className="space-y-12 justify-center">
              <div className="text-start space-y-2">
                <h1 className="text-5xl font-semibold">{stepGroups[currentGroup + 1].title}</h1>
                <p className="text-lg text-vyba-tertiary">{stepGroups[currentGroup + 1].description}</p>
              </div>
              <div className="py-8">
                {renderCurrentStep()}
              </div>
            </div>
          )}
        </div>
      </main>

      {currentGroup !== stepGroups.length - 1 && (
        <footer className="fixed bottom-0 left-0 w-full bg-white/50 backdrop-blur-sm">
          <div className="w-full h-1 bg-vyba-gray">
            <div 
              className="h-1 bg-vyba-navy transition-all duration-300 ease-out"
              style={{ width: `${((currentGroup + 2) / (stepGroups.length)) * 100}%` }}
            />
          </div>
          <div className="border-t">
            <div className="container mx-auto px-6 py-4">
              <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentGroup === -1 || isLoading}
                  className="text-vyba-navy hover:text-vyba-navy/80"
                >
                  Anterior
                </Button>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-vyba-gray"
                >
                  Grupo {currentGroup + 2}
                </Badge>
                <Button
                  variant="terciary"
                  onClick={handleNext}
                  disabled={!canGoNext() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block mr-2 h-4 w-4 border-2 border-t-transparent border-vyba-tertiary rounded-full"></span>
                      Guardando...
                    </>
                  ) : (
                    currentGroup === stepGroups.length - 2 ? 'Finalizar' : 'Siguiente'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </footer>
      )}

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
                  <div>
                    <p className="text-sm text-vyba-tertiary">Tipo de artista</p>
                    <p className="font-medium">{onboardingData.artistType || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-vyba-tertiary">Nombre</p>
                    <p className="font-medium">{onboardingData.artistName || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-vyba-tertiary">Descripción</p>
                    <p className="font-medium line-clamp-2">{onboardingData.artistDescription || 'No especificada'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-vyba-tertiary">Géneros musicales</p>
                    <p className="font-medium line-clamp-2">{onboardingData.musicGenres?.join(', ') || 'No especificados'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-vyba-tertiary">Teléfono</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{onboardingData.phone || 'No especificado'}</p>
                      {onboardingData.isPhoneVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 px-2 py-0.5 text-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-vyba-tertiary">Precio</p>
                    <p className="font-medium">{onboardingData.price ? `${onboardingData.price}€` : 'No especificado'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button
                variant="terciary"
                onClick={() => setShowExitDialog(false)}
              >
                Continuar editando
              </Button>
              <Button
                variant="secondary"
                onClick={handleConfirmExit}
              >
                Guardar y salir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistOnboardingPage;
