import React, { useState } from 'react';
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
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentGroup, setCurrentGroup] = useState(-1);
  const [currentStepInGroup, setCurrentStepInGroup] = useState(0);

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
  const handlePriceChange = (price: string) => updateOnboardingData('price', price);
  const handleArtistNameChange = (name: string) => updateOnboardingData('artistName', name);
  const handleArtistDescriptionChange = (description: string) => updateOnboardingData('artistDescription', description);
  
  const handleNext = () => {
    const currentGroupObj = stepGroups[currentGroup + 1];
    
    if (currentStepInGroup < currentGroupObj.totalSteps - 1) {
      setCurrentStepInGroup(currentStepInGroup + 1);
    } else if (currentGroup < stepGroups.length - 2) {
      setCurrentGroup(currentGroup + 1);
      setCurrentStepInGroup(0);
    } else {
      // Asegurarse de que tenemos las últimas URLs de las imágenes
      const dataToStore = {
        ...onboardingData,
        // Mantener las URLs pero eliminar los objetos File
        profilePhoto: undefined,
        galleryImages: undefined,
        // Asegurarse de que las URLs están presentes
        profilePhotoUrl: onboardingData.profilePhotoUrl,
        galleryImageUrls: onboardingData.galleryImageUrls
      };
      
      console.log("Guardando datos en localStorage:", dataToStore);
      localStorage.setItem('onboardingData', JSON.stringify(dataToStore));
      navigate('/confirmation');
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
      // Convertir las imágenes a base64 si existen
      let profilePhotoUrl = onboardingData.profilePhotoUrl;
      let galleryImageUrls = onboardingData.galleryImageUrls;

      // Si hay una foto de perfil nueva que no está en base64
      if (onboardingData.profilePhoto && !profilePhotoUrl) {
        profilePhotoUrl = await fileToBase64(onboardingData.profilePhoto);
      }

      // Si hay imágenes de galería nuevas que no están en base64
      if (onboardingData.galleryImages && onboardingData.galleryImages.length > 0) {
        galleryImageUrls = await Promise.all(
          onboardingData.galleryImages.map(image => fileToBase64(image))
        );
      }

      // Guardar los datos en localStorage
      const dataToStore = {
        ...onboardingData,
        profilePhoto: undefined, // No guardamos el archivo File
        galleryImages: undefined, // No guardamos los archivos File
        profilePhotoUrl,
        galleryImageUrls
      };
      
      localStorage.setItem('onboardingData', JSON.stringify(dataToStore));
      navigate('/artist-benefits');
    } catch (error) {
      console.error("Error al guardar las imágenes:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar las imágenes. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
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
                  disabled={currentGroup === -1}
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
                  disabled={!canGoNext()}
                >
                  {currentGroup === stepGroups.length - 2 ? 'Finalizar' : 'Siguiente'}
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
