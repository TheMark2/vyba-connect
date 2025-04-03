
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize } from "lucide-react";
import { PageTransition } from '@/components/ui/page-transition';

const ArtistBenefitsPage = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/thank-you');
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">VYBA artistas</div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)} 
                className="rounded-full"
                aria-label="Volver atrás"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button onClick={handleGetStarted} className="bg-[#E6EDFF] hover:bg-[#D7E3FF] text-black">
                Empezar ahora
              </Button>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center">
                <div className="p-10 md:p-16 md:w-1/2 flex flex-col justify-center">
                  <div className="mb-4">
                    <Maximize className="h-6 w-6 text-black dark:text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">
                    Impulsa tu carrera con VYBA
                  </h1>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={handleGetStarted} 
                      className="bg-[#E6EDFF] hover:bg-[#D7E3FF] text-black"
                    >
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-1/2 relative">
                  <div className="flex justify-end relative">
                    <img
                      src="/lovable-uploads/90ceba35-f3d7-438f-b43d-dd4083d35205.png"
                      alt="VYBA app en iPhone"
                      className="w-auto h-auto max-h-[550px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ArtistBenefitsPage;
