
import React, { useRef, useEffect, useState } from "react";
import ContactCard from "./ContactCard";
import AudioPlayer from "./AudioPlayer";
import { cn } from "@/lib/utils";

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
  reviewsRef?: React.RefObject<HTMLDivElement>;
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
  reviewsRef,
  currentPlaying,
  isAudioPlaying,
  onPlayPause,
  audioRef
}: MobileBottomSheetProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (imagesRef?.current && reviewsRef?.current) {
        const imagesPosition = imagesRef.current.getBoundingClientRect().bottom;
        const reviewsPosition = reviewsRef.current.getBoundingClientRect().top;
        
        // Mostrar cuando pasemos la sección de imágenes y esconder cuando lleguemos a las reseñas
        if (imagesPosition < 0 && reviewsPosition > window.innerHeight) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Comprobar posición inicial
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [imagesRef, reviewsRef]);

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white z-50 shadow-lg border-t border-gray-200 px-6 pt-5 pb-7 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="relative">
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
    </div>
  );
};

export default MobileBottomSheet;
