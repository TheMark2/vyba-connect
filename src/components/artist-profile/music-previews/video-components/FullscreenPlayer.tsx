
import React from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { MusicPreview } from "../types";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay
} from "@/components/ui/dialog";

interface FullscreenPlayerProps {
  preview: MusicPreview;
  onClose: () => void;
  isOpen: boolean;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

const FullscreenPlayer = ({ 
  preview, 
  onClose, 
  isOpen,
  currentTime: externalCurrentTime,
  onTimeUpdate,
  audioRef
}: FullscreenPlayerProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(externalCurrentTime || 0);
  const [duration, setDuration] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const [isUsingExternalAudio, setIsUsingExternalAudio] = React.useState(!!audioRef);
  
  // Sincronizar estado de reproducción con audio externo si existe
  React.useEffect(() => {
    if (audioRef?.current && isOpen) {
      // Usar el tiempo del audio externo
      if (externalCurrentTime !== undefined) {
        setCurrentTime(externalCurrentTime);
        
        // Sincronizar el video con el audio externo
        if (videoRef.current && Math.abs(videoRef.current.currentTime - externalCurrentTime) > 0.5) {
          videoRef.current.currentTime = externalCurrentTime;
        }
      }
      
      // Verificar si el audio está reproduciendo
      const isAudioPlaying = !audioRef.current.paused;
      setIsPlaying(isAudioPlaying);
    }
  }, [externalCurrentTime, audioRef, isOpen]);
  
  React.useEffect(() => {
    // Configurar el video cuando el componente se monta y el modal está abierto
    if (videoRef.current && isOpen) {
      const video = videoRef.current;
      
      // Cargar metadatos para obtener la duración
      video.onloadedmetadata = () => {
        setDuration(video.duration);
      };
      
      // Si no estamos usando audio externo, configurar actualizaciones de tiempo
      if (!isUsingExternalAudio) {
        // Actualizar tiempo actual durante la reproducción
        video.ontimeupdate = () => {
          setCurrentTime(video.currentTime);
        };
      
        // Reiniciar estado al finalizar
        video.onended = () => {
          setIsPlaying(false);
        };
      
        // Silenciar si estamos usando audio externo
        video.muted = isUsingExternalAudio || isMuted;
      
        // Si no hay audio externo, reproducir el video con su propio audio
        if (!isUsingExternalAudio) {
          video.play().then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.error("Error al reproducir video:", err);
          });
        }
      } else {
        // Si usamos audio externo, silenciar el video
        video.muted = true;
        
        // Sincronizar con el audio externo
        video.ontimeupdate = () => {
          // Solo notificar cambios de tiempo si provienen del video
          if (!externalCurrentTime && onTimeUpdate) {
            onTimeUpdate(video.currentTime);
          }
        };
      }
    }
    
    // Limpiar eventos al desmontar
    return () => {
      if (videoRef.current) {
        const video = videoRef.current;
        if (!isUsingExternalAudio) {
          video.pause();
        }
        video.onloadedmetadata = null;
        video.ontimeupdate = null;
        video.onended = null;
      }
    };
  }, [isOpen, isUsingExternalAudio, isMuted, externalCurrentTime, onTimeUpdate]);
  
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isUsingExternalAudio && audioRef?.current) {
      // Controlar reproducción a través del audio externo
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Error al reproducir audio:", err);
        });
      }
    } else {
      // Control directo del video
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Error al reproducir video:", err);
        });
      }
      
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (isUsingExternalAudio && audioRef?.current) {
      // Control de silencio para audio externo
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      // Control de silencio para video
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    if (isUsingExternalAudio && audioRef?.current) {
      // Actualizar tiempo del audio externo
      audioRef.current.currentTime = newTime;
      if (onTimeUpdate) {
        onTimeUpdate(newTime);
      }
    } else if (videoRef.current) {
      // Actualizar tiempo del video
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/95" />
        <DialogContent className="max-w-full w-full h-full max-h-full p-0 border-none bg-transparent">
          <div className="fixed inset-0 flex flex-col">
            {/* Video container */}
            <div className="relative flex-grow flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={preview.videoUrl}
                className="max-h-full max-w-full"
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                muted={isUsingExternalAudio || isMuted}
              />
            </div>
            
            {/* Controls overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/0 via-black/0 to-black/70 opacity-100 transition-opacity duration-300 hover:opacity-100">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white bg-black/30 hover:bg-black/50 rounded-full"
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between text-white mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div 
                  ref={progressBarRef}
                  className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-4"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-white rounded-full" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg">{preview.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white bg-white/10 hover:bg-white/20 rounded-full"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default FullscreenPlayer;
