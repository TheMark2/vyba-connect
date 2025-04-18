import React, { useState, useRef } from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ChevronLeft, 
  ChevronRight, 
  Music, 
  Guitar, 
  Mic, 
  Headphones, 
  Piano, 
  Drum,
  CircleHelp,
  SlidersVertical,
  UserRound,
  Music4
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupMember {
  id: string;
  name: string;
  image?: string;
  roles: string[];
}

interface GroupMembersProps {
  members: GroupMember[];
}

// Función para obtener el icono basado en el rol
const getRoleIcon = (role: string) => {
  const lowerRole = role.toLowerCase();
  
  if (lowerRole.includes("guitar") || lowerRole.includes("guitarr")) {
    return <Guitar className="h-16 w-16 stroke-[1.5]" />;
  } else if (lowerRole.includes("vocal") || lowerRole.includes("cantante") || lowerRole.includes("voz")) {
    return <Mic className="h-16 w-16 stroke-[1.5]" />;
  } else if (lowerRole.includes("dj") || lowerRole.includes("productor")) {
    return <Headphones className="h-16 w-16 stroke-[1.5]" />;
  } else if (lowerRole.includes("piano") || lowerRole.includes("tecl")) {
    return <Piano className="h-16 w-16 stroke-[1.5]" />;
  } else if (lowerRole.includes("bater") || lowerRole.includes("drum")) {
    return <Drum className="h-16 w-16 stroke-[1.5]" />;
  } else if (lowerRole.includes("saxo")) {
    return <Music4 className="h-16 w-16 stroke-[1.5]" />;
  } else if (lowerRole.includes("ayudante") || lowerRole.includes("asistente")) {
    return <CircleHelp className="h-16 w-16 stroke-[1.5]" />;
  } else if (lowerRole.includes("técnico") || lowerRole.includes("tecnico") || lowerRole.includes("sonido")) {
    return <SlidersVertical className="h-16 w-16 stroke-[1.5]" />;
  } else {
    return <Music className="h-16 w-16 stroke-[1.5]" />;
  }
};

// Función para clasificar el tipo de rol
const getRoleType = (role: string): string => {
  const lowerRole = role.toLowerCase();
  
  if (lowerRole.includes("guitar") || lowerRole.includes("guitarr")) {
    return "guitar";
  } else if (lowerRole.includes("vocal") || lowerRole.includes("cantante") || lowerRole.includes("voz")) {
    return "vocal";
  } else if (lowerRole.includes("dj") || lowerRole.includes("productor")) {
    return "dj";
  } else if (lowerRole.includes("piano") || lowerRole.includes("tecl")) {
    return "piano";
  } else if (lowerRole.includes("bater") || lowerRole.includes("drum")) {
    return "drum";
  } else if (lowerRole.includes("saxo")) {
    return "saxo";
  } else if (lowerRole.includes("ayudante") || lowerRole.includes("asistente")) {
    return "helper";
  } else if (lowerRole.includes("técnico") || lowerRole.includes("tecnico") || lowerRole.includes("sonido")) {
    return "tech";
  } else {
    return "other";
  }
};

