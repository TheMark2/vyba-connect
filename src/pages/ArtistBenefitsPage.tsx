import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Expand, Target, Infinity, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PageTransition } from '@/components/ui/page-transition';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TimelineStep from "@/components/TimelineStep";
const ArtistBenefitsPage = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/thank-you');
  };
  return <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg">
        <Navbar />
        <div className="px-6 md:px-10 lg:px-14 xl:px-16 pt-8 pb-32">
          <div className="relative mt-10 mb-32">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-start">
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
                <div className="w-full md:w-1/2 h-full flex items-end justify-center self-end">
                  <img src="/lovable-uploads/4f4470c7-ab55-4cf6-8e0c-0ad253b45b59.png" alt="VYBA app en iPhone" className="w-auto h-auto max-h-[500px] object-contain" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Nueva sección: Promocionarte como artista */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-3 max-w-4xl mx-auto">
                Promocionarte como artista es muy fácil
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="text-center flex flex-col items-center">
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-black dark:text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">Publica en pocos pasos</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Publica tu perfil de artista <span className="font-bold">totalmente gratis</span> en menos de 5 minutos
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="text-center flex flex-col items-center">
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  <Infinity className="h-6 w-6 text-black dark:text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">Haz cambios cuando necesites</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Haz actualizaciones en tu perfil a cualquier hora
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="text-center flex flex-col items-center">
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  <HeartHandshake className="h-6 w-6 text-black dark:text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">Recibe ayuda si lo necesitas</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Si necesitas ayuda o ves que algo no está funcionando correctamente no dudes en contactarnos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>;
};
export default ArtistBenefitsPage;