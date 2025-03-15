
import { Star } from "lucide-react";
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
  // Limitar a mostrar máximo 7 avatares
  const displayAvatars = artistAvatars.slice(0, 7);
  
  return (
    <div className={`flex flex-col ${isReversed ? 'items-end' : 'items-start'} bg-[#F5F1EB] p-6 rounded-3xl min-w-[400px] mx-3 shadow-sm hover:shadow-md transition-all duration-300 relative`}>
      {/* Rating en la esquina superior derecha */}
      <div className="absolute top-6 right-6 flex items-center gap-1">
        <span className="font-bold text-2xl">{rating.toFixed(1)}</span>
      </div>
      
      {/* Badge de tipo */}
      <Badge variant="outline" className="bg-white text-black mb-4 py-1.5 px-6 text-sm rounded-full">
        {type === "género" ? "Género" : "Tipo"}
      </Badge>
      
      {/* Nombre de la categoría */}
      <h3 className="font-bold text-3xl mb-3">{name}</h3>
      
      {/* Conteo de artistas y avatares */}
      <div className="flex items-center gap-4 mt-2">
        <span className="text-gray-500 text-xl">{artistCount} artistas</span>
        
        {/* Avatares de los artistas */}
        <div className="flex -space-x-3">
          {displayAvatars.map((avatar, index) => (
            <Avatar key={index} className="border-2 border-[#F5F1EB] h-10 w-10">
              <AvatarImage src={avatar} alt={`Artista ${index + 1}`} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
