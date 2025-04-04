import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scan, Expand } from "lucide-react";
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
                    <Button onClick={handleGetStarted}>
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                
                <div className="flex-[0.8] relative px-10 md:px-32">
                  <div className="flex justify-center relative h-[500px] overflow-hidden">
                    <img src="/lovable-uploads/a02627ff-e1d7-4640-959e-74140c8af909.png" alt="VYBA app en iPhone" className="absolute bottom-[-50%] h-[700px] object-contain" />
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