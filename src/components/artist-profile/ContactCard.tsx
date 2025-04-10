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
}
const ContactCard = ({
  artist,
  onContact,
  aboutMeRef
}: ContactCardProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    if (!aboutMeRef) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si el elemento aboutMeRef existe y tiene una posición
      if (aboutMeRef.current) {
        const elementTop = aboutMeRef.current.getBoundingClientRect().top + window.scrollY;

        // Si hemos pasado el elemento de referencia, mostramos la tarjeta
        if (currentScrollY > elementTop) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }

      // Ocultar cuando se hace scroll hacia abajo, mostrar cuando se hace scroll hacia arriba
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, aboutMeRef]);
  return <div className={`transition-transform duration-300 ${!isVisible ? 'translate-y-full' : 'translate-y-0'}`}>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="bg-[#F7F7F7] rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{artist.availability}</Badge>
              <Badge variant="secondary">{artist.location}</Badge>
            </div>
            
            <div className="mb-6">
              <div className="text-xl font-bold">{artist.priceRange}</div>
            </div>
            
            <Button className="w-full" onClick={onContact}>
              Contactar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default ContactCard;