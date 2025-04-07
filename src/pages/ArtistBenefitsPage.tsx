
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Expand, Target, Infinity, HeartHandshake, BarChart3, MessageSquare, Calendar } from "lucide-react";
import SimpleNavbar from "@/components/SimpleNavbar";
import { PageTransition } from '@/components/ui/page-transition';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TimelineStep from "@/components/TimelineStep";
import { cn } from '@/lib/utils';
import HelpSection from '@/components/HelpSection';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const ArtistBenefitsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleGetStarted = () => {
    navigate('/thank-you');
  };
  
  return <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
        <SimpleNavbar />
        <div className="px-4 md:px-10 lg:px-14 xl:px-16 pt-6 md:pt-8 pb-16 md:pb-32 flex-grow">
          {/* Hero Section */}
          <div className="relative mt-4 md:mt-10 mb-24 md:mb-40">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center">
                {/* Left content container */}
                <div className="p-8 md:p-16 lg:p-24 xl:p-32 flex flex-col justify-center w-full md:w-1/2 text-center md:text-left">
                  {!isMobile && (
                    <div className="mb-6">
                      <Expand className="h-12 w-12 text-black dark:text-white" />
                    </div>
                  )}
                  
                  {isMobile && (
                    <div className="flex justify-center mb-4">
                      <Expand className="h-10 w-10 text-black dark:text-white" />
                    </div>
                  )}
                  
                  <h1 className={cn(
                    "font-black mb-6 dark:text-white",
                    isMobile ? "text-2xl" : "text-4xl md:text-5xl lg:text-6xl"
                  )}>
                    Impulsa tu carrera con VYBA
                  </h1>
                  
                  {isMobile && (
                    <div className="mt-2 mb-4">
                      <Button onClick={handleGetStarted} className="bg-blue-100 hover:bg-blue-200 text-black w-full">
                        Empezar ahora
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Right image container positioned at the bottom */}
                {!isMobile && (
                  <div className="w-full md:w-1/2 h-full flex items-end justify-center self-end">
                    <img src="/lovable-uploads/4f4470c7-ab55-4cf6-8e0c-0ad253b45b59.png" alt="VYBA app en iPhone" className="w-auto h-auto max-h-[500px] object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Promocionarte como artista */}
          <div className="mb-24 md:mb-40 max-w-7xl mx-auto">
            <div className={cn(
              "mb-10 md:mb-16",
              isMobile ? "text-left" : "text-center"
            )}>
              <h2 className={cn(
                "font-black mb-3 max-w-3xl mx-auto",
                isMobile ? "text-2xl" : "text-4xl md:text-6xl"
              )}>
                Promocionarte como artista es muy fácil
              </h2>
            </div>
            
            <div className={cn(
              "grid gap-8",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
            )}>
              {/* Card 1 */}
              <div className={cn(
                "flex flex-col",
                isMobile ? "items-start text-left" : "items-center text-center"
              )}>
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center ml-2 mr-3">
                    <Target className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-base pr-4">Publica en pocos pasos</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                  Publica tu perfil de artista <span className="font-bold">totalmente gratis</span> en menos de 5 minutos
                </p>
              </div>
              
              {/* Card 2 */}
              <div className={cn(
                "flex flex-col",
                isMobile ? "items-start text-left" : "items-center text-center"
              )}>
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center ml-2 mr-3">
                    <Infinity className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-base pr-4">Haz cambios cuando necesites</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                  Haz actualizaciones en tu perfil a cualquier hora
                </p>
              </div>
              
              {/* Card 3 */}
              <div className={cn(
                "flex flex-col",
                isMobile ? "items-start text-left" : "items-center text-center"
              )}>
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center mr-3 ml-2">
                    <HeartHandshake className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-base pr-4">Recibe ayuda si lo necesitas</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                  Si necesitas ayuda o ves que algo no está funcionando correctamente no dudes en contactarnos
                </p>
              </div>
            </div>
          </div>
          
          {/* Un sitio, todas las herramientas */}
          <div className="mb-24 md:mb-40 max-w-7xl mx-auto">
            <div className={cn(
              "mb-10 md:mb-16",
              isMobile ? "text-left" : "text-center"
            )}>
              <h2 className={cn(
                "font-black mb-3 max-w-3xl mx-auto",
                isMobile ? "text-2xl" : "text-4xl md:text-6xl"
              )}>
                Un sitio, todas las herramientas
              </h2>
            </div>
            
            <div className={cn(
              "grid gap-8",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
            )}>
              {/* Card 1: Estadísticas */}
              <div className={cn(
                "flex flex-col",
                isMobile ? "items-start" : "items-center"
              )}>
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl w-full aspect-square mb-6 flex items-center justify-center">
                  <BarChart3 className="h-16 md:h-24 w-16 md:w-24 text-black dark:text-white" />
                </div>
                <h3 className={cn(
                  "text-xl font-bold mb-2",
                  isMobile ? "text-left" : "text-center"
                )}>Estadísticas</h3>
                <p className={cn(
                  "text-gray-600 dark:text-gray-300",
                  isMobile ? "text-left" : "text-center"
                )}>
                  Revisa las estadísticas de tu perfil a tiempo real.
                </p>
              </div>
              
              {/* Card 2: Mensajes */}
              <div className={cn(
                "flex flex-col",
                isMobile ? "items-start" : "items-center"
              )}>
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl w-full aspect-square mb-6 flex items-center justify-center">
                  <MessageSquare className="h-16 md:h-24 w-16 md:w-24 text-black dark:text-white" />
                </div>
                <h3 className={cn(
                  "text-xl font-bold mb-2",
                  isMobile ? "text-left" : "text-center"
                )}>Mensajes</h3>
                <p className={cn(
                  "text-gray-600 dark:text-gray-300",
                  isMobile ? "text-left" : "text-center"
                )}>
                  Comunícate de manera fácil y rápida con tus clientes.
                </p>
              </div>
              
              {/* Card 3: Calendario */}
              <div className={cn(
                "flex flex-col",
                isMobile ? "items-start" : "items-center"
              )}>
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl w-full aspect-square mb-6 flex items-center justify-center">
                  <Calendar className="h-16 md:h-24 w-16 md:w-24 text-black dark:text-white" />
                </div>
                <h3 className={cn(
                  "text-xl font-bold mb-2",
                  isMobile ? "text-left" : "text-center"
                )}>Calendario</h3>
                <p className={cn(
                  "text-gray-600 dark:text-gray-300",
                  isMobile ? "text-left" : "text-center"
                )}>
                  Organiza tus bolos en un solo calendario.
                </p>
              </div>
            </div>
          </div>
          
          {/* ¿Tienes alguna duda? */}
          <div className="mb-16 md:mb-32 max-w-3xl mx-auto">
            <HelpSection />
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>;
};
export default ArtistBenefitsPage;
