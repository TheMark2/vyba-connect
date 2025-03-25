
import React from "react";
import { Button } from "@/components/ui/button";

interface AboutArtistProps {
  description: string;
  genres?: string[];
  onGenreClick: (genre: string) => void;
}

const AboutArtist = ({ description, genres, onGenreClick }: AboutArtistProps) => {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-black mb-6">Sobre mi</h2>
      <p className="text-base mb-5 leading-relaxed">
        {description}
      </p>
      
      {/* Genres - Convertidos a botones */}
      {genres && genres.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {genres.map((genre, index) => (
            <Button 
              key={index} 
              variant="secondary" 
              className="rounded-full text-sm font-medium" 
              onClick={() => onGenreClick(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutArtist;
