
import React, { useEffect, useState } from "react";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
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
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
}

const MobileBottomSheet = ({
  artistContact,
  onContact,
  aboutMeRef,
  imagesRef,
  currentPlaying,
  isAudioPlaying,
  onPlayPause,
  audioRef,
  onNextTrack,
  onPreviousTrack
}: MobileBottomSheetProps) => {
  // Altura para asegurar que la tarjeta de contacto se vea completa
  const contactCardHeight = 200;
  
  // Estado para forzar la re-renderización cuando cambia la canción
  const [playerKey, setPlayerKey] = useState(0);
  
  // Actualizar la clave cuando cambia la canción para forzar re-renderizado
  useEffect(() => {
    if (currentPlaying) {
      setPlayerKey(prevKey => prevKey + 1);
    }
  }, [currentPlaying]);
  
  return (
    <SwipeableBottomSheet
      overflowHeight={contactCardHeight}
      marginTop={64}
      fullScreen={false}
      topShadow={false}
      shadowTip={false}
      bodyStyle={{ 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px',
        backgroundColor: '#F7F7F7'
      }}
    >
      <div className={`px-5 pt-3 ${!currentPlaying ? 'pb-16' : 'pb-5'}`}>
        <ContactCard 
          artist={artistContact} 
          onContact={onContact} 
          aboutMeRef={aboutMeRef} 
          imagesRef={imagesRef}
        />
        
        {currentPlaying && (
          <div className="mt-4" key={`player-container-${playerKey}`}>
            <AudioPlayer 
              preview={currentPlaying} 
              artistName={artistContact.name} 
              isPlaying={isAudioPlaying} 
              onPlayPause={onPlayPause} 
              audioRef={audioRef} 
              isMobile={true}
              onNext={onNextTrack}
              onPrevious={onPreviousTrack}
            />
          </div>
        )}
      </div>
    </SwipeableBottomSheet>
  );
};

export default MobileBottomSheet;
