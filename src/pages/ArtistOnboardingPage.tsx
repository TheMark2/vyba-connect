
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtistStepsNavbar, { StepInfo } from '@/components/ArtistStepsNavbar';
import InformationStep from '@/components/artist-steps/InformationStep';

const steps: StepInfo[] = [
  { number: 1, name: "Información", isActive: true, isCompleted: false },
  { number: 2, name: "Subir archivos", isActive: false, isCompleted: false },
  { number: 3, name: "Diploma", isActive: false, isCompleted: false },
];

const ArtistOnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Información básica (paso 1)
    artistType: "",
    artistName: "",
    genres: [] as string[],
    eventTypes: [] as string[],
    
    // Archivos (paso 2)
    // Para futura implementación
    
    // Diploma (paso 3)
    // Para futura implementación
  });
  
  // Función para actualizar el estado del formulario
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  // Navegación entre pasos
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Si es el último paso, finalizar el proceso
      // Aquí iría la lógica para enviar los datos
      navigate('/thank-you');
    }
  };
  
  const handleCancel = () => {
    // Mostrar confirmación o simplemente navegar a la página anterior
    navigate('/');
  };
  
  // Actualizar estado activo de los pasos
  const updatedSteps = steps.map((step) => ({
    ...step,
    isActive: step.number === currentStep,
    isCompleted: step.number < currentStep,
  }));
  
  return (
    <main className="min-h-screen bg-white dark:bg-vyba-dark-bg">
      <ArtistStepsNavbar
        steps={updatedSteps}
        currentStep={currentStep}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onCancel={handleCancel}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === steps.length}
      />
      
      <div className="container mx-auto px-6 py-8">
        {currentStep === 1 && (
          <InformationStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}
        
        {/* 
          Aquí irían los demás componentes para los siguientes pasos
          {currentStep === 2 && <FilesStep formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && <DiplomaStep formData={formData} updateFormData={updateFormData} />}
        */}
      </div>
    </main>
  );
};

export default ArtistOnboardingPage;
