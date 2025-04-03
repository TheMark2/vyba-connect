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
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg">
        <Navbar />
        <div className="container mx-auto px-4 pt-10">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver atrás">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="relative mt-10 mb-20">
            <div className="bg-white dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden shadow-sm">
              <div className="flex flex-col md:flex-row items-center p-4 md:p-0">
                <div className="p-6 md:p-16 md:w-1/2 flex flex-col justify-center">
                  <div className="mb-6">
                    <Scan className="h-10 w-10 text-black dark:text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
                    Usa AR para ver tu perfil de VYBA.
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-xl mb-8">
                    Abre esta página usando Safari en tu iPhone o iPad.
                  </p>
                  <div>
                    <Button onClick={handleGetStarted} className="rounded-full px-6 py-2">
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex items-center justify-center relative h-full md:h-[500px]">
                  <img
                    src="/lovable-uploads/a02627ff-e1d7-4640-959e-74140c8af909.png"
                    alt="VYBA app en iPhone"
                    className="h-[400px] md:h-[450px] object-contain py-6"
                  />
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