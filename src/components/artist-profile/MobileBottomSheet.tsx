
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
      overflowHeight={0}
      marginTop={64}
      open={true}
      fullScreen={false}
      topShadow={false}
      shadowTip={false}
      bodyStyle={{ 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div className={`px-5 pt-3 ${!currentPlaying ? 'pb-16' : 'pb-5'}`}>
        <div className="flex justify-center w-full mb-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
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
