
import React from "react";
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
  // Altura reducida para la versión colapsada
  const contactCardHeight = 80;
  
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
        backgroundColor: 'white',
        zIndex: 50,
        position: 'relative'
      }}
    >
      <div className="px-4 pt-4 pb-6 relative z-50">
        <ContactCard 
          artist={artistContact} 
          onContact={onContact} 
          aboutMeRef={aboutMeRef} 
          imagesRef={imagesRef}
          isMobile={true}
        />
        
        {currentPlaying && (
          <div className="mt-4">
            <AudioPlayer 
              preview={currentPlaying} 
              artistName={artistContact.name} 
              isPlaying={isAudioPlaying} 
              onPlayPause={onPlayPause} 
              audioRef={audioRef} 
              isMobile={true}
            />
          </div>
        )}
      </div>
    </SwipeableBottomSheet>
  );
};

export default MobileBottomSheet;
