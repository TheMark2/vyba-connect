
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  preview: {
    title: string;
    image?: string;
    audioUrl?: string;
    duration: string;
  };
  artistName: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayer = ({ 
  preview, 
  artistName, 
  isPlaying, 
  onPlayPause,
  audioRef
}: AudioPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState(preview.duration);

  useEffect(() => {
    if (!audioRef.current) return;
    
    const updateProgress = () => {
      if (audioRef.current) {
        const currentTimeValue = audioRef.current.currentTime;
        const durationValue = audioRef.current.duration || 0;
        
        // Actualizar el progreso como porcentaje
        if (durationValue > 0) {
          setProgress((currentTimeValue / durationValue) * 100);
        }
        
        // Formatear el tiempo actual
        const minutes = Math.floor(currentTimeValue / 60);
        const seconds = Math.floor(currentTimeValue % 60);
        setCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audioRef.current && !isNaN(audioRef.current.duration)) {
        const durationValue = audioRef.current.duration;
        const minutes = Math.floor(durationValue / 60);
        const seconds = Math.floor(durationValue % 60);
        setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }
    };
    
    // Usar evento timeupdate para actualizar el progreso
    audioRef.current.addEventListener('timeupdate', updateProgress);
    
    // Usar evento loadedmetadata para obtener la duración total
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Limpiar los event listeners al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [audioRef]); // Solo se ejecuta cuando cambia audioRef

  // Resetear el progreso cuando cambia la canción
  useEffect(() => {
    setProgress(0);
    setCurrentTime("0:00");
    setDuration(preview.duration);
  }, [preview]);

  return (
    <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40 py-5 px-6 rounded-xl border-t border-gray-200 dark:border-gray-800 mt-4">
      <div className="relative">
        {/* Fondo blureado con la imagen */}
        {preview.image && (
          <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden rounded-lg -m-2 opacity-20 pointer-events-none">
            <div className="w-full h-full blur-xl scale-150" style={{ 
              backgroundImage: `url(${preview.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          {/* Imagen de la canción */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {preview.image ? (
              <img 
                src={preview.image} 
                alt={preview.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span>No image</span>
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            {/* Información de la canción */}
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-10 w-10"
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <div>
                <h3 className="font-bold text-lg line-clamp-1">{preview.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{artistName}</p>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="mt-2">
              <div className="relative">
                <Progress value={progress} className="h-1" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>{currentTime}</span>
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
