
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
    <div className="mb-20 relative">
      {/* Contenedor principal con grid para alinear contenido */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Numeración y línea vertical */}
        <div className="hidden md:flex md:col-span-1 flex-col items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-vyba-blue text-vyba-navy font-bold">
            {stepNumber}
          </div>
          {!isLast && (
            <div className="w-px bg-vyba-blue/50 h-full my-4"></div>
          )}
        </div>
        
        {/* Contenido del paso (texto) - a la izquierda */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="flex md:hidden items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-vyba-blue text-vyba-navy font-bold">
              {stepNumber}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
          </div>
          
          <h3 className="hidden md:block text-2xl md:text-3xl font-bold mb-4">{title}</h3>
          <p className="text-gray-600 mb-6 max-w-md">{description}</p>
        </div>
        
        {/* Ejemplo visual - a la derecha */}
        <div className="md:col-span-6 transition-all duration-300 hover:translate-y-[-4px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TimelineStep;
