
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
import { useIsMobile } from '@/hooks/use-mobile';

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

const ArtistOnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  
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
  
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentStepInGroup, setCurrentStepInGroup] = useState(0);
  
  const handleArtistTypeSelect = (type: string) => {
    setOnboardingData({
      ...onboardingData,
      artistType: type
    });
  };
  
  const handleArtistNameChange = (name: string) => {
    setOnboardingData({
      ...onboardingData,
      artistName: name
    });
  };
  
  const handleMusicGenresSelect = (genres: string[]) => {
    setOnboardingData({
      ...onboardingData,
      musicGenres: genres
    });
  };
  
  const handleBioChange = (bio: string) => {
    setOnboardingData({
      ...onboardingData,
      bio: bio
    });
  };
  
  const handleExperienceChange = (experience: string) => {
    setOnboardingData({
      ...onboardingData,
      experience: experience
    });
  };
  
  const handleProfilePhotoChange = (photo: File | null) => {
    setOnboardingData({
      ...onboardingData,
      profilePhoto: photo
    });
  };
  
  const handleGalleryImagesChange = (images: File[]) => {
    setOnboardingData({
      ...onboardingData,
      galleryImages: images
    });
  };
  
  const handlePhoneChange = (phone: string) => {
    setOnboardingData({
      ...onboardingData,
      phone: phone
    });
  };
  
  const handlePriceRangeChange = (minPrice: string, maxPrice: string) => {
    setOnboardingData({
      ...onboardingData,
      minPrice,
      maxPrice
    });
  };
  
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
    
    if (currentGroup === 0) {
      if (currentStepInGroup === 1) {
        return (
          <ArtistTypeStep 
            onSelect={handleArtistTypeSelect} 
            initialValue={onboardingData.artistType}
          />
        );
      }
      
      if (currentStepInGroup === 2) {
        return (
          <ArtistNameStep 
            onInputChange={handleArtistNameChange}
            initialValue={onboardingData.artistName}
          />
        );
      }
      
      if (currentStepInGroup === 3) {
        return (
          <MusicGenresStep
            onSelect={handleMusicGenresSelect}
            initialValues={onboardingData.musicGenres}
          />
        );
      }
    }
    
    if (currentGroup === 1) {
      if (currentStepInGroup === 1) {
        return (
          <BioStep 
            onInputChange={handleBioChange}
            initialValue={onboardingData.bio}
          />
        );
      }
      if (currentStepInGroup === 2) {
        return (
          <ExperienceStep 
            onInputChange={handleExperienceChange}
            initialValue={onboardingData.experience}
          />
        );
      }
    }
    
    if (currentGroup === 2) {
      if (currentStepInGroup === 1) {
        return (
          <ProfilePhotoStep 
            onPhotoChange={handleProfilePhotoChange}
          />
        );
      }
      if (currentStepInGroup === 2) {
        return (
          <GalleryImagesStep
            onImagesChange={handleGalleryImagesChange}
            initialImages={onboardingData.galleryImages}
          />
        );
      }
    }
    
    if (currentGroup === 3) {
      if (currentStepInGroup === 1) {
        return (
          <PhoneVerificationStep
            onPhoneChange={handlePhoneChange}
            initialValue={onboardingData.phone}
          />
        );
      }
    }
    
    if (currentGroup === 4) {
      if (currentStepInGroup === 1) {
        return (
          <CachePriceStep
            onPriceRangeChange={handlePriceRangeChange}
            initialMinPrice={onboardingData.minPrice}
            initialMaxPrice={onboardingData.maxPrice}
          />
        );
      }
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full w-full pt-28 px-6 sm:px-4 md:px-8">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Paso {currentStepInGroup} del Grupo {currentGroup + 1}
          </h2>
          <p className="text-gray-500 mb-8">
            Aquí iría el formulario o contenido para este paso específico.
          </p>
          
          <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 rounded-3xl p-8 md:p-12">
            <div className="w-full max-w-md mx-auto">
              <p className="text-center text-gray-500">
                Contenido del formulario
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
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
        
        <div className={`flex-1 ${isMobile ? 'min-h-0 flex items-start pt-20' : 'flex items-center justify-center'}`}>
          {renderCurrentStep()}
        </div>
      </div>
    </PageTransition>
  );
};

export default ArtistOnboardingPage;
