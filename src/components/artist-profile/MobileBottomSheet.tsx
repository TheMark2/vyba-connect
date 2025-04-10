
import React, { useState } from "react";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import { ChevronUp, ChevronDown } from "lucide-react";
import ContactCard from "./ContactCard";
import AudioPlayer from "./AudioPlayer";

interface MobileBottomSheetProps {
  artistContact: {
    name: string;
    location: string;
    availability: string;
    priceRange: string;
    image: string;
  };
  onContact: () => void;
  aboutMeRef?: React.RefObject<HTMLDivElement>;
  imagesRef?: React.RefObject<HTMLDivElement>;
  currentPlaying: any;
  isAudioPlaying: boolean;
  onPlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MobileBottomSheet = ({
  artistContact,
  onContact,
  aboutMeRef,
  imagesRef,
  currentPlaying,
  isAudioPlaying,
  onPlayPause,
  audioRef
}: MobileBottomSheetProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Altura para mostrar solo la tarjeta de contacto cuando está cerrado
  const contactCardHeight = 150; // Ajustar según el tamaño real de la tarjeta
  
  // Altura total cuando está abierto (tarjeta de contacto + reproductor)
  const totalHeight = currentPlaying ? contactCardHeight + 100 : contactCardHeight;
  
  return (
    <SwipeableBottomSheet
      overflowHeight={contactCardHeight}
      marginTop={64}
      onChange={(isOpen) => setIsOpen(isOpen)}
      fullScreen={false}
      topShadow={false}
      shadowTip={false}
      bodyStyle={{ 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px',
        backgroundColor: '#F7F7F7'
      }}
    >
      <div className="px-5 pt-3 pb-5">
        <ContactCard 
          artist={artistContact} 
          onContact={onContact} 
          aboutMeRef={aboutMeRef} 
          imagesRef={imagesRef}
        />
        
        {currentPlaying && (
          <>
            <div 
              className="flex justify-center mt-3 cursor-pointer" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <div className="flex items-center text-sm text-gray-500">
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Ocultar reproductor
                </div>
              ) : (
                <div className="flex items-center text-sm text-gray-500">
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Mostrar reproductor
                </div>
              )}
            </div>
            
            {isOpen && (
              <div className="mt-3">
                <AudioPlayer 
                  preview={currentPlaying} 
                  artistName={artistContact.name} 
                  isPlaying={isAudioPlaying} 
                  onPlayPause={onPlayPause} 
                  audioRef={audioRef} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </SwipeableBottomSheet>
  );
};

export default MobileBottomSheet;
