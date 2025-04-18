
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArtistProfileCard } from './ArtistProfileCard';
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

  const mockArtists = [
    {
      id: "1",
      name: "Antonia Pedragosa",
      type: "DJ",
      description: "DJ profesional con más de 10 años de experiencia",
      images: ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png"],
      rating: 4.8,
      priceRange: "200€ - 500€",
      isFavorite: false
    },
    {
      id: "2",
      name: "Carlos Martínez",
      type: "Banda",
      description: "Banda versátil para todo tipo de eventos",
      images: ["/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"],
      rating: 4.9,
      priceRange: "500€ - 1000€",
      isFavorite: false
    },
    {
      id: "3",
      name: "Laura González",
      type: "Solista",
      description: "Cantante solista con repertorio variado",
      images: ["/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
      rating: 4.7,
      priceRange: "300€ - 600€",
      isFavorite: false
    },
    {
      id: "4",
      name: "Miguel Torres",
      type: "Grupo",
      description: "Grupo musical para bodas y eventos",
      images: ["/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png"],
      rating: 4.6,
      priceRange: "600€ - 1200€",
      isFavorite: false
    }
  ];

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div>
              <h1 className="text-4xl font-black mb-1 dark:text-white">
                Bienvenido
              </h1>
              <h2 className="text-5xl font-black mb-8 dark:text-white">
                {userInfo.fullName}
              </h2>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 dark:bg-vyba-dark-secondary rounded-3xl p-8 w-full mx-auto flex flex-col items-center">
          <div className="text-center mb-4">
            <p className="text-sm font-black dark:text-gray-400">
              Todos los artistas
            </p>
            <h2 className="text-2xl font-medium mb-4 dark:text-white">
              Descubre entre muchos artistas
            </h2>
          </div>

          <div className="w-full overflow-hidden mb-6">
            <Marquee pauseOnHover className="py-4" maxWidth={isMobile ? window.innerWidth - 32 : 500}>
              <div className="flex gap-6">
                {mockArtists.map((artist) => (
                  <ArtistProfileCard
                    key={artist.id}
                    name={artist.name}
                    type={artist.type}
                    description={artist.description}
                    images={artist.images}
                    rating={artist.rating}
                    priceRange={artist.priceRange}
                    isFavorite={artist.isFavorite}
                    onClick={() => navigate(`/artista/${artist.id}`)}
                    isRecommended={true}
                    hideHeart={true}
                    regularBadge={true}
                    regularText={true}
                    className="min-w-[280px]"
                  />
                ))}
              </div>
            </Marquee>
          </div>

          <Button onClick={handleSearchArtists} className="w-full mb-3 bg-[#E8EEFF] hover:bg-[#D8E0FF]">
            Empezar a buscar
          </Button>

          <Button onClick={handlePromoteArtist} className="w-full max-w-[240px] bg-[#E8EEFF] hover:bg-[#D8E0FF]">
            Promocionarse como artista
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
