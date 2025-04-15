
import React, { useEffect, useState, useRef } from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import Image from "@/components/ui/image";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const useCarousel = true;
  const [api, setApi] = useState<any>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (api) api.scrollPrev();
  };

  const scrollNext = () => {
    if (api) api.scrollNext();
  };

  if (!members || members.length === 0) return null;

  if (useCarousel) {
    return <div className="mt-8 mb-12" ref={carouselRef}>
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
                      ${isMobile ? 'pl-2 pr-2 basis-4/5' : 'pl-4 pr-2'}
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
      </div>;
  }

  return <div className="mt-8 mb-12">
      <h2 className="text-3xl font-semibold mb-6">Integrantes del grupo</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map(member => <div key={member.id} className="h-[260px] w-[260px] max-w-[260px]">
            <MemberCard member={member} />
          </div>)}
      </div>
    </div>;
};

const MemberCard = ({
  member
}: {
  member: GroupMember;
}) => {
  return <div className="h-full w-full overflow-hidden rounded-[28px]">
      {member.image ? <div className="relative h-full w-full overflow-hidden rounded-[28px] border-0">
          <div className="absolute inset-0 bg-black/60 z-10">
            <div className="flex flex-col justify-between h-full p-6">
              <span className="text-white font-medium text-xl">{member.name}</span>
              <div className="flex flex-wrap gap-2">
                {member.roles.map((role, index) => <UIBadge key={index} className="bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full border-0 hover:bg-white/30">
                    {role}
                  </UIBadge>)}
              </div>
            </div>
          </div>
          <img src={member.image} alt={`${member.name} - integrante`} className="w-full h-full object-cover" />
        </div> : <Card className="h-full w-full p-6 bg-[#F7F7F7] flex flex-col justify-between rounded-[28px] border-0">
          <span className="font-medium text-xl">{member.name}</span>
          <div className="flex flex-wrap gap-2">
            {member.roles.map((role, index) => <UIBadge key={index} className="bg-white/80 backdrop-blur-md text-black px-4 py-2 rounded-full border-0 hover:bg-white/80 font-normal">
                {role}
              </UIBadge>)}
          </div>
        </Card>}
    </div>;
};

export default GroupMembers;
