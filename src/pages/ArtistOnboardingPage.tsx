
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';
import StepsNavbar from '@/components/onboarding/StepsNavbar';
import CoverStep from '@/components/onboarding/CoverStep';
import { Target, Music, Camera, Calendar, CheckCircle } from 'lucide-react';

// Definimos los grupos de pasos
interface StepGroup {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalSteps: number;
}

const ArtistOnboardingPage = () => {
  const navigate = useNavigate();
  
  // Configuración de los grupos de pasos
  const stepGroups: StepGroup[] = [
    {
      id: 0,
      title: "¿Quién eres como artista?",
      description: "Vamos a mostrar tu esencia para que los promotores y fans te conozcan al instante.",
      icon: <Target className="w-full h-full stroke-[1.5px]" />,
      totalSteps: 3
    },
    {
      id: 1,
      title: "Tu música y experiencia",
      description: "Comparte tus mejores canciones y tu trayectoria profesional.",
      icon: <Music className="w-full h-full stroke-[1.5px]" />,
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
  
  // Funciones de navegación
  const handleNext = () => {
    const currentGroupObj = stepGroups[currentGroup];
    
    if (currentStepInGroup < currentGroupObj.totalSteps - 1) {
      // Avanzar al siguiente paso dentro del mismo grupo
      setCurrentStepInGroup(currentStepInGroup + 1);
    } else if (currentGroup < stepGroups.length - 1) {
      // Avanzar al siguiente grupo
      setCurrentGroup(currentGroup + 1);
      setCurrentStepInGroup(0); // Resetear al primer paso del nuevo grupo
    } else {
      // Finalizar el proceso de onboarding
      navigate('/thank-you');
    }
  };
  
  const handleBack = () => {
    if (currentStepInGroup > 0) {
      // Retroceder un paso dentro del mismo grupo
      setCurrentStepInGroup(currentStepInGroup - 1);
    } else if (currentGroup > 0) {
      // Retroceder al grupo anterior
      setCurrentGroup(currentGroup - 1);
      setCurrentStepInGroup(stepGroups[currentGroup - 1].totalSteps - 1); // Ir al último paso del grupo anterior
    }
  };
  
  const handleCancel = () => {
    navigate('/artist-benefits');
  };
  
  // Renderizar el paso actual
  const renderCurrentStep = () => {
    const currentGroupObj = stepGroups[currentGroup];
    
    // Si estamos en el primer paso de cualquier grupo, mostrar la portada
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
    
    // En un caso real, aquí renderizaríamos los distintos pasos de cada grupo
    // Por ahora, solo mostraremos un placeholder
    return (
      <div className="flex flex-col items-center justify-center h-full w-full pt-28 px-4">
        <div className="max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">
            Paso {currentStepInGroup} del Grupo {currentGroup + 1}
          </h2>
          <p className="text-gray-500">
            Aquí iría el formulario o contenido para este paso específico.
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg">
        <StepsNavbar
          currentGroup={currentGroup}
          totalGroups={stepGroups.length}
          currentStepInGroup={currentStepInGroup}
          totalStepsInGroup={stepGroups[currentGroup].totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          onCancel={handleCancel}
        />
        
        {renderCurrentStep()}
      </div>
    </PageTransition>
  );
};

export default ArtistOnboardingPage;
