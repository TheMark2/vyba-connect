import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

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

const ContactCard = ({ artist, onContact, aboutMeRef }: ContactCardProps) => {
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

  return (
    <div className={`transition-transform duration-300 ${!isVisible ? 'translate-y-full' : 'translate-y-0'}`}>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={artist.image} 
                alt={artist.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold">{artist.name}</h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                {artist.location}
              </div>
            </div>
          </div>
          
          <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            {artist.availability}
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Precio estimado</div>
            <div className="font-bold">{artist.priceRange}</div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={onContact}
          >
            Contactar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactCard;
