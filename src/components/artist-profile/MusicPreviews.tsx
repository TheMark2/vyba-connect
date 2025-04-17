
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import Image from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import { Play, SkipBack, SkipForward, Pause } from "lucide-react";

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
      
      <div className="space-y-6">
        {previews.map((preview, index) => (
          <div key={index} className="flex flex-col">
            <Card className="p-0 border-0 shadow-none bg-transparent">
              <div className="flex items-start gap-4">
                {/* Left side - Image (now square) */}
                <div className="w-[200px] h-[200px] rounded-xl overflow-hidden flex-shrink-0">
                  {preview.image ? (
                    <Image 
                      src={preview.image} 
                      alt={preview.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                
                {/* Right side - Content with play button on left */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-4 mb-2">
                    {/* Play button moved to left side */}
                    <button 
                      className="w-14 h-14 rounded-full bg-black flex items-center justify-center"
                      onClick={() => handlePlayPause(preview)}
                    >
                      {currentlyPlaying === preview.title ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                      )}
                    </button>
                    
                    {/* Title and artist info */}
                    <div>
                      <h3 className="text-lg font-medium text-black">{artistName}</h3>
                      <h2 className="text-2xl font-bold text-black">{preview.title}</h2>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mb-8 mt-4">
                    <Progress 
                      value={progress} 
                      className="h-2 bg-gray-200" 
                    />
                  </div>
                  
                  {/* Controls - smaller skip buttons */}
                  <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <SkipBack className="w-4 h-4" />
                    </button>
                    
                    <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <SkipForward className="w-4 h-4" />
                    </button>
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
