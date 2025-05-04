
export interface ArtistProfileCardProps {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  isFavorite: boolean;
  onClick: () => void;
  onFavoriteToggle: () => void;
  className?: string;
  isRecommended?: boolean;
  hideHeart?: boolean;
  regularBadge?: boolean;
  regularText?: boolean;
}
