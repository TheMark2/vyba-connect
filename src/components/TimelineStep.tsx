
import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineStepProps {
  stepNumber: number;
  title: string;
  description: string;
  children?: React.ReactNode;
  isLast?: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  stepNumber,
  title,
  description,
  children,
  isLast = false
}) => {
  return (
    <div className="flex gap-8 md:gap-16">
      {/* Numeración y línea vertical */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-vyba-navy text-white font-bold">
          {stepNumber}
        </div>
        {!isLast && (
          <div className="w-0.5 bg-gray-200 h-full my-4"></div>
        )}
      </div>
      
      {/* Contenido del paso */}
      <div className="flex-1 pb-16">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
        <p className="text-gray-700 mb-6 max-w-md">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default TimelineStep;
