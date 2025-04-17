import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
interface CoverStepProps {
  group: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}
const CoverStep: React.FC<CoverStepProps> = ({
  group,
  title,
  description,
  icon
}) => {
  const isMobile = useIsMobile();
  return <article className="w-full flex items-center justify-center px-6 md:px-8">
      <div className="h-full max-h-[80vh] flex lg:flex-row items-center justify-center max-w-6xl w-full gap-8">
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left lg:pr-8">
          <div className="text-sm font-bold mb-3 text-gray-500 dark:text-gray-400" aria-label={`Grupo ${group}`}>
            GRUPO {group}
          </div>
          <h1 className="font-bold text-gray-900 dark:text-white mb-4" id={`onboarding-group-${group}`}>
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto lg:mx-0">
            {description}
          </p>
        </div>
        
        <div className="w-full center-xy">
          <div className={`feature-card ${isMobile ? 'rounded-[2rem] p-8' : 'rounded-[3rem] p-12'} center-xy w-full max-w-md aspect-square`} aria-hidden="true">
            <div className={isMobile ? "w-24 h-24" : "w-32 h-32"}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </article>;
};
export default CoverStep;