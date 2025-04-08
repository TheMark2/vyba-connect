
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
    <div className={`flex flex-col lg:flex-row items-center justify-center h-full w-full max-w-6xl mx-auto ${isMobile ? 'pt-8' : 'pt-28 pb-16'} px-6 md:px-8`}>
      <div className="w-full lg:w-1/2 mb-10 lg:mb-0 text-left lg:pr-8">
        <div className="text-sm font-bold mb-3 dark:text-gray-400">
          GRUPO {group}
        </div>
        <h1 className={`text-4xl md:text-6xl font-black mb-4 md:mb-6 dark:text-white`}>
          {title}
        </h1>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className={`bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 ${isMobile ? 'rounded-[2rem]' : 'rounded-3xl'} p-12 sm:p-16 flex items-center justify-center w-full max-w-md aspect-square`}>
          <div className="w-32 h-32">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverStep;
