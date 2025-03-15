
import { Star } from "lucide-react";

interface ArtistCardProps {
  name: string;
  role: string;
  rating: number;
  isReversed?: boolean;
}

const ArtistCard = ({ name, role, rating, isReversed = false }: ArtistCardProps) => {
  return (
    <div className={`flex ${isReversed ? 'flex-row-reverse' : 'flex-row'} items-center gap-4 bg-[#F5F1EB] p-5 rounded-2xl min-w-[340px] mx-3 shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className="min-w-16 flex items-center justify-center">
        <div className="font-bold text-xl">{rating}</div>
      </div>
      <div className="flex-1">
        <div className={`${isReversed ? 'text-right' : 'text-left'}`}>
          <div className="text-sm uppercase font-medium text-gray-500">{role}</div>
          <h3 className="font-bold text-xl">{name}</h3>
          <p className="text-sm text-gray-600">{role} para todo tipo de eventos</p>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
