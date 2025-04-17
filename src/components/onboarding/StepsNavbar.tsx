import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const groupProgress = totalStepsInGroup > 0 
    ? Math.min(100, (currentStepInGroup / totalStepsInGroup) * 100) 
    : 0;
  
  const overallProgress = (currentGroup / totalGroups) * 100;

  return (
    <>
      <div className={`${isMobile ? 'fixed' : 'fixed'} top-0 left-0 right-0 z-30 px-4 md:px-6 lg:px-8 pt-6 bg-white dark:bg-vyba-dark-bg mb-6`}>
        <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-3 px-5 max-w-6xl mx-auto w-full">
          <div className="flex space-x-2 items-center w-full">
            {Array.from({ length: totalGroups }).map((_, index) => (
              <div key={index} className="h-1.5 rounded-full overflow-hidden bg-[#D9D9D9] dark:bg-vyba-dark-secondary/50 flex-1">
                {index < currentGroup ? (
                  <div className="h-full w-full bg-black dark:bg-white transition-all duration-500 ease-in-out" />
                ) : index === currentGroup ? (
                  <div 
                    className="h-full bg-black dark:bg-white transition-all duration-500 ease-in-out" 
                    style={{ width: `${groupProgress}%` }} 
                  />
                ) : (
                  <div className="h-full w-0 transition-all duration-500 ease-in-out" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full px-1 mt-4">
            <Button 
              variant="ghost" 
              className="text-black dark:text-white font-normal rounded-full"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-1.5" />
              Cerrar
            </Button>
            
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
                className="rounded-full"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-vyba-dark-bg py-4 px-6 border-t border-gray-100 dark:border-vyba-dark-secondary">
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="ghost" 
              className="text-black dark:text-white font-normal rounded-full"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-1.5" />
              Cerrar
            </Button>
            
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
                className="rounded-full"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StepsNavbar;
