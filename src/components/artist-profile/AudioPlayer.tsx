
import React, { useEffect, useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";

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
  const [textOverflow, setTextOverflow] = useState({
    title: false,
    artist: false
  });
  
  const titleRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);

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
    
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [audioRef]);

  // Resetear el progreso cuando cambia la canción
  useEffect(() => {
    setProgress(0);
    setCurrentTime("0:00");
    setDuration(preview.duration);
  }, [preview]);
  
  // Comprobar si los textos necesitan marquesina
  useEffect(() => {
    const checkTextOverflow = () => {
      if (titleRef.current) {
        const isOverflowing = titleRef.current.scrollWidth > titleRef.current.clientWidth;
        setTextOverflow(prev => ({ ...prev, title: isOverflowing }));
      }
      
      if (artistRef.current) {
        const isOverflowing = artistRef.current.scrollWidth > artistRef.current.clientWidth;
        setTextOverflow(prev => ({ ...prev, artist: isOverflowing }));
      }
    };
    
    checkTextOverflow();
    window.addEventListener('resize', checkTextOverflow);
    
    return () => window.removeEventListener('resize', checkTextOverflow);
  }, [preview.title, artistName]);

  return (
    <div className="relative p-5 rounded-2xl overflow-hidden bg-[#F7F7F7] dark:bg-vyba-dark-secondary/40">
      <div className="flex flex-col gap-4 rounded-xl">
        {/* Cabecera: Imagen y título */}
        <div className="flex items-center gap-4">
          {/* Imagen de la canción */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {preview.image ? (
              <Image 
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
          
          <div className="flex-grow overflow-hidden">
            {/* Título con efecto marquesina si es necesario */}
            <div className="h-6 overflow-hidden">
              {textOverflow.title ? (
                <div className="inline-block whitespace-nowrap animate-marquee-bounce">
                  <div ref={titleRef} className="font-bold text-lg">
                    {preview.title}
                  </div>
                </div>
              ) : (
                <div ref={titleRef} className="font-bold text-lg truncate">
                  {preview.title}
                </div>
              )}
            </div>
            
            {/* Artista con efecto marquesina si es necesario */}
            <div className="h-5 overflow-hidden">
              {textOverflow.artist ? (
                <div className="inline-block whitespace-nowrap animate-marquee-bounce">
                  <div ref={artistRef} className="text-sm text-gray-500 dark:text-gray-400">
                    {artistName}
                  </div>
                </div>
              ) : (
                <div ref={artistRef} className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {artistName}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div>
          <div className="relative">
            <Progress value={progress} className="h-1" />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>
          
          {/* Botón de reproducción centrado */}
          <div className="flex justify-center mt-3">
            <Button 
              variant="secondary" 
              size="icon" 
              className={`h-10 w-10 ${isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
