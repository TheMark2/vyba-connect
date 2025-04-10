
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown } from "lucide-react";
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";

interface ContactCardProps {
  artist: {
    name: string;
    location: string;
    availability: string;
    priceRange: string;
    image: string;
  };
  onContact: () => void;
  aboutMeRef?: React.RefObject<HTMLDivElement>;
  imagesRef?: React.RefObject<HTMLDivElement>;
  isMobile?: boolean;
  isAudioPlaying?: boolean;
  showAudioPlayer?: boolean;
  onToggleAudioPlayerVisibility?: (visible: boolean) => void;
}

const ContactCard = ({
  artist,
  onContact,
  aboutMeRef,
  imagesRef,
  isMobile,
  isAudioPlaying,
  showAudioPlayer,
  onToggleAudioPlayerVisibility
}: ContactCardProps) => {
  // Mantenemos la tarjeta visible siempre
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mantenemos el useEffect para compatibilidad con scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Solo habilitamos drawer si estamos en móvil y hay un reproductor de audio
  const shouldShowDrawerControls = isMobile && isAudioPlaying;

  // Al cambiar el estado del drawer, actualizamos la visibilidad del reproductor
  useEffect(() => {
    if (onToggleAudioPlayerVisibility) {
      onToggleAudioPlayerVisibility(drawerOpen);
    }
  }, [drawerOpen, onToggleAudioPlayerVisibility]);

  // Efecto para sincronizar el estado del drawer con showAudioPlayer
  useEffect(() => {
    if (showAudioPlayer !== undefined) {
      setDrawerOpen(showAudioPlayer);
    }
  }, [showAudioPlayer]);

  const toggleDrawer = () => {
    const newState = !drawerOpen;
    setDrawerOpen(newState);
    if (onToggleAudioPlayerVisibility) {
      onToggleAudioPlayerVisibility(newState);
    }
  };

  if (!isMobile) {
    // Versión de escritorio no usa drawer
    return (
      <div 
        className="transition-transform duration-300"
        ref={cardRef}
      >
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="bg-[#F7F7F7] rounded-3xl md:rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-white py-2 px-4">{artist.availability}</Badge>
                <Badge variant="secondary" className="bg-white py-2 px-4">{artist.location}</Badge>
              </div>
              
              <div className="mb-5">
                <div className="text-xl font-bold">{artist.priceRange}</div>
              </div>
              
              <Button className="w-full" onClick={onContact}>
                Contactar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Versión móvil con Drawer
  return (
    <div 
      className="transition-transform duration-300"
      ref={cardRef}
    >
      {shouldShowDrawerControls ? (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="bg-[#F7F7F7] rounded-t-3xl md:rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-white py-2 px-4">{artist.availability}</Badge>
                  <Badge variant="secondary" className="bg-white py-2 px-4">{artist.location}</Badge>
                </div>
                
                <div className="mb-5">
                  <div className="text-xl font-bold">{artist.priceRange}</div>
                </div>
                
                <Button className="w-full" onClick={onContact}>
                  Contactar
                </Button>
                
                <DrawerTrigger asChild>
                  <div className="flex justify-center mt-3 cursor-pointer">
                    {drawerOpen ? (
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
                </DrawerTrigger>
              </div>
            </CardContent>
          </Card>
          
          <DrawerContent className="bg-[#F7F7F7] rounded-t-2xl border-none h-auto max-h-48">
            <div className="px-5 pt-3 pb-5">
              {/* El contenido del reproductor se inyectará aquí desde ArtistProfilePage */}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="bg-[#F7F7F7] rounded-3xl md:rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-white py-2 px-4">{artist.availability}</Badge>
                <Badge variant="secondary" className="bg-white py-2 px-4">{artist.location}</Badge>
              </div>
              
              <div className="mb-5">
                <div className="text-xl font-bold">{artist.priceRange}</div>
              </div>
              
              <Button className="w-full" onClick={onContact}>
                Contactar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactCard;
