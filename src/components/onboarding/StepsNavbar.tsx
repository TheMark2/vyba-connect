
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
    
  // Calcular el progreso total a través de todos los grupos (0-100)
  const totalProgress = totalGroups > 0 
    ? Math.min(100, ((currentGroup * 100) + (currentStepInGroup / totalStepsInGroup * 100)) / totalGroups) 
    : 0;

  return (
    <div className="fixed top-6 left-0 right-0 z-30 px-4 md:px-6 lg:px-8">
      <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2.5 px-4 flex flex-col max-w-6xl mx-auto">
        {/* Barra de progreso principal */}
        <div className="w-full h-1 rounded-full overflow-hidden bg-[#E5E5E5] dark:bg-vyba-dark-secondary/30 mb-3">
          <div 
            className="h-full bg-black dark:bg-white" 
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          {/* Botón Cancelar / Cerrar */}
          <Button 
            variant="ghost" 
            className="text-black dark:text-white font-normal"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-1.5" />
            Cerrar
          </Button>
          
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
              className="bg-[#D4DDFF] text-black hover:bg-[#C6D0FF]"
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
