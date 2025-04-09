
import React from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import Image from "@/components/ui/image";
import { Card } from "@/components/ui/card";

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
  if (!members || members.length === 0) return null;

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-3xl font-black mb-6">Integrantes del grupo</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {members.map((member) => (
          <div key={member.id} className="overflow-hidden rounded-xl">
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
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
