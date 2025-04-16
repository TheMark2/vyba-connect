
import React, { useEffect, useState, useRef } from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const GroupMembers = ({
  members
}: GroupMembersProps) => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<any>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (api) api.scrollPrev();
  };

  const scrollNext = () => {
    if (api) api.scrollNext();
  };

  if (!members || members.length === 0) return null;

  return (
    <div className="mt-8 mb-12" ref={carouselRef}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold">Integrantes del grupo</h2>
        
        {!isMobile && members.length > 1 && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={scrollPrev}
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-full border border-[#F7F7F7] bg-transparent"
              aria-label="Anterior integrante"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              onClick={scrollNext}
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
      
      <div className={isMobile ? 'relative w-full' : 'relative w-full'}>
        <div className={isMobile ? 'mx-[-1.5rem]' : ''}>
          <Carousel 
            className="w-full" 
            opts={{
              align: "center",
              loop: false,
              skipSnaps: false
            }}
            setApi={setApi}
          >
            <CarouselContent className="px-0 gap-6">
              {members.map((member, index) => (
                <CarouselItem 
                  key={member.id} 
                  className={`
                    ${isMobile 
                      ? (index === 0 ? 'pl-6' : '') + 
                        (index === members.length - 1 ? ' pr-6' : '') 
                      : ''
                    } 
                    ${isMobile ? 'basis-4/5' : 'pl-4 pr-2'}
                    shrink-0
                  `}
                  style={{ maxWidth: 260 }}
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
    </div>
  );
};

const MemberCard = ({
  member
}: {
  member: GroupMember;
}) => {
  return (
    <Card className="h-full w-full p-6 bg-[#F7F7F7] flex flex-col justify-between rounded-[28px] border-0">
      <span className="font-medium text-xl">{member.name}</span>
      <div className="flex flex-wrap gap-2">
        {member.roles.map((role, index) => (
          <UIBadge 
            key={index} 
            className="bg-white/80 backdrop-blur-md text-black px-4 py-2 rounded-full border-0 hover:bg-white/80 font-normal"
          >
            {role}
          </UIBadge>
        ))}
      </div>
    </Card>
  );
};

export default GroupMembers;
