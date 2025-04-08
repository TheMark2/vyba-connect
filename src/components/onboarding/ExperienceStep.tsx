
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExperienceStepProps {
  onInputChange: (experience: string) => void;
  initialValue?: string;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
  onInputChange,
  initialValue = ''
}) => {
  const [experience, setExperience] = useState(initialValue);
  const [wordCount, setWordCount] = useState(initialValue ? initialValue.trim().split(/\s+/).filter(Boolean).length : 0);
  const isMobile = useIsMobile();

  const handleExperienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newExperience = e.target.value;
    setExperience(newExperience);
    onInputChange(newExperience);

    // Contar palabras
    setWordCount(newExperience.trim() ? newExperience.trim().split(/\s+/).filter(Boolean).length : 0);
  };

  // Determinar el color del contador de palabras según la cantidad
  const getWordCountColor = () => {
    if (wordCount >= 100) return "bg-green-100 text-green-600";
    if (wordCount >= 50) return "bg-blue-100 text-blue-600";
    return "bg-pink-100 text-pink-500";
  };

  return (
    <div className="flex flex-col w-full px-6 sm:px-4 md:px-8">
      <div className="max-w-2xl w-full text-center mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-4">
          ¿Tienes experiencia?
        </h2>
        <p className="text-gray-500 mb-6">
          Explícanos tu experiencia y los lugares destacados donde has trabajado
        </p>
        
        <div className="bg-transparent rounded-3xl p-0 md:p-12">
          <div className="w-full mx-auto">
            <div className="space-y-4">
              <Textarea 
                placeholder="Es importante que el texto sea original. No se pueden insertar enlaces ni números de teléfono." 
                className={`min-h-[180px] ${isMobile ? 'text-sm' : ''}`}
                value={experience} 
                onChange={handleExperienceChange} 
              />
              <div className="flex justify-end">
                <span className="text-sm text-gray-500">
                  Palabras escritas <span className={`rounded-full px-2 py-1 ml-1 ${getWordCountColor()}`}>{wordCount}</span>
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button variant="secondary" className="flex items-center gap-2" onClick={() => console.log("Añadir lugares destacados")}>
                <Plus className="h-4 w-4" />
                Añadir lugares destacados
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceStep;
