
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Check } from "lucide-react";
import ContactDialog from "./ContactDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactCardProps {
  artist: {
    name: string;
    location?: string;
    availability?: string;
    priceRange: string;
    image?: string;
  };
  onContact: () => void;
  aboutMeRef?: React.RefObject<HTMLElement>;
}

const ContactCard = ({
  artist,
  onContact,
  aboutMeRef
}: ContactCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showFixedCard, setShowFixedCard] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLElement | null>(null);
  const previousShowState = useRef(false);
  
  useEffect(() => {
    // Referencia al footer para detectar cuando está visible
    footerRef.current = document.querySelector('footer');
    
    const handleScroll = () => {
      if (footerRef.current && aboutMeRef?.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const aboutMeRect = aboutMeRef.current.getBoundingClientRect();
        
        // Mostrar la tarjeta justo después de que la sección "Sobre mí" salga completamente de la vista
        // y antes de que el footer entre en la vista
        const shouldShowCard = aboutMeRect.bottom <= 0 && footerRect.top > window.innerHeight;
        
        // Si el estado va a cambiar, activar la animación
        if (shouldShowCard !== previousShowState.current) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 300); // Duración de la animación
          previousShowState.current = shouldShowCard;
        }
        
        setShowFixedCard(shouldShowCard);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Comprobación inicial
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [aboutMeRef]);
  
  const handleContactClick = () => {
    setDialogOpen(true);
    onContact();
  };

  // Renderizar la versión fija para móvil y pantallas donde el sticky no funciona bien
  if (isMobile) {
    // Agregar clases para las animaciones de entrada y salida
    const cardClasses = `fixed bottom-0 left-0 right-0 bg-[#F5F1EB] dark:bg-vyba-dark-secondary rounded-t-[30px] px-6 py-4 shadow-lg z-30 transition-all duration-300 ease-in-out ${
      showFixedCard 
        ? 'translate-y-0 opacity-100' 
        : 'translate-y-full opacity-0'
    }`;

    return (
      <>
        <div className={cardClasses}>
          {/* Indicador visual en la parte superior (línea) */}
          <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
          
          {/* Contenedor para ubicación y disponibilidad en línea */}
          <div className="flex flex-wrap gap-2 mb-4">
            {artist.location && <div className="flex items-center gap-1.5 bg-white dark:bg-vyba-dark-bg px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{artist.location}</span>
              </div>}
            
            {artist.availability && <div className="flex items-center gap-1.5 bg-white dark:bg-vyba-dark-bg px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">{artist.availability}</span>
              </div>}
          </div>
          
          {/* Precio */}
          <h3 className="text-lg font-black mb-4">{artist.priceRange}</h3>
                
          <Button onClick={handleContactClick} className="w-full mt-2 py-4 rounded-full">
            Contactar con {artist.name}
          </Button>
        </div>
        
        <ContactDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          artistName={artist.name}
          artistImage={artist.image || "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"}
        />
        
        {/* Espaciador para evitar que el contenido quede oculto detrás del card fijo 
           Solo agregamos espacio cuando la tarjeta está visible */}
        {showFixedCard && <div className="h-32 md:h-0"></div>}
      </>
    );
  }

  // Versión para escritorio (mantenemos el diseño original)
  return (
    <>
      <div className="lg:sticky lg:top-24 h-fit bg-[#F5F1EB] dark:bg-vyba-dark-secondary rounded-3xl px-6 py-4">
        {/* Contenedor para ubicación y disponibilidad en línea */}
        <div className="flex flex-wrap gap-2 mb-4">
          {artist.location && <div className="flex items-center gap-1.5 bg-white dark:bg-vyba-dark-bg px-3 py-1.5 rounded-full">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{artist.location}</span>
            </div>}
          
          {artist.availability && <div className="flex items-center gap-1.5 bg-white dark:bg-vyba-dark-bg px-3 py-1.5 rounded-full">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{artist.availability}</span>
            </div>}
        </div>
        
        {/* Precio */}
        <h3 className="text-lg font-black mb-4">{artist.priceRange}</h3>
              
        <Button onClick={handleContactClick} className="w-full mt-4 py-4">
          Contactar con {artist.name}
        </Button>
      </div>
      
      <ContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        artistName={artist.name}
        artistImage={artist.image || "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"}
      />
    </>
  );
};

export default ContactCard;
