
import React, { useState } from "react";
import { Heart, Flag, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext 
} from "@/components/ui/carousel";

interface ArtistBannerProps {
  artist: {
    name: string;
    type: string;
    images: string[];
    coverImage: string;
  };
  onFavorite: () => void;
  onReport: () => void;
  onShare: () => void;
}

const ArtistBanner = ({ artist, onFavorite, onReport, onShare }: ArtistBannerProps) => {
  const isMobile = useIsMobile();
  const [showCarousel, setShowCarousel] = useState(false);

  // Imágenes de alta calidad para el carrusel
  const highQualityImages = [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070",
    "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070",
    "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?q=80&w=2070"
  ];

  return (
    <div 
      className="relative w-full h-[95vh] md:h-[calc(80vh)] overflow-hidden rounded-[25px] lg:rounded-[35px] mb-12 group"
      onMouseEnter={() => setShowCarousel(true)}
      onMouseLeave={() => setShowCarousel(false)}
    >
      {/* Blurred background image - Capa base */}
      <div className="absolute inset-0 w-full h-full overflow-visible flex justify-center items-center transition-opacity duration-300" 
        style={{
          zIndex: 0,
          opacity: showCarousel ? 0 : 1
        }}>
        <div className="absolute w-[120%] h-[120%] opacity-70">
          <img src={artist.coverImage} alt="" className="w-full h-full object-cover scale-150 filter blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>          

      {/* Main Banner Image - Capa principal */}
      <div 
        className={`relative z-10 w-full h-full transition-opacity duration-300 ${showCarousel ? 'opacity-0' : 'opacity-100'}`}
      >
        <img 
          src={artist.coverImage} 
          alt={`${artist.name} portada`} 
          className="w-full h-full object-cover rounded-[25px] lg:rounded-[35px]" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      
      {/* Carousel view that appears on hover */}
      <div 
        className={`absolute inset-0 z-20 transition-opacity duration-300 ${showCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {highQualityImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="w-full h-full relative flex items-center justify-center">
                  <img 
                    src={image} 
                    alt={`${artist.name} imagen ${index + 1}`}
                    className="w-full h-full object-contain max-h-[90vh] md:max-h-[70vh] rounded-[25px] lg:rounded-[35px]"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className={`absolute left-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white transition-all duration-200 ${showCarousel ? 'opacity-100' : 'opacity-0'}`}>
            <ChevronLeft className="h-6 w-6 text-black" />
          </CarouselPrevious>
          
          <CarouselNext className={`absolute right-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white transition-all duration-200 ${showCarousel ? 'opacity-100' : 'opacity-0'}`}>
            <ChevronRight className="h-6 w-6 text-black" />
          </CarouselNext>
        </Carousel>
      </div>
      
      {/* Buttons in top right corner */}
      <div className={`absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-2 z-30 transition-opacity duration-300 ${showCarousel ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full" onClick={onFavorite}>
          <Heart className="h-5 w-5 text-black dark:text-white" />
        </Button>
        <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full" onClick={onReport}>
          <Flag className="h-5 w-5 text-black dark:text-white" />
        </Button>
        <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full" onClick={onShare}>
          <Share2 className="h-5 w-5 text-black dark:text-white" />
        </Button>
      </div>
      
      {/* Artist info overlay */}
      {isMobile ? (
        <div className={`absolute bottom-12 left-5 right-0 flex flex-col items-start z-30 transition-opacity duration-300 ${showCarousel ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="rounded-full overflow-hidden mb-4 w-24 h-24">
            <img src={artist.images[0]} alt={artist.name} className="w-full h-full object-cover rounded-full" />
          </div>
          
          <div className="text-white space-y-2 max-w-[85%]">
            <h1 className="text-2xl font-black truncate">{artist.name}</h1>
            <p className="text-lg opacity-90 line-clamp-2">{artist.type}</p>
          </div>
        </div>
      ) : (
        <div className={`absolute bottom-12 left-5 md:left-10 lg:left-14 flex items-center z-30 transition-opacity duration-300 ${showCarousel ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="rounded-full overflow-hidden mr-4 md:mr-6 w-24 h-24 md:w-32 md:h-32">
            <img src={artist.images[0]} alt={artist.name} className="w-full h-full object-cover rounded-full" />
          </div>
          
          <div className="text-white space-y-4 max-w-[80%]">
            <h1 className="text-3xl md:text-5xl font-black truncate">{artist.name}</h1>
            <p className="text-xl md:text-2xl opacity-90 line-clamp-2">{artist.type}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistBanner;
