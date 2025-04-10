
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { MusicPreview } from "../types";

export function useVideoLogic(
  preview: MusicPreview, 
  isPlaying: boolean, 
  audioRef?: React.RefObject<HTMLAudioElement>
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Verificar si es un video de YouTube o un video local/web
  const isYoutubeVideo = preview.videoUrl?.includes('youtube.com') || preview.videoUrl?.includes('youtu.be');
  const isLocalVideo = !isYoutubeVideo && preview.videoUrl !== undefined;
  
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Patrones para extraer el ID de YouTube de diferentes formatos de URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    // Si hay coincidencia y el ID tiene 11 caracteres (ID estándar de YouTube)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&controls=0&showinfo=0&rel=0`;
    }
    
    return url; // Devolver la URL original si no es de YouTube
  };
  
  const youtubeEmbedUrl = isYoutubeVideo ? getYoutubeEmbedUrl(preview.videoUrl || '') : '';
  
  useEffect(() => {
    // Si es un video de YouTube, no necesitamos manejar el video nativo
    if (isYoutubeVideo) {
      setVideoError(false);
      return;
    }
    
    const loadVideo = () => {
      if (videoRef.current) {
        // Limpiar eventos previos
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onerror = null;
        
        // Configurar el video
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded:", preview.title);
          setVideoError(false);
          
          // Actualizar la duración del video si está disponible
          if (videoRef.current && !isNaN(videoRef.current.duration)) {
            // Solo actualizar en consola para verificar, no modificamos el objeto preview directamente
            console.log(`Duración real del video ${preview.title}: ${formatTime(videoRef.current.duration)}`);
          }
        };
        
        videoRef.current.onerror = (e) => {
          console.error("Error cargando el video:", preview.videoUrl, e);
          setVideoError(true);
        };
      }
    };
    
    loadVideo();
    
    return () => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onerror = null;
        videoRef.current.ontimeupdate = null;
      }
    };
  }, [preview.videoUrl, isYoutubeVideo, preview.title]);
  
  // Efecto para sincronizar el estado de reproducción con isPlaying y actualizar currentTime
  useEffect(() => {
    // No hacemos nada si es un video de YouTube o hay error
    if (isYoutubeVideo || videoError) return;
    
    if (videoRef.current) {
      if (isPlaying) {
        // Sincronizar visualmente el video con el audio principal (muted)
        videoRef.current.muted = true;
        
        try {
          // Solo sincronizar el video (no el audio)
          const syncPromise = videoRef.current.play();
          if (syncPromise !== undefined) {
            syncPromise.catch(error => {
              console.error("Error al sincronizar video:", error);
            });
          }
          
          // Actualizamos el tiempo actual cuando cambia en el video
          videoRef.current.ontimeupdate = () => {
            if (audioRef?.current) {
              // Mantener sincronizado el video con el audio principal
              if (Math.abs(videoRef.current!.currentTime - audioRef.current.currentTime) > 0.3) {
                videoRef.current!.currentTime = audioRef.current.currentTime;
              }
              setCurrentTime(audioRef.current.currentTime);
            } else {
              setCurrentTime(videoRef.current!.currentTime);
            }
          };
        } catch (e) {
          console.error("Error al sincronizar el video:", e);
        }
      } else {
        videoRef.current.pause();
        videoRef.current.ontimeupdate = null;
      }
    }
    
    // Si no está reproduciéndose como audio principal,
    // nos aseguramos de que el video esté pausado y en su posición inicial
    if (!isPlaying && videoRef.current && !isYoutubeVideo && !videoError) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
      setCurrentTime(0);
    }
  }, [isPlaying, isYoutubeVideo, videoError, audioRef]);
  
  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetryCount(prev => prev + 1);
    setVideoError(false);
    toast.info("Reintentando cargar el video");
    if (videoRef.current) {
      // Forzar recarga del video
      const currentSrc = videoRef.current.src;
      videoRef.current.src = '';
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = currentSrc || preview.videoUrl || '';
          videoRef.current.load();
        }
      }, 100);
    }
  };
  
  const handleMouseEnter = () => {
    // No activar la vista previa si está reproduciéndose como audio principal
    // o si es un video de YouTube o hay error
    if (isYoutubeVideo || videoError || isPlaying) return;
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      
      // Usar muted para permitir la reproducción automática
      videoRef.current.muted = true;
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // No mostrar este error en consola ya que es esperado en algunos navegadores
          setIsVideoPlaying(false);
        });
      }
      setIsVideoPlaying(true);
    }
  };
  
  const handleMouseLeave = () => {
    // No detener en hover si está sonando como audio principal
    if (isYoutubeVideo || videoError || isPlaying) return;
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
    }
  };

  // Para el formateado de tiempo
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return {
    videoRef,
    isVideoPlaying,
    videoError,
    retryCount,
    currentTime,
    isYoutubeVideo,
    isLocalVideo,
    youtubeEmbedUrl,
    handleRetry,
    handleMouseEnter,
    handleMouseLeave,
    formatTime,
    setCurrentTime
  };
}
