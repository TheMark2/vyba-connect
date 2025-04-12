
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
  return <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="bg-[#F7F7F7] rounded-3xl md:rounded-3xl py-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-white py-1.5 px-3">{artist.availability}</Badge>
            <Badge variant="secondary" className="bg-white py-1.5 px-3">{artist.location}</Badge>
          </div>
          
          <div className="mb-3">
            <div className="text-xl font-bold">{artist.priceRange}</div>
          </div>
          
          <Button className="w-full mb-4" onClick={onContact}>
            Contactar
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default ContactCard;
