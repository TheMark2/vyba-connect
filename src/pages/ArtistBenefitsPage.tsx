import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scan, Maximize } from "lucide-react";
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
            <h1 className="text-2xl font-bold">VYBA artistas</h1>
            <Button variant="ghost" size="icon" aria-label="Maximizar">
              <Maximize className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="relative mt-10 mb-32">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center">
                <div className="p-10 md:p-16 md:w-1/2 flex flex-col justify-center">
                  <div className="mb-4">
                    <Scan className="h-12 w-12 text-black dark:text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">
                    Impulsa tu carrera con VYBA.
                  </h1>
                  <div className="mt-2">
                    <Button onClick={handleGetStarted}>
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-1/2 relative">
                  <div className="flex justify-center relative h-[500px] overflow-hidden">
                    <img src="/lovable-uploads/a02627ff-e1d7-4640-959e-74140c8af909.png" alt="VYBA app en iPhone" className="absolute bottom-[-50%] left-10 md:left-0 h-[700px] object-contain" />
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