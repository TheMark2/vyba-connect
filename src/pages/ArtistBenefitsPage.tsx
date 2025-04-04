import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Expand } from "lucide-react";
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
          <div className="relative mt-10 mb-32">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center">
                <div className="p-10 md:p-32 flex-1 flex flex-col justify-center">
                  <div className="mb-6">
                    <Expand className="h-12 w-12 text-black dark:text-white" />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black mb-6 dark:text-white">
                    Impulsa tu carrera con VYBA.
                  </h1>
                  <div>
                    <Button onClick={handleGetStarted} className="bg-blue-100 hover:bg-blue-200 text-black">
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                <div className="flex-[0.8] relative h-[400px] overflow-hidden flex items-end">
                  <div className="w-full absolute bottom-0">
                    <img
                      src="/lovable-uploads/a02627ff-e1d7-4640-959e-74140c8af909.png"
                      alt="VYBA app en iPhone"
                      className="w-full object-contain translate-y-1/3"
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