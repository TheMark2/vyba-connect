
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
  
  return (
    <article className="centered-content lg:flex-row items-start lg:items-center justify-start lg:justify-center px-6 md:px-8 pt-8 lg:pt-0 lg:h-full">
      <div className="w-full lg:w-1/2 mb-10 lg:mb-0 text-left lg:pr-8">
        <div className="text-sm font-bold mb-3 dark:text-gray-400" aria-label={`Grupo ${group}`}>
          GRUPO {group}
        </div>
        <h1 className="dark:text-white" id={`onboarding-group-${group}`}>
          {title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      
      <div className="w-full lg:w-1/2 center-xy">
        <div className={`feature-card ${isMobile ? 'rounded-[2rem]' : ''} center-xy w-full max-w-md aspect-square`} 
             aria-hidden="true">
          <div className="w-32 h-32">
            {icon}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CoverStep;
