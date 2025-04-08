
import React from 'react';

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
  icon,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full max-w-6xl mx-auto pt-28 pb-16 px-4 md:px-8">
      <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
        <div className="max-w-lg">
          <div className="text-sm font-medium mb-4 text-gray-500 dark:text-gray-400">
            GRUPO {group}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {description}
          </p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 rounded-3xl p-16 flex items-center justify-center w-full max-w-md aspect-square">
          <div className="w-32 h-32">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverStep;
