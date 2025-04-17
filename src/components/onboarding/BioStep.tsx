
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface BioStepProps {
  onInputChange: (bio: string) => void;
  initialValue?: string;
}

const BioStep: React.FC<BioStepProps> = ({
  onInputChange,
  initialValue = ''
}) => {
  const [bio, setBio] = useState(initialValue);
  const [wordCount, setWordCount] = useState(initialValue ? initialValue.trim().split(/\s+/).filter(Boolean).length : 0);
  const isMobile = useIsMobile();

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setBio(newBio);
    onInputChange(newBio);

    // Contar palabras
    setWordCount(newBio.trim() ? newBio.trim().split(/\s+/).filter(Boolean).length : 0);
  };

  // Determinar el color del contador de palabras según la cantidad
  const getWordCountColor = () => {
    if (wordCount >= 100) return "bg-green-100 text-green-600";
    if (wordCount >= 50) return "bg-blue-100 text-blue-600";
    return "bg-pink-100 text-pink-500";
  };

  return (
    <div className="flex flex-col w-full px-6 sm:px-4 md:px-8 pt-8 lg:pt-0">
      <div className="max-w-2xl w-full text-center mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Sobre ti
        </h1>
        <p className="text-gray-500 mb-6">
          ¿Quién eres? Explícanos un poco la biografía del proyecto
        </p>
        
        <div className="bg-transparent rounded-3xl p-0 md:p-12">
          <div className="w-full mx-auto">
            <div className="space-y-4">
              <Textarea 
                placeholder="Es importante que el texto sea original. No se pueden insertar enlaces ni números de teléfono." 
                className={`min-h-[180px] ${isMobile ? 'text-sm' : ''}`}
                value={bio} 
                onChange={handleBioChange} 
                aria-label="Biografía del artista"
              />
              <div className="flex justify-end">
                <span className="text-sm text-gray-500">
                  Palabras escritas <span className={`rounded-full px-2 py-1 ml-1 ${getWordCountColor()}`}>{wordCount}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioStep;
