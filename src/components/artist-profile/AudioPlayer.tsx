import React, { useEffect, useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import Image from "@/components/ui/image";
import { Marquee } from "@/components/ui/marquee";

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
      }
    };
    
    const handleLoadedMetadata = () => {
      try {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          const durationValue = audioRef.current.duration;
          const minutes = Math.floor(durationValue / 60);
          const seconds = Math.floor(durationValue % 60);
          setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
          setIsLoading(false);
        } else {
          setDuration(preview.duration);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener metadatos de audio:", error);
        setDuration(preview.duration);
        setIsLoading(false);
      }
    };
    
    const handleLoadStart = () => {
      setIsLoading(true);
    };
    
    const handleError = (e: Event) => {
      console.error("Error en AudioPlayer:", e);
      setIsLoading(false);
    };
    
    const audioElement = audioRef.current;
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('loadstart', handleLoadStart);
    audioElement.addEventListener('error', handleError);
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateProgress);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('loadstart', handleLoadStart);
        audioElement.removeEventListener('error', handleError);
      }
    };
  }, [audioRef, isDragging, preview.duration]);
  
  useEffect(() => {
    setProgress(0);
    setCurrentTime("0:00");
    setDuration(preview.duration);
  }, [preview]);
  
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

  if (isMobile) {
    return (
      <div 
        className="relative rounded-3xl overflow-hidden"
        style={{
          backgroundImage: preview.image ? `url(${preview.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[50px]"></div>
        <div className="relative p-5 z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
              {preview.image ? 
                <Image src={preview.image} alt={preview.title} className="w-full h-full object-cover" /> : 
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span>No image</span>
                </div>
              }
            </div>
            
            <div className="flex-grow text-white overflow-hidden">
              <div className="mb-1 w-full overflow-hidden">
                <Marquee className="text-white" pauseOnHover>
                  <div className="font-black text-lg">{preview.title}</div>
                </Marquee>
              </div>
              <div className="text-sm opacity-90 font-medium">{artistName}</div>
            </div>
          </div>
          
          <div className="mb-2">
            <Slider 
              value={[progress]} 
              min={0} 
              max={100} 
              step={0.1} 
              onValueChange={handleSliderChange} 
              onValueCommit={handleSliderCommit} 
              className="mb-2"
            />
          </div>
          
          <div className="flex justify-center mt-3">
            <button 
              className="text-white relative overflow-hidden w-12 h-12 flex items-center justify-center"
              onClick={handlePlayPauseClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="relative z-10 w-10 h-10">
                  <Pause
                    className={`absolute inset-0 h-7 w-7 transition-all duration-300 
                      ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                    fill="white"
                    fillOpacity="1"
                    stroke="none"
                  />
                  <Play
                    className={`absolute inset-0 h-7 w-7 transition-all duration-300 
                      ${isPlaying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                    fill="white"
                    fillOpacity="1"
                    stroke="none"
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative rounded-2xl overflow-hidden bg-transparent dark:bg-transparent">
      <div className="flex flex-col gap-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {preview.image ? <Image src={preview.image} alt={preview.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span>No image</span>
              </div>}
          </div>
          
          <div className="flex-grow overflow-hidden">
            <div className="h-6 overflow-hidden">
              {textOverflow.title ? <div className="whitespace-nowrap animate-marquee-bounce">
                  <div ref={titleRef} className="font-bold text-lg inline-block">
                    {preview.title}
                  </div>
                </div> : <div ref={titleRef} className="font-bold text-lg truncate">
                  {preview.title}
                </div>}
            </div>
            
            <div className="h-5 overflow-hidden">
              {textOverflow.artist ? <div className="whitespace-nowrap animate-marquee-bounce">
                  <div ref={artistRef} className="text-sm text-gray-500 dark:text-gray-400 inline-block">
                    {artistName}
                  </div>
                </div> : <div ref={artistRef} className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {artistName}
                </div>}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[35px]">{currentTime}</span>
            <Slider value={[progress]} min={0} max={100} step={0.1} onValueChange={handleSliderChange} onValueCommit={handleSliderCommit} className="flex-grow" />
            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[35px] text-right">{duration}</span>
          </div>
          
          <div className="flex justify-center mt-3">
            <button 
              className={`h-10 w-10 ${isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full relative overflow-hidden ${isLoading ? 'opacity-70 cursor-wait' : ''}`} 
              onClick={handlePlayPauseClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="relative z-10 w-5 h-5">
                  <Pause className={`absolute inset-0 h-5 w-5 fill-white transition-all duration-300 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                  <Play className={`absolute inset-0 h-5 w-5 fill-white transition-all duration-300 ${isPlaying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
