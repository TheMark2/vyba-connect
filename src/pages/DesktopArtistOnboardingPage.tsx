
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';
import StepsNavbar from '@/components/onboarding/StepsNavbar';
import CoverStep from '@/components/onboarding/CoverStep';
import ArtistTypeStep from '@/components/onboarding/ArtistTypeStep';
import ArtistNameStep from '@/components/onboarding/ArtistNameStep';
import MusicGenresStep from '@/components/onboarding/MusicGenresStep';
import BioStep from '@/components/onboarding/BioStep';
import ExperienceStep from '@/components/onboarding/ExperienceStep';
import ProfilePhotoStep from '@/components/onboarding/ProfilePhotoStep';
import GalleryImagesStep from '@/components/onboarding/GalleryImagesStep';
import PhoneVerificationStep from '@/components/onboarding/PhoneVerificationStep';
import CachePriceStep from '@/components/onboarding/CachePriceStep';
import { Target, Music, Camera, Phone, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  musicGenres?: string[];
  bio?: string;
  experience?: string;
  profilePhoto?: File | null;
  galleryImages?: File[];
  phone?: string;
  minPrice?: string;
  maxPrice?: string;
}

const DesktopArtistOnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentStepInGroup, setCurrentStepInGroup] = useState(0);
  
  const stepGroups: StepGroup[] = [
    {
      id: 0,
      title: "¿Quién eres como artista?",
      description: "Vamos a mostrar tu esencia para que los promotores y fans te conozcan al instante.",
      icon: <Target className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 4
    },
    {
      id: 1,
      title: "Presentación y trayectoria",
      description: "Aquí es donde vendes tu talento. Cuéntales qué haces, por qué eres único y dónde has estado.",
      icon: <Music className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 3
    },
    {
      id: 2,
      title: "Una imagen vale mas que 1000 palabras",
      description: "Sube las imágenes que van a ser la primera impresión de los buscadores. Andate con ojo, no pongas cualquiera",
      icon: <Camera className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 3
    },
    {
      id: 3,
      title: "Escribe tu móvil",
      description: "Es imprescindible que al crear un proyecto nuevo pongas tu móvil para poder verificar y proteger tu cuenta",
      icon: <Phone className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 2
    },
    {
      id: 4,
      title: "¡Casi listo!",
      description: "Revisa toda la información antes de publicar tu perfil.",
      icon: <CheckCircle className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 2
    }
  ];
  
  // Handlers para actualizar datos
  const updateOnboardingData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData(prevData => ({
      ...prevData,
      [key]: value
    }));
  };
  
  const handleArtistTypeSelect = (type: string) => updateOnboardingData('artistType', type);
  const handleArtistNameChange = (name: string) => updateOnboardingData('artistName', name);
  const handleMusicGenresSelect = (genres: string[]) => updateOnboardingData('musicGenres', genres);
  const handleBioChange = (bio: string) => updateOnboardingData('bio', bio);
  const handleExperienceChange = (experience: string) => updateOnboardingData('experience', experience);
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
  
  // Navegación entre pasos
  const handleNext = () => {
    const currentGroupObj = stepGroups[currentGroup];
    
    if (currentStepInGroup < currentGroupObj.totalSteps - 1) {
      setCurrentStepInGroup(currentStepInGroup + 1);
    } else if (currentGroup < stepGroups.length - 1) {
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
    } else if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
      setCurrentStepInGroup(stepGroups[currentGroup - 1].totalSteps - 1);
    }
  };
  
  const handleCancel = () => {
    navigate('/artist-benefits');
  };
  
  // Validación para habilitar/deshabilitar el botón Siguiente
  const canGoNext = () => {
    if (currentGroup === 0 && currentStepInGroup === 1) {
      return !!onboardingData.artistType;
    }
    
    if (currentGroup === 0 && currentStepInGroup === 2) {
      return !!onboardingData.artistName && onboardingData.artistName.trim() !== '';
    }
    
    if (currentGroup === 0 && currentStepInGroup === 3) {
      return !!onboardingData.musicGenres && onboardingData.musicGenres.length > 0;
    }
    
    if (currentGroup === 1 && currentStepInGroup === 1) {
      return !!onboardingData.bio && onboardingData.bio.trim() !== '';
    }
    
    if (currentGroup === 1 && currentStepInGroup === 2) {
      return !!onboardingData.experience && onboardingData.experience.trim() !== '';
    }
    
    if (currentGroup === 4 && currentStepInGroup === 1) {
      return !!onboardingData.minPrice && !!onboardingData.maxPrice;
    }
    
    return true;
  };
  
  // Renderizar el paso actual
  const renderCurrentStep = () => {
    const currentGroupObj = stepGroups[currentGroup];
    
    if (currentStepInGroup === 0) {
      return (
        <CoverStep
          group={currentGroupObj.id + 1}
          title={currentGroupObj.title}
          description={currentGroupObj.description}
          icon={currentGroupObj.icon}
        />
      );
    }
    
    // Paso 1: Información básica del artista
    if (currentGroup === 0) {
      switch (currentStepInGroup) {
        case 1:
          return (
            <ArtistTypeStep 
              onSelect={handleArtistTypeSelect} 
              initialValue={onboardingData.artistType}
            />
          );
        case 2:
          return (
            <ArtistNameStep 
              onInputChange={handleArtistNameChange}
              initialValue={onboardingData.artistName}
            />
          );
        case 3:
          return (
            <MusicGenresStep
              onSelect={handleMusicGenresSelect}
              initialValues={onboardingData.musicGenres}
            />
          );
      }
    }
    
    // Paso 2: Presentación y experiencia
    if (currentGroup === 1) {
      switch (currentStepInGroup) {
        case 1:
          return (
            <BioStep 
              onInputChange={handleBioChange}
              initialValue={onboardingData.bio}
            />
          );
        case 2:
          return (
            <ExperienceStep 
              onInputChange={handleExperienceChange}
              initialValue={onboardingData.experience}
            />
          );
      }
    }
    
    // Paso 3: Imágenes
    if (currentGroup === 2) {
      switch (currentStepInGroup) {
        case 1:
          return (
            <ProfilePhotoStep 
              onPhotoChange={handleProfilePhotoChange}
            />
          );
        case 2:
          return (
            <GalleryImagesStep
              onImagesChange={handleGalleryImagesChange}
              initialImages={onboardingData.galleryImages}
            />
          );
      }
    }
    
    // Paso 4: Verificación telefónica
    if (currentGroup === 3 && currentStepInGroup === 1) {
      return (
        <PhoneVerificationStep
          onPhoneChange={handlePhoneChange}
          initialValue={onboardingData.phone}
        />
      );
    }
    
    // Paso 5: Caché y precio
    if (currentGroup === 4 && currentStepInGroup === 1) {
      return (
        <CachePriceStep
          onPriceRangeChange={handlePriceRangeChange}
          initialMinPrice={onboardingData.minPrice}
          initialMaxPrice={onboardingData.maxPrice}
        />
      );
    }
    
    // Paso por defecto (no debería llegar aquí)
    return null;
  };
  
  return (
    <PageTransition>
      <div className="h-auto bg-white dark:bg-vyba-dark-bg flex flex-col">
        <StepsNavbar
          currentGroup={currentGroup}
          totalGroups={stepGroups.length}
          currentStepInGroup={currentStepInGroup}
          totalStepsInGroup={stepGroups[currentGroup].totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          onCancel={handleCancel}
          canGoNext={canGoNext()}
        />
        
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-100px)] w-full px-8 md:px-8">
          {renderCurrentStep()}
        </main>
      </div>
    </PageTransition>
  );
};

export default DesktopArtistOnboardingPage;
