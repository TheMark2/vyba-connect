
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
  const isMobile = useIsMobile();

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
    <div className="flex flex-col items-center justify-center w-full pt-28 px-4 md:px-8">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 dark:text-white">
          Descríbete a ti mismo
        </h2>
        <p className="text-gray-500 text-center mb-8 max-w-md mx-auto">
          ¿Eres DJ, cantante, banda, performer...? Cuéntanos tu tipo de propuesta artística.
        </p>
        
        {/* Mostrar todos los badges juntos en una sola lista */}
        <div className="flex flex-wrap justify-center gap-3">
          {artistTypes.map(type => (
            <Badge
              key={type.id}
              variant="outline"
              className={`
                py-3 px-6 cursor-pointer transition-all duration-150
                flex items-center gap-2 text-sm font-medium rounded-full border-none
                ${selectedType === type.id 
                  ? 'bg-[#D9D9D9] dark:bg-[#444444]' 
                  : 'bg-[#F7F7F7] dark:bg-vyba-dark-secondary hover:bg-[#E9E9E9] dark:hover:bg-vyba-dark-secondary/80'
                }
                ${activePress === type.id ? 'transform scale-95' : ''}
              `}
              onClick={() => handleSelect(type.id)}
              onMouseDown={() => handleMouseDown(type.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
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
