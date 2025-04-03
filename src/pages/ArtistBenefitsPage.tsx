
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scan } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PageTransition } from '@/components/ui/page-transition';

const ArtistBenefitsPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/thank-you');
  };

  return <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-10">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver atrás">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="relative mt-10 mb-20">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center">
                <div className="p-10 md:p-16 md:w-1/2 flex flex-col justify-center">
                  <div className="mb-4">
                    <Scan className="h-12 w-12 text-black dark:text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">
                    Usa AR para ver tu perfil de VYBA.
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Abre esta página usando Safari en tu iPhone o iPad.
                  </p>
                  <div>
                    <Button onClick={handleGetStarted}>
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-1/2 relative">
                  <div className="flex justify-end relative h-[500px]">
                    <img src="/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png" alt="VYBA app en iPhone" className="absolute bottom-0 right-0 md:right-10 h-auto max-h-[600px] object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>;
};

export default ArtistBenefitsPage;
