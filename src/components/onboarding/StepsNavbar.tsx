
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';

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
  // Calcular el progreso para el grupo actual (0-100)
  const groupProgress = totalStepsInGroup > 0 
    ? Math.min(100, (currentStepInGroup / totalStepsInGroup) * 100) 
    : 0;

  return (
    <div className="fixed top-6 left-0 right-0 z-30 px-4 md:px-6 lg:px-8">
      <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2.5 px-4 flex items-center justify-between max-w-6xl mx-auto">
        {/* Botón Cancelar */}
        <Button 
          variant="ghost" 
          className="text-black dark:text-white font-normal"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        
        {/* Indicadores de grupos de pasos */}
        <div className="flex space-x-2 items-center">
          {Array.from({ length: totalGroups }).map((_, index) => (
            <div key={index} className="w-16 h-1.5 rounded-full overflow-hidden bg-[#D9D9D9] dark:bg-vyba-dark-secondary/50">
              {index < currentGroup ? (
                // Grupo completado (negro completo)
                <div className="h-full w-full bg-black dark:bg-white" />
              ) : index === currentGroup ? (
                // Grupo actual (progreso parcial)
                <div 
                  className="h-full bg-black dark:bg-white" 
                  style={{ width: `${groupProgress}%` }} 
                />
              ) : (
                // Grupo futuro (sin progreso)
                <div className="h-full w-0" />
              )}
            </div>
          ))}
        </div>
        
        {/* Botones de navegación */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="w-9 h-9 rounded-full flex items-center justify-center"
            onClick={onBack}
            disabled={currentGroup === 0 && currentStepInGroup === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepsNavbar;
