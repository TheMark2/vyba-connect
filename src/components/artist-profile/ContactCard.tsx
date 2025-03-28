
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Check } from "lucide-react";
import ContactDialog from "./ContactDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactCardProps {
  artist: {
    name: string;
    location?: string; // Make this optional
    availability?: string; // Make this optional
    priceRange: string;
    image?: string; // Añadimos la imagen del artista
  };
  onContact: () => void;
}

const ContactCard = ({
  artist,
  onContact
}: ContactCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleContactClick = () => {
    setDialogOpen(true);
    onContact();
  };

  // Renderizar diferentes versiones para móvil y escritorio
  if (isMobile) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 bg-[#F5F1EB] dark:bg-vyba-dark-secondary rounded-t-3xl px-6 py-4 shadow-lg z-30">
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
        
        {/* Espaciador para evitar que el contenido quede oculto detrás del card fijo */}
        <div className="h-32 md:h-0"></div>
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
