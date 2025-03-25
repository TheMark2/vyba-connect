
import React from "react";
import { Play } from "lucide-react";

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
          <div 
            key={index} 
            className="group flex items-center gap-4 p-2 bg-secondary dark:bg-vyba-dark-secondary/70 rounded-2xl hover:bg-opacity-80 transition-colors duration-200 cursor-pointer hover:bg-secondary/90 dark:hover:bg-vyba-dark-secondary/90 relative"
          >
            <div className="relative flex items-center">
              {/* Blurred side image - eliminado el efecto hover */}
              <div 
                className="absolute w-14 h-14 bg-cover bg-center blur-xl opacity-40 rounded-md" 
                style={{ 
                  backgroundImage: `url(${preview.image})`,
                  backgroundSize: 'cover',
                  transform: 'scale(1.2)',
                }}
              ></div>

              <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden">
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
        ))}
      </div>
    </div>
  );
};

export default MusicPreviews;
