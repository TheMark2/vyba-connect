
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Limitar a mostrar máximo 3 avatares y calcular los extras
  const MAX_VISIBLE_AVATARS = 3;
  const visibleAvatars = artistAvatars.slice(0, MAX_VISIBLE_AVATARS);
  const extraAvatars = artistAvatars.length > MAX_VISIBLE_AVATARS ? artistAvatars.length - MAX_VISIBLE_AVATARS : 0;
  
  // Configuración para el carrusel
  const carouselOptions = {
    loop: true,
    align: "start",
    inViewThreshold: 0.8,
  };
  
  // Función para actualizar el slide actual
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };
  
  // Nuevo diseño según la imagen proporcionada y el carrusel solicitado
  return (
    <div 
      className={`flex items-center justify-between bg-[#F5F1EB] dark:bg-[#444341] px-6 py-4 rounded-full min-w-[280px] mx-2 transition-all duration-300 cursor-pointer`}
      onClick={onClick} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered 
          ? (document.documentElement.classList.contains('dark') ? '#575654' : '#EAE6E0')
          : (document.documentElement.classList.contains('dark') ? '#444341' : '#F5F1EB'),
        transition: 'background-color 0.3s ease'
      }}
    >
      <div className="flex flex-col">
        <span className="font-bold text-base dark:text-white">{name}</span>
      </div>
      
      <div className="flex relative">
        <div className="relative w-auto" data-carousel>
          <Carousel 
            opts={carouselOptions} 
            className="w-auto"
            onSlideChange={handleSlideChange}
            ref={carouselRef}
          >
            <CarouselContent className="transition-transform duration-500 ease-in-out">
              {visibleAvatars.map((avatar, index) => (
                <CarouselItem key={index} className="transition-all duration-500 h-7 min-w-max p-0">
                  <Avatar className="border-2 border-[#F5F1EB] dark:border-[#444341] h-7 w-7">
                    <AvatarImage 
                      src={avatar} 
                      alt={`Artista ${index + 1}`} 
                      className="transition-all duration-500 animate-image-slide" 
                    />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-white dark:bg-vyba-dark-secondary shadow-md rounded-full opacity-70 hover:opacity-100">
              <ChevronLeft className="h-3 w-3" />
            </CarouselPrevious>
            
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-white dark:bg-vyba-dark-secondary shadow-md rounded-full opacity-70 hover:opacity-100">
              <ChevronRight className="h-3 w-3" />
            </CarouselNext>
            
            <div className="carousel-pagination absolute -bottom-4 left-0 right-0 flex justify-center gap-1 mt-1">
              {visibleAvatars.map((_, index) => (
                <span 
                  key={index}
                  className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                    currentSlide === index ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </Carousel>
        </div>
        
        {extraAvatars > 0 && (
          <div 
            className="flex items-center justify-center h-7 w-7 text-xs font-medium text-white bg-blue-500 border-2 border-[#F5F1EB] dark:border-[#444341] rounded-full ml-1" 
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
