import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/layouts/OnboardingLayout';
import CoverStep from '@/components/onboarding/CoverStep';
import ArtistTypeStep from '@/components/onboarding/ArtistTypeStep';
import MusicGenresStep from '@/components/onboarding/MusicGenresStep';
import BioStep from '@/components/onboarding/BioStep';
import ExperienceStep from '@/components/onboarding/ExperienceStep';
import ProfilePhotoStep from '@/components/onboarding/ProfilePhotoStep';
import GalleryImagesStep from '@/components/onboarding/GalleryImagesStep';
import PhoneVerificationStep from '@/components/onboarding/PhoneVerificationStep';
import CachePriceStep from '@/components/onboarding/CachePriceStep';
import { Target, Music, Camera, Phone, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StepGroup {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalSteps: number;
}

interface OnboardingData {
  artistType?: string;
  musicGenres?: string[];
  profilePhoto?: File | null;
  galleryImages?: File[];
  phone?: string;
  minPrice?: string;
  maxPrice?: string;
}

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

const DesktopArtistOnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentGroup, setCurrentGroup] = useState(-1);
  const [currentStepInGroup, setCurrentStepInGroup] = useState(0);
  
  const stepGroups: StepGroup[] = [
    {
      id: -1,
      title: "Bienvenido/a a vyba",
      description: "Responde algunas preguntas para poder promocionarte",
      icon: <Target className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    },
    {
      id: 0,
      title: "¿Quién eres como artista?",
      description: "Vamos a mostrar tu esencia para que los promotores y fans te conozcan al instante.",
      icon: <Target className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 2
    },
    {
      id: 1,
      title: "Tu imagen también habla",
      description: "Enséñales quién eres con tus fotos. Nada de subir cualquier cosa, esto es lo primero que van a ver de ti.",
      icon: <Camera className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 2
    },
    {
      id: 2,
      title: "Protege tu cuenta con tu móvil",
      description: "Lo pedimos solo una vez y sirve para verificar y evitar problemas. Sin spam, sin dramas.",
      icon: <Phone className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    },
    {
      id: 3,
      title: "¡Casi listo!",
      description: "Revisa toda la información antes de publicar tu perfil.",
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
  const handleProfilePhotoChange = (photo: File | null) => updateOnboardingData('profilePhoto', photo);
  const handleGalleryImagesChange = (images: File[]) => updateOnboardingData('galleryImages', images);
  const handlePhoneChange = (phone: string) => updateOnboardingData('phone', phone);
  const handlePriceRangeChange = (minPrice: string, maxPrice: string) => {
    setOnboardingData(prevData => ({
      ...prevData,
      minPrice,
      maxPrice
    }));
  };
  
  const handleNext = () => {
    const currentGroupObj = stepGroups[currentGroup + 1];
    
    if (currentStepInGroup < currentGroupObj.totalSteps - 1) {
      setCurrentStepInGroup(currentStepInGroup + 1);
    } else if (currentGroup < stepGroups.length - 2) {
      setCurrentGroup(currentGroup + 1);
      setCurrentStepInGroup(0);
    } else {
      toast({
        title: "¡Perfil creado con éxito!",
        description: "Tu perfil de artista ha sido creado correctamente.",
      });
      navigate('/');
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
    navigate('/artist-benefits');
  };
  
  const canGoNext = () => {
    if (currentGroup === -1) {
      return true;
    }
    
    if (currentGroup === 0) {
      if (currentStepInGroup === 0) {
        return !!onboardingData.artistType;
      }
      return !!onboardingData.musicGenres && onboardingData.musicGenres.length > 0;
    }
    
    if (currentGroup === 3) {
      return !!onboardingData.minPrice && !!onboardingData.maxPrice;
    }
    
    return true;
  };
  
  const renderCurrentStep = () => {
    if (currentGroup === -1) {
      return <WelcomeScreen />;
    }

    switch (currentGroup) {
      case 0:
        switch (currentStepInGroup) {
          case 0:
            return (
              <ArtistTypeStep 
                onSelect={handleArtistTypeSelect} 
                initialValue={onboardingData.artistType}
              />
            );
          case 1:
            return (
              <MusicGenresStep
                onSelect={handleMusicGenresSelect}
                initialValues={onboardingData.musicGenres}
              />
            );
        }
        break;

      case 1:
        switch (currentStepInGroup) {
          case 0:
            return (
              <ProfilePhotoStep 
                onPhotoChange={handleProfilePhotoChange}
              />
            );
          case 1:
            return (
              <GalleryImagesStep
                onImagesChange={handleGalleryImagesChange}
                initialImages={onboardingData.galleryImages}
              />
            );
        }
        break;

      case 2:
        if (currentStepInGroup === 0) {
          return (
            <PhoneVerificationStep
              onPhoneChange={handlePhoneChange}
              initialValue={onboardingData.phone}
            />
          );
        }
        break;

      case 3:
        if (currentStepInGroup === 0) {
          return (
            <CachePriceStep
              onPriceRangeChange={handlePriceRangeChange}
              initialMinPrice={onboardingData.minPrice}
              initialMaxPrice={onboardingData.maxPrice}
            />
          );
        }
        break;
    }
    
    return null;
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 w-full bg-white/50 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-6 py-4 flex justify-end">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="text-vyba-navy hover:text-vyba-navy/80"
          >
            Guardar y salir
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 pt-32 pb-32">
        <div className="max-w-4xl mx-auto">
          {currentGroup === -1 ? (
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
    </div>
  );
};

export default DesktopArtistOnboardingPage;
