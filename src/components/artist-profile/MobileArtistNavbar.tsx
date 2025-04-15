
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ArtistContactProps {
  name: string;
  location?: string;
  availability?: string;
  priceRange: string;
  image?: string;
}

interface MobileArtistNavbarProps {
  artistContact: ArtistContactProps;
  onContact: () => void;
  aboutMeRef: React.RefObject<HTMLDivElement>;
  imagesRef?: React.RefObject<HTMLDivElement>;
  reviewsRef?: React.RefObject<HTMLDivElement>;
  currentPlaying: string;
  isAudioPlaying: boolean;
  onPlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MobileArtistNavbar = ({
  artistContact,
  onContact,
  aboutMeRef,
  imagesRef,
  reviewsRef,
  currentPlaying
}: MobileArtistNavbarProps) => {
  const [isContacting, setIsContacting] = useState(false);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const yOffset = -100;
      const element = ref.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleContact = () => {
    setIsContacting(true);
    onContact();
    setTimeout(() => setIsContacting(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-vyba-dark-bg border-t border-gray-200 dark:border-gray-800 z-50">
      {currentPlaying && (
        <div className="px-4 py-2 bg-[#F5F5F5] dark:bg-vyba-dark-secondary">
          <div className="flex items-center space-x-3 mb-2">
            <button 
              className="w-8 h-8 rounded-full bg-white dark:bg-vyba-dark-bg shadow-sm flex items-center justify-center"
            >
              <Play className="h-4 w-4 ml-0.5" />
            </button>
            <div className="text-sm font-medium truncate max-w-[200px]">
              {currentPlaying}
            </div>
          </div>
          <Progress value={30} className="h-1.5" />
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-1 p-2">
        <Button 
          variant="secondary"
          className="text-xs h-auto py-2"
          onClick={() => scrollToSection(aboutMeRef)}
        >
          Perfil
        </Button>
        
        {imagesRef && (
          <Button 
            variant="secondary"
            className="text-xs h-auto py-2"
            onClick={() => scrollToSection(imagesRef)}
          >
            Experiencia
          </Button>
        )}
        
        {reviewsRef && (
          <Button 
            variant="secondary"
            className="text-xs h-auto py-2"
            onClick={() => scrollToSection(reviewsRef)}
          >
            Reseñas
          </Button>
        )}
      </div>
      
      <div className="p-4 flex items-center space-x-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex-1">
          <div className="text-lg font-medium dark:text-white">{artistContact.priceRange}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{artistContact.availability}</div>
        </div>
        
        <Button 
          onClick={handleContact}
          className="flex-1"
          disabled={isContacting}
        >
          {isContacting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Contactando...
            </>
          ) : (
            "Contactar"
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileArtistNavbar;
