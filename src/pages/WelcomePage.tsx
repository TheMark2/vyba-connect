
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from 'react-router-dom';
import ArtistCards from '@/components/ArtistCards';
import { PageTransition } from '@/components/ui/page-transition';

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = location.state?.userInfo || {
    fullName: "Ramón Prado",
  };

  const handlePromoteArtist = () => {
    navigate('/thank-you');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="bg-white dark:bg-vyba-dark-bg min-h-screen px-6 py-16">
        <div className="container mx-auto">
          <h1 className="text-6xl font-black text-center mb-8 dark:text-white">
            Bienvenido {userInfo.fullName}
          </h1>
          
          <div className="max-w-6xl mx-auto my-16">
            <ArtistCards />
          </div>
          
          <div className="flex gap-4 items-center my-8">
            <div className="relative w-full max-w-md">
              <Button 
                onClick={handlePromoteArtist} 
                className="w-full bg-[#F2D4DC] text-black hover:bg-[#EBBFCC]"
              >
                Promocionarse como artista
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                onClick={handleClose}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
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
      </div>
    </PageTransition>
  );
};

export default WelcomePage;
