
import React from "react";

interface MusicPreviewsProps {
  previews?: any[];
  artistName: string;
  onPlaybackState?: (preview: any, isPlaying: boolean) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

const MusicPreviews = ({
  artistName
}: MusicPreviewsProps) => {
  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-semibold mb-6">Preview</h2>
    </div>
  );
};

export default MusicPreviews;
