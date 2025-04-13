
import React, { useRef, useEffect } from "react";
import ContactCard from "./ContactCard";
import AudioPlayer from "./AudioPlayer";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
    <Sheet defaultOpen>
      <SheetContent 
        side="bottom" 
        className="px-0 pt-0 pb-0 h-auto rounded-t-3xl"
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileBottomSheet;
