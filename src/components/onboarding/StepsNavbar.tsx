
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface StepsNavbarProps {
  currentGroup: number;
  totalGroups: number;
  currentStepInGroup: number;
  totalStepsInGroup: number;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  canGoNext?: boolean;
}

const StepsNavbar: React.FC<StepsNavbarProps> = ({
  currentGroup,
  totalGroups,
  currentStepInGroup,
  totalStepsInGroup,
  onBack,
  onNext,
  onCancel,
  canGoNext = true
}) => {
  // Calculamos el progreso global para la barra de progreso (0-100)
  const calculateTotalProgress = () => {
    const totalSteps = Array.from({ length: totalGroups }).reduce((acc, _, groupIndex) => {
      // Suponemos que cada grupo tiene la misma cantidad de pasos que el grupo actual
      // En una implementación real, cada grupo podría tener su propio número de pasos
      return acc + totalStepsInGroup;
    }, 0);
    
    const completedSteps = (currentGroup * totalStepsInGroup) + currentStepInGroup;
    return (completedSteps / totalSteps) * 100;
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-30 px-4 md:px-6 lg:px-8">
      <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2.5 px-4 flex flex-col gap-4 max-w-6xl mx-auto">
        {/* Barra de progreso */}
        <div className="w-full flex gap-1">
          {Array.from({ length: totalGroups }).map((_, index) => (
            <div 
              key={index} 
              className="h-1.5 rounded-full overflow-hidden flex-1 bg-[#D9D9D9] dark:bg-vyba-dark-secondary/50"
            >
              {index < currentGroup ? (
                // Grupo completado
                <div className="h-full w-full bg-black dark:bg-white" />
              ) : index === currentGroup ? (
                // Grupo actual (progreso parcial)
                <div 
                  className="h-full bg-black dark:bg-white" 
                  style={{ 
                    width: `${(currentStepInGroup / totalStepsInGroup) * 100}%` 
                  }} 
                />
              ) : null}
            </div>
          ))}
        </div>
        
        {/* Botones de navegación */}
        <div className="flex items-center justify-between w-full">
          {/* Botón Cerrar */}
          <Button 
            variant="ghost" 
            className="text-black dark:text-white font-normal bg-transparent hover:bg-transparent"
            onClick={onCancel}
          >
            Cerrar
          </Button>
          
          {/* Contenedor para botones de navegación derecha */}
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              onClick={onBack}
              disabled={currentGroup === 0 && currentStepInGroup === 0}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            
            <Button
              className="rounded-full px-8 py-6 text-lg font-medium"
              onClick={onNext}
              disabled={!canGoNext}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsNavbar;
