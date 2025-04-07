
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from 'react-router-dom';
import ArtistCards from '@/components/ArtistCards';
import { PageTransition } from '@/components/ui/page-transition';
import { useIsMobile } from '@/hooks/use-mobile';

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const userInfo = location.state?.userInfo || {
    fullName: "Ramón Prado",
  };

  const handlePromoteArtist = () => {
    navigate('/artist-benefits');
  };

  const handleSearchArtists = () => {
    navigate('/artists');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <PageTransition>
      <div className="bg-white dark:bg-vyba-dark-bg min-h-screen">
        <Navbar />
        
        {isMobile ? (
          <div className="container mx-auto px-4 pt-8 pb-10">
            <h1 className="text-4xl font-black text-center mb-1 dark:text-white">
              Bienvenido
            </h1>
            <h2 className="text-4xl font-black text-center mb-8 dark:text-white">
              {userInfo.fullName}
            </h2>
            
            <div className="bg-gray-50 dark:bg-vyba-dark-secondary rounded-3xl p-6 w-full mx-auto flex flex-col items-center mb-6">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Todos los artistas
                </p>
                <h2 className="text-2xl font-medium mb-4 dark:text-white">
                  Descubre entre muchos artistas
                </h2>
              </div>
              
              <div className="w-full mb-6">
                <ArtistCardsMobile />
              </div>
              
              <Button 
                onClick={handleSearchArtists}
                className="w-full max-w-[240px] mb-3 bg-[#E8EEFF] hover:bg-[#D8E0FF]"
              >
                Empezar a buscar
              </Button>
              
              <Button 
                onClick={handlePromoteArtist}
                className="w-full max-w-[240px] bg-[#E8EEFF] hover:bg-[#D8E0FF]"
              >
                Promocionarse como artista
              </Button>
            </div>
            
            <div className="flex justify-center mb-10">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleClose}
                className="rounded-full"
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              No tienes cuenta. <Link to="/register" className="font-medium text-primary-foreground">Regístrate</Link>
            </p>
          </div>
        ) : (
          <div className="container mx-auto pt-12">
            <h1 className="text-6xl font-black text-center mb-12 dark:text-white">
              Bienvenido {userInfo.fullName}
            </h1>
            
            <div className="max-w-6xl mx-auto my-16">
              <ArtistCards />
            </div>
            
            <div className="flex flex-col items-center my-8">
              <div className="relative w-full max-w-md flex gap-4">
                <Button 
                  onClick={handlePromoteArtist} 
                  className="w-full hover:bg-[#EBBFCC]"
                >
                  Promocionarse como artista
                </Button>
                
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleClose}
                  className="rounded-full"
                  aria-label="Cerrar"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                No tienes cuenta. <Link to="/register" className="font-medium text-primary-foreground">Regístrate</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

// Componente para mostrar las tarjetas de artistas en formato móvil sin interacción
const ArtistCardsMobile = () => {
  // Datos de artistas (igual que en ArtistCards.tsx pero simplificados)
  const artists = [{
    id: 1,
    name: "Antonia Pedragosa",
    type: "DJ",
    image: "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png"
  }, {
    id: 2,
    name: "Carlos Martínez",
    type: "Banda",
    image: "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"
  }, {
    id: 3,
    name: "Laura González",
    type: "Solista",
    image: "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"
  }, {
    id: 4,
    name: "Miguel Torres",
    type: "Grupo",
    image: "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png"
  }];

  return (
    <div className="flex justify-center gap-2 overflow-x-auto pb-2">
      {artists.slice(0, 3).map((artist, index) => (
        <div 
          key={artist.id}
          className="relative rounded-xl overflow-hidden min-w-[100px] h-[140px]"
        >
          <img 
            src={artist.image} 
            alt={artist.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute bottom-2 left-2 right-2 text-white">
            <p className="text-xs font-bold">{artist.name}</p>
            <p className="text-xs">{artist.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WelcomePage;
