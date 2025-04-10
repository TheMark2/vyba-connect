
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
}

const ContactCard = ({
  artist,
  onContact,
  aboutMeRef,
  imagesRef
}: ContactCardProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!imagesRef && !aboutMeRef) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;

      // Referencia a usar basada en si estamos en móvil o no
      const referenceElement = isMobile ? imagesRef : aboutMeRef;

      // Si el elemento de referencia existe y tiene una posición
      if (referenceElement && referenceElement.current) {
        const elementTop = referenceElement.current.getBoundingClientRect().top + window.scrollY;

        // Si hemos pasado el elemento de referencia, mostramos la tarjeta
        if (currentScrollY > elementTop) {
          setIsVisible(true);
        } else {
          // Solo ocultamos si estamos antes del elemento de referencia
          setIsVisible(false);
        }
      }

      // Ya no ocultamos en ningún caso al hacer scroll hacia abajo
      // para mantener la tarjeta siempre visible una vez que se muestra
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, aboutMeRef, imagesRef]);

  return (
    <div className={`transition-transform duration-300 ${!isVisible ? 'translate-y-full' : 'translate-y-0'}`}>
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
};

export default ContactCard;
