
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
    <div className="content-container">
      <div className="form-container">
        <h1 className="form-title" id="artist-name-title">
          Tu nombre artístico
        </h1>
        <p className="form-description">
          El nombre con el que te presentas. Asegúrate de que sea fácil de recordar.
        </p>
        
        <div className="input-container">
          <Input
            type="text"
            placeholder="DJ Mave"
            value={artistName}
            onChange={handleInputChange}
            className={`w-full h-14 ${isMobile ? 'text-sm' : ''}`}
            aria-label="Nombre artístico"
            aria-required="true"
            aria-describedby="artist-name-description"
          />
          <p id="artist-name-description" className="sr-only">
            Introduce tu nombre artístico, debe ser fácil de recordar
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistNameStep;
