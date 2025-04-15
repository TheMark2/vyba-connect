import React from "react";
import { Button } from "@/components/ui/button";
interface ArtistContactProps {
  name: string;
  location?: string;
  availability?: string;
  priceRange: string;
  image?: string;
  type?: string;
  rating?: number;
}
interface DesktopArtistNavbarProps {
  artist: ArtistContactProps;
  onContact: () => void;
  aboutMeRef: React.RefObject<HTMLDivElement>;
  imagesRef?: React.RefObject<HTMLDivElement>;
  reviewsRef?: React.RefObject<HTMLDivElement>;
}
const DesktopArtistNavbar = ({
  artist,
  onContact,
  aboutMeRef,
  imagesRef,
  reviewsRef
}: DesktopArtistNavbarProps) => {
  return <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24 h-fit">
      <div className="space-y-6">
        {/* Header with rotated image and artist info */}
        <div className="flex items-center">
          <div className="relative mr-5 flex-shrink-0">
            {artist.image && <div className="w-14 h-16 overflow-hidden rounded-2xl rotate-6 transform shadow-md">
                <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
              </div>}
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-1" style={{
            color: "#222222"
          }}>
              {artist.name}
            </h1>
            <p className="text-sm" style={{
            color: "#9B9B9B"
          }}>
              {artist.type} · {artist.rating}
            </p>
          </div>
        </div>

        {/* Price range */}
        <div className="text-2xl font-semibold" style={{
        color: "#222222"
      }}>
          {artist.priceRange}
        </div>

        {/* Availability */}
        <div className="flex flex-col gap-4">
          {artist.availability && <div>
              <div className="flex items-start mb-1">
                <div className="mt-1 w-4 h-4 rounded-full bg-green-500 flex-shrink-0 mr-4"></div>
                <div>
                  <p className="text-base font-medium" style={{
                color: "#222222"
              }}>
                    {artist.availability}
                  </p>
                </div>
              </div>
              <p style={{
            color: "#9B9B9B"
          }} className="text-sm ml-8 font-light">
                El artista ha indicado disponibilidad esta semana
              </p>
            </div>}
          
          <div>
            <div className="flex items-start mb-1">
              <div className="mt-1 w-4 h-4 rounded-full bg-green-500 flex-shrink-0 mr-4"></div>
              <div>
                <p className="text-base font-medium" style={{
                color: "#222222"
              }}>
                  Barcelona
                </p>
              </div>
            </div>
            <p style={{
            color: "#9B9B9B"
          }} className="text-sm ml-8 font-light">
              El artista ha indicado que se mueve en un radio de unos 12km aproximados
            </p>
          </div>
        </div>

        {/* Contact button */}
        <Button onClick={onContact} className="w-full">
          Contactar
        </Button>
      </div>
    </div>;
};
export default DesktopArtistNavbar;