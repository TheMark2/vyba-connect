
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Expand, Target, Infinity, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PageTransition } from '@/components/ui/page-transition';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TimelineStep from "@/components/TimelineStep";
import { cn } from '@/lib/utils';

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
              <h2 className="text-4xl md:text-6xl font-black mb-3 max-w-3xl mx-auto">
                Promocionarte como artista es muy fácil
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center ml-2 mr-3">
                    <Target className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-lg pr-4">Publica en pocos pasos</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                  Publica tu perfil de artista <span className="font-bold">totalmente gratis</span> en menos de 5 minutos
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full px-4 py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <Infinity className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Haz cambios cuando necesites</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                  Haz actualizaciones en tu perfil a cualquier hora
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full px-4 py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <HeartHandshake className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Recibe ayuda si lo necesitas</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
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
