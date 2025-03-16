
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
export type CardType = "género" | "tipo";
interface ArtistCardProps {
  type: CardType;
  name: string;
  artistCount: number;
  rating: number;
  artistAvatars?: string[];
  isReversed?: boolean;
  onClick?: () => void;
}
const ArtistCard = ({
  type,
  name,
  artistCount,
  rating,
  artistAvatars = [],
  isReversed = false,
  onClick
}: ArtistCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Limitar a mostrar máximo 3 avatares y calcular los extras
  const MAX_VISIBLE_AVATARS = 3;
  const visibleAvatars = artistAvatars.slice(0, MAX_VISIBLE_AVATARS);
  const extraAvatars = artistAvatars.length > MAX_VISIBLE_AVATARS ? artistAvatars.length - MAX_VISIBLE_AVATARS : 0;
  
  // Nuevo diseño según la imagen proporcionada
  return (
    <div 
      className={`flex items-center justify-between bg-[#F5F1EB] px-6 py-4 rounded-full min-w-[280px] mx-3 transition-all duration-300 cursor-pointer`}
      onClick={onClick} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? '#EAE6E0' : '#F5F1EB',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div className="flex flex-col">
        <span className="text-gray-500 text-xs mb-1">{type}</span>
        <span className="font-bold text-base">{name}</span>
      </div>
      
      <div className="flex relative -space-x-2">
        {visibleAvatars.map((avatar, index) => (
          <Avatar key={index} className="border-2 border-[#F5F1EB] h-7 w-7" style={{
            zIndex: MAX_VISIBLE_AVATARS - index // Asegurando que los avatares de la izquierda estén por encima
          }}>
            <AvatarImage src={avatar} alt={`Artista ${index + 1}`} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        
        {extraAvatars > 0 && (
          <div 
            className="flex items-center justify-center h-7 w-7 text-xs font-medium text-white bg-blue-500 border-2 border-[#F5F1EB] rounded-full" 
            style={{
              zIndex: MAX_VISIBLE_AVATARS + 1 // El contador siempre estará por encima de todos
            }}
          >
            +{extraAvatars}
          </div>
        )}
      </div>
    </div>
  );
};
export default ArtistCard;
