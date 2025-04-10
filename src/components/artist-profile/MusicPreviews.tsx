import React, { useEffect, useState, useRef } from "react";
import { Music, Video, Play, Expand } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface MusicPreview {
  title: string;
  duration: string;
  image?: string;
  hasVideo?: boolean;
}

interface MusicPreviewsProps {
  previews: MusicPreview[];
  artistName: string;
}

const MusicPreviews = ({
  previews,
  artistName
}: MusicPreviewsProps) => {
  const isMobile = useIsMobile();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [useCarousel, setUseCarousel] = useState(isMobile || previews.length > 3);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const detectNavbarVisibility = () => {
      const navbar = document.querySelector('header.sticky') || document.querySelector('header[class*="sticky"]') || document.querySelector('div[class*="sticky"]');
      if (navbar) {
        observerRef.current = new IntersectionObserver(entries => {
          setIsNavbarVisible(entries[0].isIntersecting);
        }, {
          threshold: 0.1
        });
        observerRef.current.observe(navbar);
      }
    };

    const timer = setTimeout(detectNavbarVisibility, 500);
    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      if (!isNavbarVisible) {
        setUseCarousel(false);
        return;
      }

      if (window.innerWidth < 768) {
        setUseCarousel(true);
      } else if (window.innerWidth < 1024) {
        setUseCarousel(previews.length > 2);
      } else if (window.innerWidth < 1280) {
        setUseCarousel(previews.length > 3);
      } else {
        setUseCarousel(previews.length > 3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [previews.length, isNavbarVisible]);

  return <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">Preview</h2>
      
      {previews?.length > 0 && <>
          {useCarousel ? <Carousel opts={{
        align: "start",
        loop: false,
        containScroll: "trimSnaps"
      }} className="w-full">
              <CarouselContent className="-ml-4">
                {previews.map((preview, index) => <CarouselItem key={index} className={`pl-4 ${
                  windowWidth < 640 ? 'basis-[85%]' : // Móvil: mostrar un poco de la siguiente card
                  windowWidth < 768 ? 'basis-[45%]' : // Móviles grandes: mostrar 2 completas y un poco de la siguiente
                  windowWidth < 1024 ? 'basis-1/2' : // Tablets: 2 por fila
                  'basis-1/3' // Desktop: 3 por fila
                }`}>
                    {preview.image ? <ImagePreviewCard preview={preview} artistName={artistName} /> : <NoImagePreviewCard preview={preview} artistName={artistName} />}
                  </CarouselItem>)}
              </CarouselContent>
              {/* Sin botones de navegación */}
            </Carousel> :
      <div className={`flex overflow-x-auto space-x-4 pb-4 ${isNavbarVisible ? 'hidden' : ''}`}>
              {previews.map((preview, index) => <div key={index} className="flex-none w-80">
                  {preview.image ? <ImagePreviewCard preview={preview} artistName={artistName} /> : <NoImagePreviewCard preview={preview} artistName={artistName} />}
                </div>)}
            </div>}
          
          {!useCarousel && isNavbarVisible && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previews.map((preview, index) => <div key={index}>
                  {preview.image ? <ImagePreviewCard preview={preview} artistName={artistName} /> : <NoImagePreviewCard preview={preview} artistName={artistName} />}
                </div>)}
            </div>}
        </>}
    </div>;
};

const ImagePreviewCard = ({
  preview,
  artistName
}: {
  preview: MusicPreview;
  artistName: string;
}) => {
  const handlePlay = () => {
    console.log(`Reproduciendo: ${preview.title}`);
  };

  const handleExpand = () => {
    console.log(`Expandiendo video: ${preview.title}`);
  };

  return <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none">
      <div className="relative aspect-[4/5]">
        <img src={preview.image} alt={preview.title} className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-0"></div>
        
        {preview.hasVideo && <Badge className="absolute top-5 left-5 bg-white text-black font-medium px-4 py-2 rounded-full">
            <Video className="w-4 h-4 mr-1" />
            Video
          </Badge>}
        
        {preview.hasVideo && (
          <Badge 
            className="absolute top-5 right-5 bg-white text-black font-medium px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={handleExpand}
          >
            <Expand className="w-4 h-4 mr-1" />
            Expandir
          </Badge>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-7 text-white transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-xl font-black line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-white/80 mb-5">{artistName}</p>
        </div>

        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10 bg-white hover:bg-white/90 text-black"
          onClick={handlePlay}
        >
          <Play className="h-5 w-5" />
        </Button>
        
        <div className="absolute bottom-7 right-7 z-10">
          <span className="text-sm font-medium text-white bg-black/50 px-2 py-1 rounded-md">{preview.duration}</span>
        </div>
      </div>
    </Card>;
};

const NoImagePreviewCard = ({
  preview,
  artistName
}: {
  preview: MusicPreview;
  artistName: string;
}) => {
  const handlePlay = () => {
    console.log(`Reproduciendo: ${preview.title}`);
  };

  return <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40">
      <div className="relative aspect-[4/5] flex flex-col items-center justify-center p-7">
        <div className="mb-5 opacity-80 group-hover:opacity-40 transition-opacity duration-300">
          <Music className="w-20 h-20 stroke-1" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-7 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-xl font-black line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{artistName}</p>
        </div>

        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute bottom-7 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10"
          onClick={handlePlay}
        >
          <Play className="h-5 w-5" />
        </Button>
        
        <div className="absolute bottom-7 right-7 z-10">
          <span className="text-sm font-medium dark:text-white bg-gray-200 dark:bg-black/50 px-2 py-1 rounded-md">{preview.duration}</span>
        </div>
      </div>
    </Card>;
};

export default MusicPreviews;
