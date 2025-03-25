
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ContactCardProps {
  artist: {
    name: string;
    location: string;
    availability: string;
    priceRange: string;
  };
  onContact: () => void;
}

const ContactCard = ({ artist, onContact }: ContactCardProps) => {
  return (
    <div className="lg:sticky lg:top-24 h-fit bg-white dark:bg-vyba-dark-bg rounded-3xl px-6 py-4">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-base text-neutral-600 dark:text-neutral-300">
          {artist.location} · {artist.availability}
        </p>
      </div>
      
      <h3 className="text-lg font-black mb-6">{artist.priceRange}</h3>
      <Separator className="-mx-6 w-[calc(100%+48px)]" />
      
      <Button className="w-full py-4 text-base font-bold mt-6" onClick={onContact}>
        Contactar con {artist.name}
      </Button>
    </div>
  );
};

export default ContactCard;
