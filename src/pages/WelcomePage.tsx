import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';
import { useIsMobile } from '@/hooks/use-mobile';
import ArtistProfileCard from '@/components/ArtistProfileCard';
import { Marquee } from '@/components/ui/marquee';

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const userInfo = location.state?.userInfo || {
    fullName: "Ramón Prado"
  };

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
  };

  const handleSearchArtists = () => {
    navigate('/artists');
  };

  const handleClose = () => {
    navigate('/');
  };

  const renderArtistMarquee = () => {
    const displayArtists = mockArtists.length > 0 ? mockArtists : [
      {
        id: "placeholder-1",
        name: "Artista no encontrado",
        type: "Placeholder",
        description: "Próximamente más artistas",
        images: ["/lovable-uploads/placeholder.svg"],
        rating: 0,
        priceRange: "Consultar",
        isFavorite: false
      }
    ];

    return (
      <div className="w-full overflow-hidden">
        <Marquee pauseOnHover className="py-4" maxWidth={isMobile ? window.innerWidth - 32 : 1200}>
          <div className="flex gap-6">
            {displayArtists.map((artist) => (
              <ArtistProfileCard
                key={artist.id}
                name={artist.name}
                type={artist.type}
                description={artist.description}
                images={artist.images}
                rating={artist.rating}
                priceRange={artist.priceRange}
                isFavorite={artist.isFavorite}
                onClick={() => navigate(artist.id !== "placeholder-1" ? `/artista/${artist.id}` : "#")}
                isRecommended={artist.id === "placeholder-1"}
                hideHeart={true}
                regularBadge={true}
                regularText={true}
                className="min-w-[280px]"
              />
            ))}
          </div>
        </Marquee>
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="bg-white dark:bg-vyba-dark-bg min-h-screen">
        <Navbar />
        
        {isMobile ? (
          <div className="container mx-auto px-4 pt-32 pb-10">
            <h1 className="text-4xl font-black text-center mb-1 dark:text-white">
              Bienvenido
            </h1>
            <h2 className="text-5xl font-black text-center mb-8 dark:text-white">
              {userInfo.fullName}
            </h2>
            
            <div className="bg-gray-50 dark:bg-vyba-dark-secondary rounded-3xl p-8 w-full mx-auto flex flex-col items-center mb-6">
              <div className="text-center mb-4">
                <p className="text-sm font-black dark:text-gray-400">
                  Todos los artistas
                </p>
                <h2 className="text-2xl font-medium mb-4 dark:text-white">
                  Descubre entre muchos artistas
                </h2>
              </div>
              
              {renderArtistMarquee()}
              
              <Button onClick={handleSearchArtists} className="mb-3 bg-[#E8EEFF] hover:bg-[#D8E0FF]">
                Empezar a buscar
              </Button>
              
              <Button onClick={handlePromoteArtist} className="w-full max-w-[240px] bg-[#E8EEFF] hover:bg-[#D8E0FF]">
                Promocionarse como artista
              </Button>
            </div>
            
            <div className="flex justify-center mb-10">
              <Button variant="secondary" size="icon" onClick={handleClose} className="rounded-full" aria-label="Cerrar">
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              No tienes cuenta. <Link to="/register" className="font-medium text-primary-foreground">Regístrate</Link>
            </p>
          </div>
        ) : (
          <div className="container mx-auto pt-16">
            <h1 className="text-6xl font-bold text-center mb-12 dark:text-white">
              Bienvenido {userInfo.fullName}
            </h1>
            
            <div className="max-w-6xl mx-auto my-16">
              {renderArtistMarquee()}
            </div>
            
            <div className="flex flex-col items-center my-8">
              <div className="relative w-full max-w-md flex gap-4">
                <Button onClick={handlePromoteArtist} className="w-full hover:bg-[#EBBFCC]">
                  Promocionarse como artista
                </Button>
                
                <Button variant="secondary" onClick={handleClose} className="rounded-full py-2" aria-label="Cerrar">
                  <X className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default WelcomePage;
