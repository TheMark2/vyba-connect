
import React from "react";
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
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="bg-[#F7F7F7] rounded-3xl md:rounded-3xl p-4">
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
  );
};

export default ContactCard;
