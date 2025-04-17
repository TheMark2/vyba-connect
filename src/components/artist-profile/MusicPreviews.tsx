
import React, { useState } from "react";
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
  const [progress, setProgress] = useState(30); // Default progress value
  const isMobile = useIsMobile();

  const handlePlayPause = (preview: MusicPreview) => {
    const isStartingPlayback = currentlyPlaying !== preview.title;
    
    // Toggle playing state
    setCurrentlyPlaying(isStartingPlayback ? preview.title : null);
    
    // Call the parent handler if available
    if (onPlaybackState) {
      onPlaybackState(preview, isStartingPlayback);
    }
  };

  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-semibold mb-6">Preview</h2>
      
      <div className="space-y-3">
        {previews.map((preview, index) => (
          <div key={index} className="flex flex-col">
            <Card className="p-0 border-0 shadow-none bg-transparent hover:bg-gray-50 dark:hover:bg-vyba-dark-secondary/5 transition-colors rounded-xl">
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
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-black dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-black transition-colors flex items-center justify-center flex-shrink-0 shadow-sm"
                  onClick={() => handlePlayPause(preview)}
                >
                  {currentlyPlaying === preview.title ? (
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
                      <span className="text-xs text-gray-400">{preview.duration}</span>
                      <span className="text-xs bg-gray-100 dark:bg-vyba-dark-secondary/20 px-2 py-0.5 rounded-full text-gray-500">
                        Audio
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mb-1 mt-2 pr-1">
                    <Progress 
                      value={progress} 
                      className="h-1 bg-gray-200 dark:bg-vyba-dark-secondary/30" 
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPreviews;
