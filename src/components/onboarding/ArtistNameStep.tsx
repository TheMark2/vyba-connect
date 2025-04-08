
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface ArtistNameStepProps {
  onInputChange: (name: string) => void;
  initialValue?: string;
}

const ArtistNameStep: React.FC<ArtistNameStepProps> = ({ onInputChange, initialValue }) => {
  const [artistName, setArtistName] = useState<string>(initialValue || '');
  const isMobile = useIsMobile();

  useEffect(() => {
    // Si hay un valor inicial, notificamos al componente padre
    if (initialValue) {
      onInputChange(initialValue);
    }
  }, [initialValue, onInputChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setArtistName(value);
    onInputChange(value);
  };

  return (
    <div className="flex flex-col w-full px-6 sm:px-4 md:px-8">
      <div className="max-w-2xl w-full text-center mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-6 dark:text-white">
          Tu nombre artístico
        </h2>
        <p className="text-gray-500 text-center mb-8 max-w-md mx-auto">
          El nombre con el que te presentas. Asegúrate de que sea fácil de recordar.
        </p>
        
        <div className="w-full max-w-md mx-auto mt-8">
          <Input
            type="text"
            placeholder="DJ Mave"
            value={artistName}
            onChange={handleInputChange}
            className={`w-full h-14 ${isMobile ? 'text-sm' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistNameStep;
