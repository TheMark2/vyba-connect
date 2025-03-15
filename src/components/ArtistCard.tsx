
import { Star } from "lucide-react";

interface ArtistCardProps {
  name: string;
  role: string;
  rating: number;
  isReversed?: boolean;
}

const ArtistCard = ({ name, role, rating, isReversed = false }: ArtistCardProps) => {
  return (
    <div className={`flex ${isReversed ? 'flex-row-reverse' : 'flex-row'} items-center gap-3 bg-[#F5F1EB] p-4 rounded-xl min-w-[300px] mx-2`}>
      <div className="min-w-14 flex items-center justify-center">
        <div className="font-bold text-lg">{rating}</div>
      </div>
      <div className="flex-1">
        <div className={`${isReversed ? 'text-right' : 'text-left'}`}>
          <div className="text-xs uppercase font-medium text-gray-500">{role}</div>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-sm text-gray-600">{role} para todo tipo de eventos</p>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
