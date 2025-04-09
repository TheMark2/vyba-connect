
import React from "react";
import { Music, Video } from "lucide-react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
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

const MusicPreviews = ({ previews, artistName }: MusicPreviewsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">Preview</h2>
      
      {previews?.length > 0 && (
        <>
          {isMobile ? (
            // Vista de carrusel para móviles (sin flechas de navegación)
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {previews.map((preview, index) => (
                  <CarouselItem 
                    key={index} 
                    className="pl-4 basis-full"
                  >
                    {preview.image ? (
                      <ImagePreviewCard 
                        preview={preview}
                        artistName={artistName}
                      />
                    ) : (
                      <NoImagePreviewCard 
                        preview={preview}
                        artistName={artistName}
                      />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            // Vista de cuadrícula para pantallas grandes
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previews.map((preview, index) => (
                <div key={index}>
                  {preview.image ? (
                    <ImagePreviewCard 
                      preview={preview}
                      artistName={artistName}
                    />
                  ) : (
                    <NoImagePreviewCard 
                      preview={preview}
                      artistName={artistName}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Tarjeta para previsualizaciones con imagen
const ImagePreviewCard = ({ preview, artistName }: { preview: MusicPreview, artistName: string }) => {
  return (
    <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none">
      <div className="relative aspect-[4/5]">
        {/* Imagen de fondo */}
        <img 
          src={preview.image} 
          alt={preview.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Degradado oscuro de abajo hacia arriba - más pronunciado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        
        {/* Badge de video si es aplicable - sin opacidad y con padding ajustado */}
        {preview.hasVideo && (
          <Badge className="absolute top-5 left-5 bg-white text-black font-medium px-4 py-2 rounded-full">
            <Video className="w-4 h-4 mr-1" />
            Video
          </Badge>
        )}
        
        {/* Contenido de texto en la parte inferior - más padding */}
        <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
          <h3 className="text-lg font-bold line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-white/80 mb-5">{artistName}</p>
          
          {/* Duración en la esquina inferior derecha - mejor separada */}
          <div className="absolute bottom-7 right-7">
            <span className="text-sm font-medium">{preview.duration}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Tarjeta para previsualizaciones sin imagen
const NoImagePreviewCard = ({ preview, artistName }: { preview: MusicPreview, artistName: string }) => {
  return (
    <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40">
      <div className="relative aspect-[4/5] flex flex-col items-center justify-center p-7">
        {/* Icono de música en el centro */}
        <div className="mb-5 opacity-80">
          <Music className="w-20 h-20 stroke-1" />
        </div>
        
        {/* Contenido de texto en la parte inferior - más padding */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <h3 className="text-lg font-bold line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{artistName}</p>
          
          {/* Duración en la esquina inferior derecha - mejor separada */}
          <div className="absolute bottom-7 right-7">
            <span className="text-sm font-medium">{preview.duration}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MusicPreviews;
