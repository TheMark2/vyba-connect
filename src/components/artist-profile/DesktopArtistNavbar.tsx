import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface ArtistContactProps {
  name: string;
  location?: string;
  availability?: string;
  priceRange: string;
  image?: string;
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
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const yOffset = -100;
      const element = ref.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24 h-fit">
      <div className="space-y-6">
        {/* Header with rotated image and artist info */}
        <div className="flex items-center">
          <div className="relative mr-5 flex-shrink-0">
            {artist.image && (
              <div className="w-20 h-24 overflow-hidden rounded-2xl rotate-6 transform shadow-md">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#222222" }}>
              {artist.name}
            </h1>
            {artist.location && (
              <p style={{ color: "#9B9B9B" }}>
                {artist.location}
              </p>
            )}
          </div>
        </div>

        {/* Price range */}
        <div className="text-2xl font-bold" style={{ color: "#222222" }}>
          {artist.priceRange}
        </div>

        {/* Availability */}
        {artist.availability && (
          <div className="flex items-start mb-4">
            <div className="mt-1 w-5 h-5 rounded-full bg-green-500 flex-shrink-0 mr-4"></div>
            <div>
              <p className="text-lg font-medium" style={{ color: "#222222" }}>
                {artist.availability}
              </p>
            </div>
          </div>
        )}

        {/* Contact button */}
        <button
          onClick={onContact}
          className="w-full bg-blue-50 py-4 px-6 rounded-full text-lg font-medium"
          style={{ color: "#222222" }}
        >
          Contactar
        </button>

        {/* Navigation menu */}
        <div className="pt-4 border-t border-gray-200">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col space-y-2">
              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-left"
                  style={{ color: "#222222" }}
                  onClick={() => scrollToSection(aboutMeRef)}
                >
                  Sobre {artist.name}
                </Button>
              </NavigationMenuItem>

              {imagesRef && (
                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-left"
                    style={{ color: "#222222" }}
                    onClick={() => scrollToSection(imagesRef)}
                  >
                    Experiencia
                  </Button>
                </NavigationMenuItem>
              )}

              {reviewsRef && (
                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-left"
                    style={{ color: "#222222" }}
                    onClick={() => scrollToSection(reviewsRef)}
                  >
                    Reseñas
                  </Button>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
};

export default DesktopArtistNavbar;