import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Mic, CopyPlus, Guitar, Music, Martini, Rocket, Boxes} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

interface ArtistType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const artistTypes: ArtistType[] = [
  { id: 'dj', name: 'DJ', icon: <Martini className="w-6 h-6" /> },
  { id: 'solista', name: 'Solista', icon: <Rocket className="w-6 h-6" /> },
  { id: 'banda', name: 'Banda', icon: <Boxes className="w-6 h-6" /> },
  { id: 'duo', name: 'Duo', icon: <CopyPlus className="w-6 h-6" /> },
  { id: 'coro', name: 'Coro', icon: <Mic className="w-6 h-6" /> },
  { id: 'guitarrista', name: 'Guitarrista', icon: <Guitar className="w-6 h-6" /> },
  { id: 'bajista', name: 'Bajista', icon: <Music className="w-6 h-6" /> },
  { id: 'pianista', name: 'Pianista', icon: <Music className="w-6 h-6" /> },
  { id: 'violinista', name: 'Violinista', icon: <Music className="w-6 h-6" /> },
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
    <div className="w-full max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto">
        <h6 className="text-lg font-medium mb-4 text-vyba-navy">Escoge tu tipo de artista</h6>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mx-auto" role="radiogroup" aria-labelledby="artist-type-title">
          {artistTypes.map(type => (
            <Badge
              key={type.id}
              variant="default"
              className={cn(
                "flex flex-col items-start justify-center cursor-pointer transition-all duration-150",
                "text-base font-medium px-8 py-6 rounded-xl gap-2",
                selectedType === type.id 
                  ? "bg-vyba-gray text-vyba-navy font-medium bg-vyba-tertiary/20" 
                  : "bg-vyba-gray text-vyba-tertiary hover:text-vyba-navy",
                activePress === type.id ? "transform scale-95" : ""
              )}
              onClick={() => handleSelect(type.id)}
              onMouseDown={() => handleMouseDown(type.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              role="radio"
              aria-checked={selectedType === type.id}
              aria-label={type.name}
            >
              {type.icon}
              <span>{type.name}</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistTypeStep;
