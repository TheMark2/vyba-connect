import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
export type StepInfo = {
  number: number;
  name: string;
  isActive: boolean;
  isCompleted?: boolean;
};
interface ArtistStepsNavbarProps {
  steps: StepInfo[];
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}
const ArtistStepsNavbar = ({
  steps,
  currentStep,
  onPrevious,
  onNext,
  onCancel,
  isFirstStep,
  isLastStep
}: ArtistStepsNavbarProps) => {
  return <div className="w-full py-4 px-6 sticky top-0 z-10 bg-white dark:bg-vyba-dark-bg">
      <div className="flex items-center justify-between rounded-2xl bg-[#F7F7F7] dark:bg-vyba-dark-secondary py-4 px-6">
        {/* Botón Cancelar */}
        <Button variant="ghost" size="sm" className="text-black dark:text-white hover:bg-[#EBEBEB]" onClick={onCancel}>
          <X size={16} className="mr-1" />
          Cancelar
        </Button>
        
        {/* Pasos del proceso */}
        <div className="hidden md:flex items-center justify-center">
          {steps.map((step, index) => <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold", step.isActive ? "bg-black text-white dark:bg-white dark:text-black" : step.isCompleted ? "bg-gray-400 text-white" : "bg-[#EBEBEB] text-gray-500 dark:bg-gray-700")}>
                  {step.number}
                </div>
                <span className={cn("ml-2 text-sm font-medium", step.isActive ? "text-black dark:text-white" : "text-gray-500")}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && <div className="mx-3 h-px w-12 bg-gray-300 dark:bg-gray-600"></div>}
            </React.Fragment>)}
        </div>
        
        {/* Indicador móvil (solo visible en móvil) */}
        <div className="flex md:hidden items-center justify-center">
          <span className="text-sm font-medium text-black dark:text-white">
            Paso {currentStep} de {steps.length}
          </span>
        </div>
        
        {/* Botones de navegación */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" className="rounded-full" onClick={onPrevious} disabled={isFirstStep}>
            <ArrowLeft size={16} />
          </Button>
          
          <Button onClick={onNext} disabled={isLastStep}>
            {isLastStep ? "Finalizar" : "Siguiente"}
          </Button>
        </div>
      </div>
    </div>;
};
export default ArtistStepsNavbar;