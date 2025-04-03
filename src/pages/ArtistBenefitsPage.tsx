
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cube } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              aria-label="Volver atrás"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={handleGetStarted}
            >
              Empezar ahora
            </Button>
          </div>
          
          <div className="relative mt-10">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row">
                <div className="p-10 md:p-16 md:w-1/2 flex flex-col justify-center">
                  <div className="mb-4">
                    <Cube className="h-12 w-12 text-black dark:text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-6 dark:text-white">
                    Impulsa tu carrera con VYBA
                  </h1>
                  <div>
                    <Button 
                      onClick={handleGetStarted}
                    >
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-1/2 relative">
                  <div className="absolute bottom-0 right-0 md:right-16 transform translate-y-6">
                    <div className="max-w-[300px] relative">
                      <div className="rounded-[40px] overflow-hidden">
                        <img 
                          src="/lovable-uploads/35acb89a-406d-49f2-b2c4-b220cdf3227b.png" 
                          alt="VYBA app en iPhone" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute -z-10 top-8 -left-8 -right-8 -bottom-8 rounded-[55px] bg-black/10 blur-xl"></div>
                    </div>
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
