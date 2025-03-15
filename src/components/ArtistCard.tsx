import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export type CardType = "género" | "tipo";
interface ArtistCardProps {
  type: CardType;
  name: string;
  artistCount: number;
  rating: number;
  artistAvatars?: string[];
  isReversed?: boolean;
}
const ArtistCard = ({
  type,
  name,
  artistCount,
  rating,
  artistAvatars = [],
  isReversed = false
}: ArtistCardProps) => {
  // Limitar a mostrar máximo 3 avatares y calcular los extras
  const MAX_VISIBLE_AVATARS = 3;
  const visibleAvatars = artistAvatars.slice(0, MAX_VISIBLE_AVATARS);
  const extraAvatars = artistAvatars.length > MAX_VISIBLE_AVATARS ? artistAvatars.length - MAX_VISIBLE_AVATARS : 0;
  return <div className={`flex flex-col items-start bg-[#F5F1EB] p-6 rounded-3xl min-w-[400px] mx-3 transition-all duration-300 relative`}>
      {/* Rating en la esquina superior derecha */}
      <div className="absolute top-6 right-6 flex items-center gap-1">
        <span className="font-bold text-base">{rating.toFixed(1)}</span>
      </div>
      
      {/* Badge de tipo */}
      <Badge variant="outline" className="bg-white text-black mb-3 py-3 px-6 text-sm rounded-full border-0">
        {type === "género" ? "Género" : "Tipo"}
      </Badge>
      
      {/* Nombre de la categoría */}
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      
      {/* Conteo de artistas y avatares */}
      <div className="flex items-center gap-4">
        <span className="text-gray-900 text-base font-medium">{artistCount} artistas</span>
        
        {/* Avatares de los artistas */}
        <div className="flex relative">
          {visibleAvatars.map((avatar, index) => <Avatar key={index} className="border-2 border-[#F5F1EB] h-7 w-7 -ml-2 first:ml-0" style={{
          zIndex: index
        }}>
              <AvatarImage src={avatar} alt={`Artista ${index + 1}`} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>)}
          
          {extraAvatars > 0 && <div className="flex items-center justify-center h-7 w-7 text-xs font-medium text-white bg-gray-700 border-2 border-[#F5F1EB] rounded-full -ml-2" style={{
          zIndex: MAX_VISIBLE_AVATARS
        }}>
              +{extraAvatars}
            </div>}
        </div>
      </div>
    </div>;
};
export default ArtistCard;