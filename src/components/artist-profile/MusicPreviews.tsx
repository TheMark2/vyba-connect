import React, { useEffect, useState, useRef } from "react";
import { Music, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
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

  // Crear una referencia para el observador de intersección
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    // Función para detectar si el navbar es visible o no
    const detectNavbarVisibility = () => {
      // Intentar seleccionar el navbar (que suele ser el elemento sticky en la parte superior)
      const navbar = document.querySelector('header.sticky') || document.querySelector('header[class*="sticky"]') || document.querySelector('div[class*="sticky"]');
      if (navbar) {
        // Configurar el observador de intersección para el navbar
        observerRef.current = new IntersectionObserver(entries => {
          // Si el navbar no es visible (ha salido de la vista), actualizar el estado
          setIsNavbarVisible(entries[0].isIntersecting);
        }, {
          threshold: 0.1
        });

        // Empezar a observar el navbar
        observerRef.current.observe(navbar);
      }
    };

    // Llamar a la función después de un pequeño retraso para asegurar que el DOM esté listo
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

      // Cuando el navbar no es visible, no usamos carrusel
      if (!isNavbarVisible) {
        setUseCarousel(false);
        return;
      }

      // Solo aplicamos lógica de carrusel si el navbar es visible
      if (window.innerWidth < 768) {
        // Móvil siempre carrusel cuando el navbar es visible
        setUseCarousel(true);
      } else if (window.innerWidth < 1024) {
        // Tablet: carrusel si hay más de 2 elementos y el navbar es visible
        setUseCarousel(previews.length > 2);
      } else if (window.innerWidth < 1280) {
        // Desktop pequeño: carrusel si hay más de 3 elementos y el navbar es visible
        setUseCarousel(previews.length > 3);
      } else {
        // Desktop grande: carrusel si hay más de 3 elementos y el navbar es visible
        setUseCarousel(previews.length > 3);
      }
    };

    // Ejecutar al montar y cuando cambia el tamaño de la ventana o la visibilidad del navbar
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
                {previews.map((preview, index) => <CarouselItem key={index} className={`pl-4 ${windowWidth < 640 ? 'basis-full' :
          // Móviles pequeños: tarjetas más grandes
          windowWidth < 768 ? 'basis-full' :
          // Móviles: tarjetas más grandes
          windowWidth < 1024 ? 'basis-1/2' :
          // Tablets: 2 por fila
          'basis-1/3' // Desktop: 3 por fila
          }`}>
                    {preview.image ? <ImagePreviewCard preview={preview} artistName={artistName} /> : <NoImagePreviewCard preview={preview} artistName={artistName} />}
                  </CarouselItem>)}
              </CarouselContent>
              {/* Sin botones de navegación */}
            </Carousel> :
      // Cuando el navbar no es visible, mostrar en una sola fila con scroll horizontal
      <div className={`flex overflow-x-auto space-x-4 pb-4 ${isNavbarVisible ? 'hidden' : ''}`}>
              {previews.map((preview, index) => <div key={index} className="flex-none w-80">
                  {preview.image ? <ImagePreviewCard preview={preview} artistName={artistName} /> : <NoImagePreviewCard preview={preview} artistName={artistName} />}
                </div>)}
            </div>}
          
          {/* Vista de cuadrícula para pantallas grandes con pocos elementos cuando el navbar es visible */}
          {!useCarousel && isNavbarVisible && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previews.map((preview, index) => <div key={index}>
                  {preview.image ? <ImagePreviewCard preview={preview} artistName={artistName} /> : <NoImagePreviewCard preview={preview} artistName={artistName} />}
                </div>)}
            </div>}
        </>}
    </div>;
};

// Tarjeta para previsualizaciones con imagen
const ImagePreviewCard = ({
  preview,
  artistName
}: {
  preview: MusicPreview;
  artistName: string;
}) => {
  return <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none">
      <div className="relative aspect-[4/5]">
        {/* Imagen de fondo */}
        <img src={preview.image} alt={preview.title} className="w-full h-full object-cover" />
        
        {/* Degradado oscuro de abajo hacia arriba - más pronunciado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        
        {/* Badge de video si es aplicable - sin opacidad y con padding ajustado */}
        {preview.hasVideo && <Badge className="absolute top-5 left-5 bg-white text-black font-medium px-4 py-2 rounded-full">
            <Video className="w-4 h-4 mr-1" />
            Video
          </Badge>}
        
        {/* Contenido de texto en la parte inferior - más padding */}
        <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
          <h3 className="text-xl font-black line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-white/80 mb-5">{artistName}</p>
          
          {/* Duración en la esquina inferior derecha - mejor separada */}
          <div className="absolute bottom-7 right-7">
            <span className="text-sm font-medium">{preview.duration}</span>
          </div>
        </div>
      </div>
    </Card>;
};

// Tarjeta para previsualizaciones sin imagen
const NoImagePreviewCard = ({
  preview,
  artistName
}: {
  preview: MusicPreview;
  artistName: string;
}) => {
  return <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40">
      <div className="relative aspect-[4/5] flex flex-col items-center justify-center p-7">
        {/* Icono de música en el centro */}
        <div className="mb-5 opacity-80">
          <Music className="w-20 h-20 stroke-1" />
        </div>
        
        {/* Contenido de texto en la parte inferior - más padding */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <h3 className="text-xl font-black line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{artistName}</p>
          
          {/* Duración en la esquina inferior derecha - mejor separada */}
          <div className="absolute bottom-7 right-7">
            <span className="text-sm font-medium">{preview.duration}</span>
          </div>
        </div>
      </div>
    </Card>;
};
export default MusicPreviews;