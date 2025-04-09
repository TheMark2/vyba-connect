
import React from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import Image from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

interface GroupMember {
  id: string;
  name: string;
  image?: string;
  roles: string[];
}

interface GroupMembersProps {
  members: GroupMember[];
}

const GroupMembers = ({ members }: GroupMembersProps) => {
  const isMobile = useIsMobile();
  
  if (!members || members.length === 0) return null;

  // Si es móvil siempre muestra carrusel, o si hay más de 4 miembros en escritorio
  if (isMobile || members.length > 4) {
    return (
      <div className="mt-8 mb-12">
        <h2 className="text-3xl font-black mb-6">Integrantes del grupo</h2>
        <Carousel
          opts={{
            align: "start",
            loop: false,
            containScroll: "trimSnaps"
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {members.map((member) => (
              <CarouselItem 
                key={member.id} 
                className={`pl-4 ${isMobile ? 'basis-4/5' : 'md:basis-1/2 lg:basis-1/3 xl:basis-1/4'}`}
              >
                <MemberCard member={member} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Solo mostrar botones de navegación en desktop */}
          {!isMobile && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </div>
    );
  }

  // Solo mostramos grid en escritorio cuando hay 4 o menos miembros
  return (
    <div className="mt-8 mb-12">
      <h2 className="text-3xl font-black mb-6">Integrantes del grupo</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

// Componente tarjeta para evitar duplicación de código
const MemberCard = ({ member }: { member: GroupMember }) => {
  return (
    <div className="overflow-hidden rounded-xl">
      {member.image ? (
        <div className="relative aspect-square overflow-hidden rounded-3xl border-0">
          <div className="absolute inset-0 bg-black/60 z-10">
            <div className="flex flex-col justify-between h-full p-6">
              <span className="text-white font-bold text-xl">{member.name}</span>
              <div className="flex flex-wrap gap-2">
                {member.roles.map((role, index) => (
                  <UIBadge key={index} className="bg-white text-black px-4 py-2">
                    {role}
                  </UIBadge>
                ))}
              </div>
            </div>
          </div>
          <img 
            src={member.image} 
            alt={`${member.name} - integrante`} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <Card className="aspect-square p-6 bg-[#F7F7F7] flex flex-col justify-between rounded-3xl border-0">
          <span className="font-bold text-xl">{member.name}</span>
          <div className="flex flex-wrap gap-2">
            {member.roles.map((role, index) => (
              <UIBadge key={index} className="bg-white text-black px-4 py-2">
                {role}
              </UIBadge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default GroupMembers;
