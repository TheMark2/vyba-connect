
import React from "react";
import { Music, Video } from "lucide-react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">Preview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {previews?.map((preview, index) => {
          // Determinamos el tipo de tarjeta basado en las propiedades
          if (preview.image) {
            return (
              <ImagePreviewCard 
                key={index}
                preview={preview}
                artistName={artistName}
              />
            );
          } else {
            return (
              <NoImagePreviewCard 
                key={index}
                preview={preview}
                artistName={artistName}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

// Tarjeta para previsualizaciones con imagen
const ImagePreviewCard = ({ preview, artistName }: { preview: MusicPreview, artistName: string }) => {
  return (
    <Card className="overflow-hidden rounded-3xl relative group cursor-pointer border-none">
      <div className="relative aspect-square">
        {/* Imagen de fondo */}
        <img 
          src={preview.image} 
          alt={preview.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Degradado oscuro de abajo hacia arriba */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        
        {/* Badge de video si es aplicable */}
        {preview.hasVideo && (
          <Badge className="absolute top-4 left-4 bg-white/90 text-black font-medium px-3 py-1 rounded-full">
            <Video className="w-4 h-4 mr-1" />
            Video
          </Badge>
        )}
        
        {/* Contenido de texto en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-lg font-bold line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-white/80">{artistName}</p>
          
          {/* Duración en la esquina inferior derecha */}
          <div className="absolute bottom-5 right-5">
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
      <div className="relative aspect-square flex flex-col items-center justify-center p-5">
        {/* Icono de música en el centro */}
        <div className="mb-5 opacity-80">
          <Music className="w-16 h-16 stroke-1" />
        </div>
        
        {/* Contenido de texto en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-lg font-bold line-clamp-1">{preview.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{artistName}</p>
          
          {/* Duración en la esquina inferior derecha */}
          <div className="absolute bottom-5 right-5">
            <span className="text-sm font-medium">{preview.duration}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MusicPreviews;
