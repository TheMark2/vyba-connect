import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';
import StepsNavbar from '@/components/onboarding/StepsNavbar';
import CoverStep from '@/components/onboarding/CoverStep';
import ArtistTypeStep from '@/components/onboarding/ArtistTypeStep';
import ArtistNameStep from '@/components/onboarding/ArtistNameStep';
import MusicGenresStep from '@/components/onboarding/MusicGenresStep';
import BioStep from '@/components/onboarding/BioStep';
import { Target, Music, Camera, Calendar, CheckCircle } from 'lucide-react';

// Definimos los grupos de pasos
interface StepGroup {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalSteps: number;
}

// Definimos la interfaz para los datos de onboarding
interface OnboardingData {
  artistType?: string;
  artistName?: string;
  musicGenres?: string[];
  bio?: string;
  // Aquí irían más campos para los siguientes pasos
}

const ArtistOnboardingPage = () => {
  const navigate = useNavigate();
  
  // Estado para almacenar los datos del onboarding
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  
  // Configuración de los grupos de pasos
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
      icon: <Target className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 2
    },
    {
      id: 2,
      title: "Muestra tu imagen",
      description: "Las imágenes valen más que mil palabras, muestra quién eres.",
      icon: <Camera className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 2
    },
    {
      id: 3,
      title: "Disponibilidad y eventos",
      description: "Dinos cuándo y dónde estás disponible para actuar.",
      icon: <Calendar className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 2
    },
    {
      id: 4,
      title: "¡Casi listo!",
      description: "Revisa toda la información antes de publicar tu perfil.",
      icon: <CheckCircle className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 1
    }
  ];
  
  // Estado para el seguimiento de la navegación
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentStepInGroup, setCurrentStepInGroup] = useState(0);
  
  // Actualizadores de datos
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
  
  // Funciones de navegación
  const handleNext = () => {
    const currentGroupObj = stepGroups[currentGroup];
    
    if (currentStepInGroup < currentGroupObj.totalSteps - 1) {
      setCurrentStepInGroup(currentStepInGroup + 1);
    } else if (currentGroup < stepGroups.length - 1) {
      setCurrentGroup(currentGroup + 1);
      setCurrentStepInGroup(0);
    } else {
      navigate('/thank-you');
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
  
  // Verificar si hay un valor seleccionado para habilitar el botón siguiente
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
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full w-full pt-28 px-4">
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
        
        <div className="flex-1 flex items-center justify-center">
          {renderCurrentStep()}
        </div>
      </div>
    </PageTransition>
  );
};

export default ArtistOnboardingPage;
