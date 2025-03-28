import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Check } from "lucide-react";
interface ContactCardProps {
  artist: {
    name: string;
    location?: string; // Make this optional
    availability?: string; // Make this optional
    priceRange: string;
  };
  onContact: () => void;
}
const ContactCard = ({
  artist,
  onContact
}: ContactCardProps) => {
  return <div className="lg:sticky lg:top-24 h-fit bg-[#F5F1EB] dark:bg-vyba-dark-secondary rounded-3xl px-6 py-4">
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
      <h3 className="text-lg font-black mb-6">{artist.priceRange}</h3>
            
      <Button onClick={onContact} className="w-full mt-6 py-4">
        Contactar con {artist.name}
      </Button>
    </div>;
};
export default ContactCard;