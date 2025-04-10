
export interface MusicPreview {
  title: string;
  duration: string;
  image?: string;
  hasVideo?: boolean;
  audioUrl?: string;
  videoUrl?: string;
}

export interface PreviewCardProps {
  preview: MusicPreview;
  artistName: string;
  isPlaying: boolean;
  isLoading?: boolean;
  onPlayPause: () => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}
