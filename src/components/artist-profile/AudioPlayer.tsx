
import React, { useEffect, useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Rewind, FastForward } from "lucide-react";
import Image from "@/components/ui/image";
import { Marquee } from "@/components/ui/marquee";

interface AudioPlayerProps {
  preview: {
    title: string;
    image?: string;
    audioUrl?: string;
    videoUrl?: string;
    hasVideo?: boolean;
    duration: string;
  };
  artistName: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isMobile?: boolean;
}

const AudioPlayer = ({
  preview,
  artistName,
  isPlaying,
  onPlayPause,
  audioRef,
  isMobile = false
}: AudioPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [remainingTime, setRemainingTime] = useState("0:00");
  const [duration, setDuration] = useState(preview.duration);
  const [textOverflow, setTextOverflow] = useState({
    title: false,
    artist: false
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (audioRef.current && !isDragging) {
        const currentTimeValue = audioRef.current.currentTime;
        const durationValue = audioRef.current.duration || 0;
        if (durationValue > 0) {
          setProgress(currentTimeValue / durationValue * 100);
        }
        const minutes = Math.floor(currentTimeValue / 60);
        const seconds = Math.floor(currentTimeValue % 60);
        setCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        const remainingTimeValue = durationValue - currentTimeValue;
        const remainingMinutes = Math.floor(remainingTimeValue / 60);
        const remainingSeconds = Math.floor(remainingTimeValue % 60);
        setRemainingTime(`-${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);
      }
    };

    const handleLoadedMetadata = () => {
      try {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          const durationValue = audioRef.current.duration;
          const minutes = Math.floor(durationValue / 60);
          const seconds = Math.floor(durationValue % 60);
          const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          setDuration(formattedDuration);
          setRemainingTime(`-${formattedDuration}`);
          setIsLoading(false);
          console.log("Duración del audio cargada:", formattedDuration);
        } else {
          console.log("Usando duración predeterminada:", preview.duration);
          setDuration(preview.duration);
          setRemainingTime(`-${preview.duration}`);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener metadatos de audio:", error);
        setDuration(preview.duration);
        setRemainingTime(`-${preview.duration}`);
        setIsLoading(false);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio can play now");
    };

    const handleError = (e: Event) => {
      console.error("Error en AudioPlayer:", e);
      setIsLoading(false);
    };

    const audioElement = audioRef.current;
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('loadstart', handleLoadStart);
    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('error', handleError);

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateProgress);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('loadstart', handleLoadStart);
        audioElement.removeEventListener('canplay', handleCanPlay);
        audioElement.removeEventListener('error', handleError);
      }
    };
  }, [audioRef, isDragging, preview.duration]);

  useEffect(() => {
    setProgress(0);
    setCurrentTime("0:00");
    setRemainingTime(`-${duration}`);
    
    // Actualizar la duración cuando cambia la previsualización
    setDuration(preview.duration);

    if (audioRef.current) {
      const sourceUrl = preview.hasVideo && preview.videoUrl ? preview.videoUrl : preview.audioUrl;
      
      if (sourceUrl && audioRef.current.src !== sourceUrl) {
        console.log("Actualizando URL de fuente en AudioPlayer:", sourceUrl);
        console.log("Es una fuente de video:", preview.hasVideo && preview.videoUrl ? "Sí" : "No");
        
        // Asegurarse de que la URL esté codificada correctamente
        const encodedUrl = encodeURI(sourceUrl);
        audioRef.current.src = encodedUrl;
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.load();
      }
    }
  }, [preview, duration]);

  useEffect(() => {
    const checkTextOverflow = () => {
      if (titleRef.current) {
        const isOverflowing = titleRef.current.scrollWidth > titleRef.current.clientWidth;
        setTextOverflow(prev => ({
          ...prev,
          title: isOverflowing
        }));
      }
      if (artistRef.current) {
        const isOverflowing = artistRef.current.scrollWidth > artistRef.current.clientWidth;
        setTextOverflow(prev => ({
          ...prev,
          artist: isOverflowing
        }));
      }
    };
    checkTextOverflow();
    window.addEventListener('resize', checkTextOverflow);
    return () => window.removeEventListener('resize', checkTextOverflow);
  }, [preview.title, artistName]);

  const handleSliderChange = (value: number[]) => {
    setIsDragging(true);
    if (audioRef.current && audioRef.current.duration) {
      const newTime = value[0] / 100 * audioRef.current.duration;
      setProgress(value[0]);
      const minutes = Math.floor(newTime / 60);
      const seconds = Math.floor(newTime % 60);
      setCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      const remainingTime = audioRef.current.duration - newTime;
      const remainingMinutes = Math.floor(remainingTime / 60);
      const remainingSeconds = Math.floor(remainingTime % 60);
      setRemainingTime(`-${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);
    }
  };

  const handleSliderCommit = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = value[0] / 100 * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
    setTimeout(() => setIsDragging(false), 200);
  };

  const handlePlayPauseClick = () => {
    if (isLoading) return;
    onPlayPause();
  };

  const handleSkipForward = () => {
    if (!audioRef.current || isLoading) return;
    const newTime = Math.min(audioRef.current.currentTime + 60, audioRef.current.duration || 0);
    audioRef.current.currentTime = newTime;
  };

  const handleSkipBackward = () => {
    if (!audioRef.current || isLoading) return;
    const newTime = Math.max(audioRef.current.currentTime - 60, 0);
    audioRef.current.currentTime = newTime;
  };

  return isMobile ? (
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
            <div className="mb-1 w-full overflow-hidden">
              <Marquee className="text-white" pauseOnHover>
                <div className="font-black text-lg">{preview.title}</div>
              </Marquee>
            </div>
            <div className="text-md opacity-90 font-medium">{artistName}</div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-white min-w-[35px]">{currentTime}</span>
            <Slider 
              value={[progress]} 
              min={0} 
              max={100} 
              step={0.1} 
              onValueChange={handleSliderChange} 
              onValueCommit={handleSliderCommit} 
              className="flex-grow" 
            />
            <span className="text-xs text-white min-w-[35px] text-right">{remainingTime}</span>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-3 mt-2">
          <button 
            className="text-white relative overflow-hidden w-10 h-10 flex items-center justify-center" 
            onClick={handleSkipBackward} 
            disabled={isLoading}
          >
            <Rewind className="h-6 w-6" fill="white" fillOpacity="1" stroke="none" />
          </button>
          <button 
            className="text-white relative overflow-hidden w-12 h-12 flex items-center justify-center" 
            onClick={handlePlayPauseClick} 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="relative z-10 flex items-center justify-center w-10 h-10">
                <Pause className={`absolute h-7 w-7 transition-all duration-300 
                    ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} fill="white" fillOpacity="1" stroke="none" />
                <Play className={`absolute h-7 w-7 transition-all duration-300 
                    ${isPlaying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} fill="white" fillOpacity="1" stroke="none" />
              </div>
            )}
          </button>
          <button 
            className="text-white relative overflow-hidden w-10 h-10 flex items-center justify-center" 
            onClick={handleSkipForward} 
            disabled={isLoading}
          >
            <FastForward className="h-6 w-6" fill="white" fillOpacity="1" stroke="none" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="relative rounded-2xl overflow-hidden bg-transparent dark:bg-transparent">
      <div className="flex flex-col gap-3 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {preview.image ? (
              <Image src={preview.image} alt={preview.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span>No image</span>
              </div>
            )}
          </div>
          
          <div className="flex-grow overflow-hidden">
            <div className="h-6 overflow-hidden">
              {textOverflow.title ? (
                <div className="whitespace-nowrap animate-marquee-bounce">
                  <div ref={titleRef} className="font-bold text-lg inline-block">
                    {preview.title}
                  </div>
                </div>
              ) : (
                <div ref={titleRef} className="font-bold text-lg truncate">
                  {preview.title}
                </div>
              )}
            </div>
            
            <div className="h-5 overflow-hidden">
              {textOverflow.artist ? (
                <div className="whitespace-nowrap animate-marquee-bounce">
                  <div ref={artistRef} className="text-sm text-gray-500 dark:text-gray-400 inline-block">
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
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[35px]">{currentTime}</span>
            <Slider 
              value={[progress]} 
              min={0} 
              max={100} 
              step={0.1} 
              onValueChange={handleSliderChange} 
              onValueCommit={handleSliderCommit} 
              className="flex-grow" 
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[35px] text-right">{remainingTime}</span>
          </div>
          
          <div className="flex justify-center items-center gap-2 mt-2">
            <button 
              className="h-8 w-8 bg-gray-200 dark:bg-vyba-dark-secondary text-gray-700 dark:text-white rounded-full relative overflow-hidden" 
              onClick={handleSkipBackward} 
              disabled={isLoading}
            >
              <Rewind className="h-4 w-4 mx-auto" fill="currentColor" stroke="none" />
            </button>
            <button 
              className={`h-10 w-10 ${isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full relative overflow-hidden ${isLoading ? 'opacity-70 cursor-wait' : ''}`} 
              onClick={handlePlayPauseClick} 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="relative z-10 flex items-center justify-center w-5 h-5">
                  <Pause className={`absolute h-5 w-5 fill-white transition-all duration-300 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                  <Play className={`absolute h-5 w-5 fill-white transition-all duration-300 ${isPlaying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
                </div>
              )}
            </button>
            <button 
              className="h-8 w-8 bg-gray-200 dark:bg-vyba-dark-secondary text-gray-700 dark:text-white rounded-full relative overflow-hidden" 
              onClick={handleSkipForward} 
              disabled={isLoading}
            >
              <FastForward className="h-4 w-4 mx-auto" fill="currentColor" stroke="none" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
