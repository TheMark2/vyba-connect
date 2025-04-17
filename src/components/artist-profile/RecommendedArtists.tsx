
import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import ArtistProfileCard from "../ArtistProfileCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface Artist {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  rating: number;
  priceRange: string;
  isFavorite?: boolean;
}

interface RecommendedArtistsProps {
  artists: Artist[];
}

const RecommendedArtists = ({ artists }: RecommendedArtistsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!artists || artists.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="max-w-7xl mx-auto mb-6">
        <h2 className="text-3xl font-semibold">Recomendados</h2>
        <p className="text-sm font-light text-[#969494]">Sabemos que estos artistas te van a gustar</p>
      </div>
    </div>
  );
};

export default RecommendedArtists;