// Función para obtener los iconos de roles únicos
const getRoleIcons = (roles: string[]) => {
  if (!roles || roles.length === 0) {
    return [<Music key="default" className="h-16 w-16 stroke-[1.5]" />];
  }
  
  if (roles.length === 1) {
    return [getRoleIcon(roles[0])];
  }
  
  // Filtrar roles únicos basados en su tipo
  const uniqueRoleTypes: string[] = [];
  const uniqueRoles: string[] = [];
  
  roles.forEach(role => {
    const roleType = getRoleType(role);
    if (!uniqueRoleTypes.includes(roleType)) {
      uniqueRoleTypes.push(roleType);
      uniqueRoles.push(role);
    }
  });
  
  // Si después de filtrar aún hay solo un rol único, mostrar solo ese icono
  if (uniqueRoles.length === 1) {
    return [getRoleIcon(uniqueRoles[0])];
  }
  
  // Si hay múltiples roles únicos, mostrar iconos más pequeños
  return uniqueRoles.map((role, index) => {
    const lowerRole = role.toLowerCase();
    
    if (lowerRole.includes("guitar") || lowerRole.includes("guitarr")) {
      return <Guitar key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    } else if (lowerRole.includes("vocal") || lowerRole.includes("cantante") || lowerRole.includes("voz")) {
      return <Mic key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    } else if (lowerRole.includes("dj") || lowerRole.includes("productor")) {
      return <Headphones key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    } else if (lowerRole.includes("piano") || lowerRole.includes("tecl")) {
      return <Piano key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    } else if (lowerRole.includes("bater") || lowerRole.includes("drum")) {
      return <Drum key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    } else if (lowerRole.includes("saxo")) {
      return <Music4 key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    } else if (lowerRole.includes("ayudante") || lowerRole.includes("asistente")) {
      return <CircleHelp key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    } else if (lowerRole.includes("técnico") || lowerRole.includes("tecnico") || lowerRole.includes("sonido")) {
      return <SlidersVertical key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    } else {
      return <UserRound key={`role-${index}`} className="h-10 w-10 stroke-[1.5]" />;
    }
  });
};

const GroupMembers = ({
  members
}: GroupMembersProps) => {
  const isMobile = useIsMobile();
  const [mobileApi, setMobileApi] = useState<any>(null);
  const [desktopApi, setDesktopApi] = useState<any>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const desktopCarouselRef = useRef<HTMLDivElement>(null);

  const scrollPrevMobile = () => {
    if (mobileApi) mobileApi.scrollPrev();
  };

  const scrollNextMobile = () => {
    if (mobileApi) mobileApi.scrollNext();
  };

  const scrollPrevDesktop = () => {
    if (desktopApi) desktopApi.scrollPrev();
  };

  const scrollNextDesktop = () => {
    if (desktopApi) desktopApi.scrollNext();
  };

  if (!members || members.length === 0) return null;

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold">Integrantes del grupo</h2>
        
        {!isMobile && members.length > 1 && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={scrollPrevDesktop}
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full border border-[#F7F7F7] bg-transparent"
              aria-label="Anterior integrante"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              onClick={scrollNextDesktop}
              variant="secondary" 
              size="icon" 
              className="w-10 h-10 rounded-full border border-[#F7F7F7] bg-transparent"
              aria-label="Siguiente integrante"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Carrusel para dispositivos móviles */}
      {isMobile && (
        <div className="relative w-full" ref={mobileCarouselRef}>
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: false,
              skipSnaps: false,
            }}
            setApi={setMobileApi}
          >
            <CarouselContent className="gap-4">
              {members.map((member) => (
                <CarouselItem
                  key={member.id}
                  className="basis-[55%] sm:basis-[45%] shrink-0"
                >
                  <div className="h-[280px] w-full">
                    <MemberCard member={member} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>


      )}

      {/* Carrusel para escritorio */}
      {!isMobile && (
        <div className="relative w-full" ref={desktopCarouselRef}>
          <Carousel 
            className="w-full" 
            opts={{
              align: "start",
              loop: false,
              skipSnaps: false
            }}
            setApi={setDesktopApi}
          >
            <CarouselContent className="gap-6">
              {members.map((member) => (
                <CarouselItem 
                  key={member.id} 
                  className="shrink-0"
                  style={{ maxWidth: "260px" }}
                >
                  <div className="w-[260px] h-[260px]">
                    <MemberCard member={member} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
};

const MemberCard = ({
  member
}: {
  member: GroupMember;
}) => {
  // Obtener iconos basados en los roles
  const roleIcons = getRoleIcons(member.roles);

  return (
    <Card className="h-full w-full p-8 bg-[#F7F7F7] flex flex-col rounded-3xl border-0">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-wrap gap-2">
          {roleIcons}
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xl">{member.name}</span>
          <span className="text-sm text-[#969494]">
            {member.roles.join(', ')}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default GroupMembers;
