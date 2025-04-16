
import React, { useState, useRef } from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, Music, Guitar, Mic, Headphones, Piano, Drum } from "lucide-react";
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
  } else {
    return <Music className="h-16 w-16 stroke-[1.5]" />;
  }
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
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-full border border-[#F7F7F7] bg-transparent"
              aria-label="Anterior integrante"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              onClick={scrollNextDesktop}
              variant="outline" 
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
          <div className="mx-[-1.5rem]">
            <Carousel 
              className="w-full" 
              opts={{
                align: "center",
                loop: false,
                skipSnaps: false
              }}
              setApi={setMobileApi}
            >
              <CarouselContent className="px-0 gap-6">
                {members.map((member, index) => (
                  <CarouselItem 
                    key={member.id} 
                    className={`
                      ${index === 0 ? 'pl-6' : ''} 
                      ${index === members.length - 1 ? ' pr-6' : ''} 
                      basis-4/5 shrink-0
                    `}
                  >
                    <div className="w-[260px] h-[260px]">
                      <MemberCard member={member} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
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
  // Determinar el icono basado en el primer rol
  const roleIcon = member.roles.length > 0 ? getRoleIcon(member.roles[0]) : <Music className="h-16 w-16 stroke-[1.5]" />;

  return (
    <Card className="h-full w-full p-8 bg-[#F7F7F7] flex flex-col rounded-3xl border-0">
      <div className="flex flex-col h-full justify-between">
        <div>
          {roleIcon}
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xl">{member.name}</span>
          <span className="text-sm text-[#969494]">{member.roles[0]}</span>
        </div>
      </div>
    </Card>
  );
};

export default GroupMembers;
