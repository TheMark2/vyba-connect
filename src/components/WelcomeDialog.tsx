
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import ArtistProfileCard from './ArtistProfileCard';
import { Marquee } from './ui/marquee';
import { useIsMobile } from '@/hooks/use-mobile';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: {
    fullName: string;
    email?: string;
  };
}

const WelcomeDialog = ({ open, onOpenChange, userInfo }: WelcomeDialogProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePromoteArtist = () => {
    navigate('/artist-benefits');
    onOpenChange(false);
  };

  const handleSearchArtists = () => {
    navigate('/artists');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] overflow-hidden">
        <div className="relative flex items-center justify-center h-[300px] mt-8 w-full">
          {/* Imagen izquierda (sobresale) */}
          <div className="h-full w-[30%] overflow-hidden rounded-3xl relative z-10 translate-x-[-7%]">
              <img
              src="/lovable-uploads/dogwithmale.png"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
              />
          </div>

          {/* Imagen central (más grande) */}
          <div className="h-[110%] w-[40%] overflow-hidden rounded-3xl z-20">
              <img
              src="/lovable-uploads/girl1.png"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
              />
          </div>

          {/* Imagen derecha (sobresale) */}
          <div className="h-full w-[30%] overflow-hidden rounded-3xl relative z-10 translate-x-[7%]">
              <img
              src="/lovable-uploads/girl2.png"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
              />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-center mt-12 mb-0">
            <div>
              <h1 className="text-5xl font-bold mb-4 dark:text-white px-8 max-w-3xl mx-auto">
                Te damos la bienvenida, {userInfo.fullName}
              </h1>
              <p className="text-lg font-light mb-0 dark:text-white max-w-md mx-auto">Empieza a buscar a los mejores artistas musicales fácil y rápido</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center mt-6 max-w-xl mx-auto px-8 gap-6">
          <Button variant="terciary" onClick={handleSearchArtists}>
            Empezar a buscar
          </Button>

          <Button variant="terciary" onClick={handlePromoteArtist}>
            Promocionarse como artista
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
