
import React from "react";
import { Play } from "lucide-react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";

interface MusicPreview {
  title: string;
  duration: string;
  image: string;
}

interface MusicPreviewsProps {
  previews: MusicPreview[];
  artistName: string;
}

const MusicPreviews = ({ previews, artistName }: MusicPreviewsProps) => {
  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">Preview</h2>
      <div className="space-y-4">
        {previews?.map((preview, index) => (
          <Card 
            key={index} 
            className="group border-none overflow-hidden p-2 bg-secondary dark:bg-vyba-dark-secondary/70 hover:bg-opacity-80 transition-colors duration-200 cursor-pointer hover:bg-secondary/90 dark:hover:bg-vyba-dark-secondary/90 relative"
          >
            <CardContent className="p-0">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center">
                  {/* Nuevo efecto de blur mejorado */}
                  <div 
                    className="absolute inset-0 w-14 h-14 blur-xl opacity-30 scale-150 z-0"
                    style={{ 
                      backgroundImage: `url(${preview.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: 'scale(1.5)',
                      filter: 'blur(12px)',
                    }}
                  ></div>
                  
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden z-10">
                    {/* Main image */}
                    <img 
                      src={preview.image} 
                      alt={preview.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 text-primary-foreground ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-base font-bold">{preview.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{artistName}</p>
                </div>
                
                <div className="text-right mr-4">
                  <span className="text-sm font-medium">{preview.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MusicPreviews;
