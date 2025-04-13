
import React from "react";
import ContactCard from "./ContactCard";
import AudioPlayer from "./AudioPlayer";
import { BottomDrawer } from "@/components/ui/bottom-drawer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { DrawerClose } from "@/components/ui/drawer";

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
  onClose?: () => void;
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
  onClose
}: MobileBottomSheetProps) => {
  return (
    <BottomDrawer open={true} onOpenChange={onClose || (() => {})} className="px-4 pt-16 pb-6">
      <div className="relative">
        <DrawerClose 
          className="absolute left-0 top-[-40px] z-50 rounded-full p-2 hover:bg-muted/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DrawerClose>
        
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
    </BottomDrawer>
  );
};

export default MobileBottomSheet;
