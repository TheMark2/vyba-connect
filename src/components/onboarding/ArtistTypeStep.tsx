
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Mic, Users, Guitar, Music, Headphones } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ArtistType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const artistTypes: ArtistType[] = [
  { id: 'dj', name: 'DJ', icon: <Headphones className="w-4 h-4" /> },
  { id: 'solista', name: 'Solista', icon: <Mic className="w-4 h-4" /> },
  { id: 'banda', name: 'Banda', icon: <Users className="w-4 h-4" /> },
  { id: 'duo', name: 'Duo', icon: <Users className="w-4 h-4" /> },
  { id: 'coro', name: 'Coro', icon: <Mic className="w-4 h-4" /> },
  { id: 'guitarrista', name: 'Guitarrista', icon: <Guitar className="w-4 h-4" /> },
  { id: 'bajista', name: 'Bajista', icon: <Music className="w-4 h-4" /> },
  { id: 'pianista', name: 'Pianista', icon: <Music className="w-4 h-4" /> },
  { id: 'violinista', name: 'Violinista', icon: <Music className="w-4 h-4" /> },
];

interface ArtistTypeStepProps {
  onSelect: (type: string) => void;
  initialValue?: string;
}

const ArtistTypeStep: React.FC<ArtistTypeStepProps> = ({ onSelect, initialValue }) => {
  const [selectedType, setSelectedType] = useState<string>(initialValue || '');
  const [activePress, setActivePress] = useState<string | null>(null);

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId);
    onSelect(typeId);
  };
  
  const handleMouseDown = (typeId: string) => {
    setActivePress(typeId);
  };
  
  const handleMouseUp = () => {
    setActivePress(null);
  };

  return (
    <div className="content-container w-full max-w-6xl mx-auto">
      <div className="form-container">
        <h1 className="form-title" id="artist-type-title">
          Descríbete a ti mismo
        </h1>
        <p className="form-description">
          ¿Eres DJ, cantante, banda, performer...? Cuéntanos tu tipo de propuesta artística.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto" role="radiogroup" aria-labelledby="artist-type-title">
          {artistTypes.map(type => (
            <Badge
              key={type.id}
              variant="outline"
              className={`
                selection-badge py-3 px-6 cursor-pointer transition-all duration-150
                text-sm font-medium rounded-full border-none
                ${selectedType === type.id ? 'selection-badge-active' : 'selection-badge-inactive'}
                ${activePress === type.id ? 'transform scale-95' : ''}
              `}
              onClick={() => handleSelect(type.id)}
              onMouseDown={() => handleMouseDown(type.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              role="radio"
              aria-checked={selectedType === type.id}
              aria-label={type.name}
            >
              {type.icon}
              {type.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistTypeStep;
