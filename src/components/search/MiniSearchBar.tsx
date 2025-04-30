import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  KeyboardMusic, 
  Guitar, 
  Piano, 
  MicVocal, 
  AudioWaveform, 
  Drum, 
  CassetteTape, 
  Disc3,
  Music2,
  PartyPopper,
  Users,
  Mic2,
  GlassWater,
  Heart,
  Cake,
  Music,
  Headphones,
  Radio,
  Disc
} from "lucide-react";

interface SearchOption {
  id: string;
  label: string;
}

const searchOptions: SearchOption[] = [
  { id: 'artist-type', label: 'Tipo de artista' },
  { id: 'event-type', label: 'Tipo de evento' },
  { id: 'genre', label: 'Género' }
];

const artistTypes = [
  { id: 'dj', label: 'DJs', icon: <Music2 className="w-4 h-4" /> },
  { id: 'saxophonist', label: 'Saxofonistas', icon: <KeyboardMusic className="w-4 h-4" /> },
  { id: 'singer', label: 'Cantantes', icon: <MicVocal className="w-4 h-4" /> },
  { id: 'guitarist', label: 'Guitarristas', icon: <Guitar className="w-4 h-4" /> },
  { id: 'pianist', label: 'Pianistas', icon: <Piano className="w-4 h-4" /> },
  { id: 'violinist', label: 'Violinistas', icon: <AudioWaveform className="w-4 h-4" /> },
  { id: 'drummer', label: 'Bateristas', icon: <Drum className="w-4 h-4" /> },
  { id: 'bassist', label: 'Bajistas', icon: <Disc3 className="w-4 h-4" /> }
];

const eventTypes = [
  { id: 'wedding', label: 'Bodas', icon: <Heart className="w-4 h-4" /> },
  { id: 'corporate', label: 'Eventos Corporativos', icon: <Users className="w-4 h-4" /> },
  { id: 'party', label: 'Fiestas', icon: <PartyPopper className="w-4 h-4" /> },
  { id: 'birthday', label: 'Cumpleaños', icon: <Cake className="w-4 h-4" /> },
  { id: 'cocktail', label: 'Cócteles', icon: <GlassWater className="w-4 h-4" /> },
  { id: 'karaoke', label: 'Karaoke', icon: <Mic2 className="w-4 h-4" /> }
];

const genres = [
  { id: 'pop', label: 'Pop', icon: <Music className="w-4 h-4" /> },
  { id: 'rock', label: 'Rock', icon: <Guitar className="w-4 h-4" /> },
  { id: 'electronic', label: 'Electrónica', icon: <Headphones className="w-4 h-4" /> },
  { id: 'jazz', label: 'Jazz', icon: <Radio className="w-4 h-4" /> },
  { id: 'latin', label: 'Latina', icon: <Music2 className="w-4 h-4" /> },
  { id: 'classical', label: 'Clásica', icon: <Disc className="w-4 h-4" /> }
];

const MiniSearchBar = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState({
    'artist-type': 'Tipo de artista',
    'event-type': 'Tipo de evento',
    'genre': 'Género'
  });

  const getOptionsForType = (type: string) => {
    switch (type) {
      case 'artist-type':
        return artistTypes;
      case 'event-type':
        return eventTypes;
      case 'genre':
        return genres;
      default:
        return [];
    }
  };

  const handleOptionSelect = (type: string, label: string) => {
    setSelectedLabels(prev => ({
      ...prev,
      [type]: label
    }));
    setSelectedOption(null);
  };

  return (
    <div className="flex items-center bg-vyba-gray rounded-full px-2 py-1.5">
      {searchOptions.map((option) => (
        <Popover key={option.id}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "rounded-full text-sm font-regularsad transition-all duration-300 hover:bg-black/20 hover:text-white",
                selectedOption === option.id ? "bg-vyba-navy text-white" : "text-gray-600"
              )}
              onClick={() => setSelectedOption(option.id)}
            >
              {selectedLabels[option.id]}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 bg-white rounded-3xl border-none shadow-lg mt-2" align="start">
            <div className="grid grid-cols-1 gap-1">
              {getOptionsForType(option.id).map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal hover:bg-vyba-gray rounded-xl"
                  onClick={() => handleOptionSelect(option.id, item.label)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-vyba-navy text-white hover:text-white hover:bg-vyba-navy/90 ml-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </Button>
    </div>
  );
};

export default MiniSearchBar; 