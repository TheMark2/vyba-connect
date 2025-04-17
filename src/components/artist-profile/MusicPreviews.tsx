
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
  videoUrl?: string;
  hasVideo?: boolean;
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
      
      <div className="space-y-4">
        {previews.map((preview, index) => (
          <div key={index} className="flex flex-col">
            <Card className="p-0 border-0 shadow-none bg-transparent hover:bg-gray-50 dark:hover:bg-vyba-dark-secondary/5 transition-colors rounded-xl">
              <div className="flex items-center gap-6">
                {/* Left side - Image (square) */}
                <div className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-xl overflow-hidden flex-shrink-0">
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
                
                {/* Right side - Content with play button on left */}
                <div className="flex-1 pt-2 pr-3">
                  <div className="flex items-center gap-4 mb-2">
                    {/* Play button left side */}
                    <button 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center"
                      onClick={() => handlePlayPause(preview)}
                    >
                      {currentlyPlaying === preview.title ? (
                        <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      ) : (
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" fill="white" />
                      )}
                    </button>
                    
                    {/* Title and artist info */}
                    <div>
                      <h3 className="text-xs md:text-sm font-medium text-[#969494]">{artistName}</h3>
                      <h2 className="text-sm md:text-lg font-semibold truncate">{preview.title}</h2>
                      <span className="text-xs text-gray-400 mt-1 hidden md:block">{preview.duration}</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mb-3 mt-2 pr-2">
                    <Progress 
                      value={progress} 
                      className="h-1 bg-gray-200" 
                    />
                    
                    {/* Duration on mobile */}
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400 md:hidden">{preview.duration}</span>
                      {preview.hasVideo && (
                        <span className="text-xs bg-gray-100 dark:bg-vyba-dark-secondary/20 px-2 py-0.5 rounded-full text-gray-500">
                          {preview.hasVideo ? "Video" : "Audio"}
                        </span>
                      )}
                    </div>
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
