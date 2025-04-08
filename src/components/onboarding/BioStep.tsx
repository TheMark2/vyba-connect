
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface BioStepProps {
  onInputChange: (bio: string) => void;
  initialValue?: string;
}

const BioStep: React.FC<BioStepProps> = ({ onInputChange, initialValue = '' }) => {
  const [bio, setBio] = useState(initialValue);
  const [wordCount, setWordCount] = useState(initialValue ? initialValue.trim().split(/\s+/).filter(Boolean).length : 0);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setBio(newBio);
    onInputChange(newBio);
    
    // Contar palabras
    setWordCount(newBio.trim() ? newBio.trim().split(/\s+/).filter(Boolean).length : 0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pt-28 px-4">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-6">
          Sobre ti
        </h2>
        <p className="text-gray-500 mb-8">
          ¿Quién eres? Explícanos un poco la biografía del proyecto
        </p>
        
        <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 rounded-3xl p-8 md:p-12">
          <div className="w-full mx-auto">
            <div className="space-y-4">
              <Textarea 
                placeholder="Es importante que el texto sea original. No se pueden insertar enlaces ni números de teléfono."
                className="min-h-[180px] bg-white dark:bg-vyba-dark-bg/80 rounded-xl"
                value={bio}
                onChange={handleBioChange}
              />
              <div className="flex justify-end">
                <span className="text-sm text-gray-500">
                  Palabras escritas <span className="rounded-full bg-pink-100 text-pink-500 px-2 py-1 ml-1">{wordCount}</span>
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
