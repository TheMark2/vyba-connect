
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mantenemos el useEffect para compatibilidad con scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Solo habilitamos eventos táctiles si estamos en móvil y hay un reproductor de audio
  const hasDragFunctionality = isMobile && showAudioPlayer !== undefined && onToggleAudioPlayerVisibility;

  // Manejo de eventos táctiles para arrastrar la tarjeta
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasDragFunctionality) return;
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !hasDragFunctionality) return;
    
    // Prevenir el scroll de la página durante el arrastre
    e.preventDefault();
    
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;
    
    // Detectamos dirección de arrastre
    if (Math.abs(diffY) > 30) {
      if (diffY > 0) {
        // Arrastrando hacia abajo - ocultar reproductor
        if (showAudioPlayer && onToggleAudioPlayerVisibility) {
          onToggleAudioPlayerVisibility(false);
        }
      } else {
        // Arrastrando hacia arriba - mostrar reproductor
        if (!showAudioPlayer && onToggleAudioPlayerVisibility) {
          onToggleAudioPlayerVisibility(true);
        }
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleAudioPlayerVisibility = () => {
    if (onToggleAudioPlayerVisibility) {
      onToggleAudioPlayerVisibility(!showAudioPlayer);
    }
  };

  return (
    <div 
      className="transition-transform duration-300"
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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

            {hasDragFunctionality && isAudioPlaying && (
              <div 
                className="flex justify-center mt-3 cursor-pointer" 
                onClick={toggleAudioPlayerVisibility}
              >
                {showAudioPlayer ? (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactCard;
