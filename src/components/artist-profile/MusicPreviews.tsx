
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import Image from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import { Play, Pause, Music } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MusicPreview {
  title: string;
  duration: string;
  image?: string;
  audioUrl?: string;
}

interface MusicPreviewsProps {
  previews?: MusicPreview[];
  artistName: string;
  onPlaybackState?: (preview: MusicPreview, isPlaying: boolean) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

const MusicPreviews = ({
  previews = [],
  artistName,
  onPlaybackState,
  audioRef
}: MusicPreviewsProps) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const isMobile = useIsMobile();

  // Handle audio playback updates
  useEffect(() => {
    if (!audioRef?.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setCurrentlyPlaying(null);
      setProgress(0);
      if (onPlaybackState) {
        // Find the preview that was playing
        const preview = previews.find(p => p.title === currentlyPlaying);
        if (preview) {
          onPlaybackState(preview, false);
        }
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, currentlyPlaying, onPlaybackState, previews]);

  const handlePlayPause = (preview: MusicPreview) => {
    const isStartingPlayback = currentlyPlaying !== preview.title;
    
    if (isStartingPlayback) {
      // Stop current track if any
      if (currentlyPlaying && audioRef?.current) {
        audioRef.current.pause();
      }
      
      // Start new track
      setCurrentlyPlaying(preview.title);
      
      if (audioRef?.current && preview.audioUrl) {
        audioRef.current.src = preview.audioUrl;
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setCurrentlyPlaying(null);
        });
      }
    } else {
      // Pause current track
      if (audioRef?.current) {
        audioRef.current.pause();
      }
      setCurrentlyPlaying(null);
    }
    
    // Call the parent handler if available
    if (onPlaybackState) {
      onPlaybackState(preview, isStartingPlayback);
    }
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-semibold mb-6">Preview</h2>
      
      <div className="space-y-3">
        {previews.map((preview, index) => {
          const isPlaying = currentlyPlaying === preview.title;
          
          return (
            <div key={index} className="flex flex-col">
              <Card 
                className={`p-0 border-0 shadow-none rounded-xl transition-colors ${
                  isPlaying 
                    ? "bg-gray-50 dark:bg-vyba-dark-secondary/10" 
                    : "bg-transparent hover:bg-gray-50 dark:hover:bg-vyba-dark-secondary/5"
                }`}
              >
                <div className="flex items-center gap-4 p-2">
                  {/* Left side - Image (square) */}
                  <div className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    {preview.image ? (
                      <Image 
                        src={preview.image} 
                        alt={preview.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F7F7F7] dark:bg-vyba-dark-secondary/20 flex items-center justify-center">
                        <Music className="text-gray-400 w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  {/* Play button left side */}
                  <button 
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-colors ${
                      isPlaying 
                        ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700" 
                        : "bg-black dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-black"
                    }`}
                    onClick={() => handlePlayPause(preview)}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 md:w-5 md:h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 md:w-5 md:h-5 text-white ml-1" fill="white" />
                    )}
                  </button>
                  
                  {/* Right side - Content */}
                  <div className="flex-1 pt-1 pr-3">
                    {/* Title and artist info */}
                    <div>
                      <h3 className="text-xs md:text-sm font-medium text-[#969494] truncate">{artistName}</h3>
                      <h2 className="text-sm md:text-base font-semibold truncate">{preview.title}</h2>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">
                          {isPlaying ? formatTime(currentTime) : ""}
                          {isPlaying ? " / " : ""}
                          {preview.duration}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-vyba-dark-secondary/20 px-2 py-0.5 rounded-full text-gray-500">
                          Audio
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-1 mt-2 pr-1">
                      <Progress 
                        value={isPlaying ? progress : 0} 
                        className={`h-1 ${isPlaying ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-200 dark:bg-vyba-dark-secondary/30"}`} 
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
      
      {previews.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <Music className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No hay previews disponibles</h3>
          <p className="text-sm text-gray-400 max-w-md mt-2">
            Este artista aún no ha subido contenido para mostrar
          </p>
        </div>
      )}
    </div>
  );
};

export default MusicPreviews;
