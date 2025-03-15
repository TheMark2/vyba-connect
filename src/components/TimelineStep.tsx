import React from 'react';
import { cn } from '@/lib/utils';
interface TimelineStepProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  imagePosition?: 'left' | 'right';
}
const TimelineStep: React.FC<TimelineStepProps> = ({
  title,
  description,
  children,
  imagePosition = 'right'
}) => {
  return <div className="mb-24 md:mb-32">
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center", imagePosition === 'left' ? "md:flex-row-reverse" : "")}>
        {/* Contenido (texto) */}
        <div className={cn("flex flex-col justify-center", imagePosition === 'left' ? "md:pl-10" : "md:pr-10")}>
          <h3 className="text-2xl md:text-5xl font-bold mb-4">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        
        {/* Imagen */}
        <div className={cn("transition-all duration-300 hover:opacity-95 rounded-[2vw] overflow-hidden", imagePosition === 'left' ? "md:order-first" : "md:order-last")}>
          {children}
        </div>
      </div>
    </div>;
};
export default TimelineStep;