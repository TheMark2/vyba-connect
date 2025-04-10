
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
  const [isHovering, setIsHovering] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Verificar si es un video de YouTube o un video local/web
  const isYoutubeVideo = preview.videoUrl?.includes('youtube.com') || preview.videoUrl?.includes('youtu.be');
  const isLocalVideo = !isYoutubeVideo && preview.videoUrl !== undefined;
  
  // Función para extraer el ID de YouTube y generar URL de embed
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&controls=0&showinfo=0&rel=0`;
    }
    
    return url;
  };
  
  const youtubeEmbedUrl = isYoutubeVideo ? getYoutubeEmbedUrl(preview.videoUrl || '') : '';
  
  // Configurar el video cuando cambie la URL
  useEffect(() => {
    if (isYoutubeVideo || !videoRef.current) return;
    
    const video = videoRef.current;
    
    // Eventos para el video
    const handleMetadataLoaded = () => {
      setVideoError(false);
      if (video && !isNaN(video.duration)) {
        setDuration(video.duration);
        console.log(`Duración real del video ${preview.title}: ${formatTime(video.duration)}`);
      }
    };
    
    const handleError = () => {
      console.error("Error cargando el video:", preview.videoUrl);
      setVideoError(true);
    };
    
    // Configurar listeners
    video.addEventListener('loadedmetadata', handleMetadataLoaded);
    video.addEventListener('error', handleError);
    
    // Limpiar listeners
    return () => {
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
      video.removeEventListener('error', handleError);
    };
  }, [preview.videoUrl, isYoutubeVideo, preview.title]);
  
  // Manejar la reproducción cuando isPlaying cambia o en hover
  useEffect(() => {
    if (isYoutubeVideo || videoError || !videoRef.current) return;
    
    const video = videoRef.current;
    
    // Si está en modo reproducción principal
    if (isPlaying) {
      // Asegurarse de que el video está sincronizado con el audio principal
      if (audioRef?.current) {
        const syncVideo = () => {
          // Solo sincronizar si la diferencia es significativa
          if (Math.abs(video.currentTime - audioRef.current!.currentTime) > 0.3) {
            video.currentTime = audioRef.current!.currentTime;
          }
          setCurrentTime(audioRef.current!.currentTime);
        };
        
        // Actualizar tiempo cada 250ms para mantener sincronía
        const intervalId = setInterval(syncVideo, 250);
        
        video.muted = true; // Siempre silenciado cuando se usa audio externo
        
        // Comenzar reproducción si no está pausado el audio
        if (!audioRef.current.paused) {
          video.play().catch(e => console.error("Error al reproducir video sincronizado:", e));
        }
        
        return () => clearInterval(intervalId);
      } else {
        // Sin audio externo, usar el propio audio del video
        video.muted = false;
        video.play().catch(e => console.error("Error al reproducir video:", e));
      }
    } 
    // Si está en modo hover pero no reproduciendo como audio principal
    else if (isHovering && !isPlaying) {
      video.currentTime = 0;
      video.muted = true;
      video.loop = true;
      video.play().catch(e => {
        // Error esperado en algunos navegadores por políticas de autoplay
        console.log("Error en reproducción de hover (esperado):", e);
      });
      setIsVideoPlaying(true);
    } 
    // Ni reproduciendo ni hover
    else {
      video.pause();
      if (!isPlaying) {
        video.currentTime = 0;
      }
      setIsVideoPlaying(false);
    }
  }, [isPlaying, isHovering, isYoutubeVideo, videoError, audioRef]);
  
  // Intentar cargar de nuevo el video si falla
  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoError(false);
    toast.info("Reintentando cargar el video");
    
    if (videoRef.current) {
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
  
  // Manejar eventos de ratón
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  // Formatear tiempo en formato min:seg
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
    currentTime,
    duration,
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
