
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
          <div className="container mx-auto px-4 py-10">
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
              
              <div className="w-full flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/4935f5e3-d4ed-4d4f-b493-2520dc94b4a4.png" 
                  alt="Artistas" 
                  className="w-3/4 max-w-[240px]"
                />
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
                variant="ghost"
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
          <div className="container mx-auto">
            <h1 className="text-6xl font-black text-center mb-8 dark:text-white">
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

export default WelcomePage;
