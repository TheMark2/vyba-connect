
import React, { useEffect, useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
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
  const [isDragging, setIsDragging] = useState(false);
  
  const titleRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    
    const updateProgress = () => {
      if (audioRef.current && !isDragging) {
        const currentTimeValue = audioRef.current.currentTime;
        const durationValue = audioRef.current.duration || 0;
        
        if (durationValue > 0) {
          setProgress((currentTimeValue / durationValue) * 100);
        }
        
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
  }, [audioRef, isDragging]);

  useEffect(() => {
    setProgress(0);
    setCurrentTime("0:00");
    setDuration(preview.duration);
  }, [preview]);
  
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

  const handleSliderChange = (value: number[]) => {
    setIsDragging(true);
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      setProgress(value[0]);
      
      // Actualizar el tiempo mostrado mientras se arrastra
      const minutes = Math.floor(newTime / 60);
      const seconds = Math.floor(newTime % 60);
      setCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }
  };

  const handleSliderCommit = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
    setTimeout(() => setIsDragging(false), 200);
  };

  return (
    <div className="relative p-5 rounded-2xl overflow-hidden bg-transparent dark:bg-transparent">
      <div className="flex flex-col gap-4 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="relative rounded-xl overflow-hidden w-16 h-16 flex-shrink-0">
            {/* Imagen principal */}
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
            
            {/* Efecto de blur detrás de la imagen */}
            {preview.image && (
              <div 
                className="absolute inset-0 -z-10 scale-150" 
                style={{
                  backgroundImage: `url(${preview.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px)',
                  opacity: 0.5,
                  transform: 'scale(2)',
                  borderRadius: '8px'
                }}
              />
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
            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[35px] text-right">{duration}</span>
          </div>
          
          <div className="flex justify-center mt-3">
            <Button 
              variant="secondary" 
              size="icon" 
              className={`h-10 w-10 ${isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white relative overflow-hidden`}
              onClick={onPlayPause}
            >
              <div className="relative z-10 w-5 h-5">
                <Pause className={`absolute inset-0 h-5 w-5 fill-white transition-all duration-300 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                <Play className={`absolute inset-0 h-5 w-5 fill-white transition-all duration-300 ${isPlaying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
