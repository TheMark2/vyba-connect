
import React, { useEffect, useState } from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import Image from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [useCarousel, setUseCarousel] = useState(isMobile || members.length > 4);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // Determina si usamos carrusel basado en el ancho de la ventana y cantidad de miembros
      if (window.innerWidth < 768) {
        // Móvil siempre carrusel
        setUseCarousel(true);
      } else if (window.innerWidth < 1024) {
        // Tablet: carrusel si hay más de 2 miembros
        setUseCarousel(members.length > 2);
      } else if (window.innerWidth < 1280) {
        // Desktop pequeño: carrusel si hay más de 3 miembros
        setUseCarousel(members.length > 3);
      } else {
        // Desktop grande: carrusel si hay más de 4 miembros
        setUseCarousel(members.length > 4);
      }
    };

    // Ejecutar al montar y cuando cambia el tamaño de la ventana
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [members.length]);
  
  if (!members || members.length === 0) return null;

  if (useCarousel) {
    return (
      <div className="mt-8 mb-12">
        <h2 className="text-3xl font-black mb-6 px-6 md:px-0">Integrantes del grupo</h2>
        <div className={`${isMobile ? 'w-full' : 'w-full'}`}>
          <Carousel
            opts={{
              align: "start",
              loop: false,
              containScroll: "trimSnaps"
            }}
            className="w-full"
          >
            <CarouselContent className={`${isMobile ? '-ml-4 pl-4' : '-ml-4'}`}>
              {members.map((member) => (
                <CarouselItem 
                  key={member.id} 
                  className={`${isMobile ? 'pl-4 pr-2' : 'pl-4'} ${
                    windowWidth < 640 ? 'basis-3/4' : // Móviles pequeños: tarjetas más grandes (75% del ancho)
                    windowWidth < 768 ? 'basis-3/4' : // Móviles: tarjetas más grandes (75% del ancho)
                    windowWidth < 1024 ? 'basis-1/3' : // Tablets: 3 por fila
                    windowWidth < 1280 ? 'basis-1/3' : // Desktop pequeño: mantiene 3 por fila
                    'basis-1/4' // Desktop grande: mantiene 4 por fila
                  }`}
                >
                  <div className="aspect-square w-full">
                    <MemberCard member={member} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Se han eliminado los botones de navegación del carrusel */}
          </Carousel>
        </div>
      </div>
    );
  }

  // Grid layout para pocos miembros en pantallas grandes
  return (
    <div className="mt-8 mb-12">
      <h2 className="text-3xl font-black mb-6">Integrantes del grupo</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <div key={member.id} className="aspect-square w-full max-w-[300px]">
            <MemberCard member={member} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente tarjeta para evitar duplicación de código
const MemberCard = ({ member }: { member: GroupMember }) => {
  return (
    <div className="h-full w-full overflow-hidden rounded-[28px]">
      {member.image ? (
        <div className="relative h-full w-full overflow-hidden rounded-[28px] border-0">
          <div className="absolute inset-0 bg-black/60 z-10">
            <div className="flex flex-col justify-between h-full p-6">
              <span className="text-white font-bold text-xl">{member.name}</span>
              <div className="flex flex-wrap gap-2">
                {member.roles.map((role, index) => (
                  <UIBadge key={index} className="bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full">
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
        <Card className="h-full w-full p-6 bg-[#F7F7F7] flex flex-col justify-between rounded-[28px] border-0">
          <span className="font-bold text-xl">{member.name}</span>
          <div className="flex flex-wrap gap-2">
            {member.roles.map((role, index) => (
              <UIBadge key={index} className="bg-white/80 backdrop-blur-md text-black px-4 py-2 rounded-full">
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
