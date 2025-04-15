
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
    <div className="bg-[#F7F7F7] p-6 rounded-3xl sticky top-24 h-fit dark:bg-vyba-dark-secondary">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {artist.image && (
            <img 
              src={artist.image} 
              alt={artist.name} 
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold dark:text-white">{artist.name}</h3>
            {artist.location && <p className="text-sm text-gray-600 dark:text-gray-300">{artist.location}</p>}
          </div>
        </div>
        
        {artist.availability && (
          <div className="px-4 py-2 bg-[#E6F2E6] text-[#4CAF50] rounded-full text-sm font-medium inline-block">
            {artist.availability}
          </div>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Presupuesto</span>
              <span className="font-semibold text-gray-800 dark:text-white">{artist.priceRange}</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onContact}
          className="w-full"
        >
          Contactar
        </Button>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col space-y-2">
              <NavigationMenuItem>
                <Button 
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 dark:text-white"
                  onClick={() => scrollToSection(aboutMeRef)}
                >
                  Sobre {artist.name}
                </Button>
              </NavigationMenuItem>
              
              {imagesRef && (
                <NavigationMenuItem>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 dark:text-white"
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
                    className="w-full justify-start px-4 py-2 dark:text-white"
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
