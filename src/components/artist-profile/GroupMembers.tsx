
import React, { useEffect, useState } from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import Image from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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

const GroupMembers = ({
  members
}: GroupMembersProps) => {
  const isMobile = useIsMobile();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [useCarousel, setUseCarousel] = useState(isMobile || members.length > 4);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      if (window.innerWidth < 768) {
        setUseCarousel(true);
      } else if (window.innerWidth < 1024) {
        setUseCarousel(members.length > 2);
      } else if (window.innerWidth < 1280) {
        setUseCarousel(members.length > 3);
      } else {
        setUseCarousel(members.length > 4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [members.length]);

  if (!members || members.length === 0) return null;

  if (useCarousel) {
    return <div className="mt-8 mb-12">
        <h2 className="text-3xl font-bold mb-6">Integrantes del grupo</h2>
        
        <div className={isMobile ? 'relative w-full' : 'relative w-full'}>
          <div className={isMobile ? 'mx-[-1.5rem]' : ''}>
            <Carousel className="w-full" opts={{
              align: "center",
              loop: false,
              skipSnaps: false
            }}>
              <CarouselContent className={`${isMobile ? '-ml-1 pl-6' : '-ml-6'} gap-3`}>
                {members.map((member, index) => (
                  <CarouselItem 
                    key={member.id} 
                    className={`
                      ${isMobile ? 'pl-2 pr-2' : 'pl-6'} 
                      ${isMobile ? 'basis-4/5' : 'basis-1/3'}
                      ${index === members.length - 1 ? 'mr-6' : ''}
                    `}
                  >
                    <div className="w-full h-[200px]">
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
      <h2 className="text-3xl font-black mb-6">Integrantes del grupo</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map(member => <div key={member.id} className="h-[420px] max-w-[300px]">
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
              <span className="text-white font-bold text-xl">{member.name}</span>
              <div className="flex flex-wrap gap-2">
                {member.roles.map((role, index) => <UIBadge key={index} className="bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full border-0 hover:bg-white/30">
                    {role}
                  </UIBadge>)}
              </div>
            </div>
          </div>
          <img src={member.image} alt={`${member.name} - integrante`} className="w-full h-full object-cover" />
        </div> : <Card className="h-full w-full p-6 bg-[#F7F7F7] flex flex-col justify-between rounded-[28px] border-0">
          <span className="font-bold text-xl">{member.name}</span>
          <div className="flex flex-wrap gap-2">
            {member.roles.map((role, index) => <UIBadge key={index} className="bg-white/80 backdrop-blur-md text-black px-4 py-2 rounded-full border-0 hover:bg-white/80">
                {role}
              </UIBadge>)}
          </div>
        </Card>}
    </div>;
};

export default GroupMembers;
