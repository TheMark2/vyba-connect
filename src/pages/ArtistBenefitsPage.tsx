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
        <div className="px-6 md:px-10 lg:px-14 xl:px-16 pt-8 pb-32">
          <div className="relative mt-10 mb-32">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center">
                {/* Left content container */}
                <div className="p-10 md:p-16 lg:p-24 xl:p-32 flex flex-col justify-center w-full md:w-1/2">
                  <div className="mb-6">
                    <Expand className="h-12 w-12 text-black dark:text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 dark:text-white">
                    Impulsa tu carrera con VYBA
                  </h1>
                  <div>
                    <Button onClick={handleGetStarted} className="bg-blue-100 hover:bg-blue-200 text-black w-full md:w-auto">
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                
                {/* Right image container positioned at the bottom */}
                <div className="w-full md:w-1/2 relative">
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <img
                      src="/lovable-uploads/4f4470c7-ab55-4cf6-8e0c-0ad253b45b59.png"
                      alt="VYBA app en iPhone"
                      className="w-auto h-auto max-h-[240px] object-contain"
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