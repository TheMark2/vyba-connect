
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Play } from "lucide-react";
import Image from "@/components/ui/image";
import { Marquee } from "@/components/ui/marquee";

interface AudioPlayerProps {
  preview: {
    title: string;
    image?: string;
    duration: string;
  };
  artistName: string;
  isMobile: boolean;
  // Añadimos las props faltantes
  isPlaying?: boolean;
  onPlayPause?: () => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

const AudioPlayer = ({
  preview,
  artistName,
  isMobile
}: AudioPlayerProps) => {
  // Versión de escritorio simplificada sin funcionalidad
  if (!isMobile) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          {preview.image ? (
            <Image src={preview.image} alt={preview.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              <span>No image</span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <div className="max-w-[180px]">
              <div className="text-base font-regular overflow-hidden">
                <Marquee className="text-base font-regular" maxWidth={180} pauseOnHover>
                  {preview.title}
                </Marquee>
              </div>
              <div className="text-sm font-light" style={{ color: "#9B9B9B" }}>
                (minutos) restantes
              </div>
            </div>
            <button className="h-8 w-8 bg-[#F7F7F7] text-black rounded-full flex items-center justify-center">
              <Play className="h-4 w-4 ml-0.5" fill="black" />
            </button>
          </div>
          
          <div className="mt-2">
            <Progress value={30} className="h-1.5" />
          </div>
        </div>
      </div>
    );
  }
  
  // Versión móvil simplificada sin funcionalidad
  return (
    <div className="relative rounded-3xl overflow-hidden" style={{
      backgroundImage: preview.image ? `url(${preview.image})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[50px]"></div>
      <div className="relative p-5 pt-5 pb-3 z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
            {preview.image ? (
              <Image src={preview.image} alt={preview.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span>No image</span>
              </div>
            )}
          </div>
          
          <div className="flex-grow text-white overflow-hidden">
            <div className="mb-1 font-medium text-lg overflow-hidden">
              <Marquee maxWidth={150} pauseOnHover>
                {preview.title}
              </Marquee>
            </div>
            <div className="text-sm font-light opacity-80">
              (minutos) restantes
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <Progress value={30} className="h-1.5 bg-white/30" />
        </div>
        
        <div className="flex justify-center items-center">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Play className="h-5 w-5 ml-0.5" fill="#000" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
