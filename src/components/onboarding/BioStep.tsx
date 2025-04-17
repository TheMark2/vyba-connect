
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
  const getWordCountClass = () => {
    if (wordCount >= 100) return "word-count-high";
    if (wordCount >= 50) return "word-count-medium";
    return "word-count-low";
  };

  return (
    <div className="content-container">
      <div className="form-container">
        <h1 className="form-title" id="bio-title">
          Sobre ti
        </h1>
        <p className="form-description">
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
                aria-describedby="bio-description"
              />
              <div className="flex justify-end">
                <span className="word-count">
                  Palabras escritas <span className={getWordCountClass()}>{wordCount}</span>
                </span>
              </div>
              <p id="bio-description" className="sr-only">
                Escribe aquí tu biografía, no incluyas enlaces ni números de teléfono
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioStep;
