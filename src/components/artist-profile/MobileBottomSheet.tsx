
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
  return (
    <SwipeableBottomSheet
      overflowHeight={200}
      marginTop={0}
      fullScreen={false}
      topShadow={false}
      shadowTip={false}
      bodyStyle={{ 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px',
        backgroundColor: '#F7F7F7',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '100%'
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
