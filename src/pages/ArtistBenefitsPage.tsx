
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Expand, Target, Infinity, HeartHandshake, BarChart3, MessageSquare, Calendar } from "lucide-react";
import SimpleNavbar from "@/components/SimpleNavbar";
import { PageTransition } from '@/components/ui/page-transition';
import HelpSection from '@/components/HelpSection';
import Footer from '@/components/Footer';

const ArtistBenefitsPage = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/artist-onboarding');
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
        <SimpleNavbar />
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="mt-6 mb-24 px-4 md:px-10 lg:px-14 xl:px-16">
            <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center">
                {/* Left content container */}
                <div className="p-8 md:p-16 lg:p-24 xl:p-32 flex flex-col items-center md:items-start justify-center w-full md:w-1/2 text-center md:text-left">
                  <div className="mb-6">
                    <Expand className="h-12 w-12 text-black dark:text-white" />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black mb-6 dark:text-white">
                    Impulsa tu carrera con VYBA
                  </h1>
                  <div>
                    <Button onClick={handleGetStarted} className="w-full md:w-auto">
                      Empezar ahora
                    </Button>
                  </div>
                </div>
                {/* Right image container */}
                <div className="w-full md:w-1/2 h-full flex items-end justify-center self-end">
                  <img 
                    src="/lovable-uploads/4f4470c7-ab55-4cf6-8e0c-0ad253b45b59.png" 
                    alt="VYBA app en iPhone" 
                    className="w-auto h-auto max-h-[350px] md:max-h-[500px] object-contain" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Promocionarte como artista */}
          <div className="mb-40 px-4 md:px-10 lg:px-14 xl:px-16 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-3 max-w-3xl mx-auto">
                Promocionarte como artista es muy fácil
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {/* Card 1 */}
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center ml-2 mr-3">
                    <Target className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-base pr-4">Publica en pocos pasos</h3>
                </div>
                <div className="px-8">
                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    Publica tu perfil de artista <span className="font-bold">totalmente gratis</span> en menos de 5 minutos
                  </p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center ml-2 mr-3">
                    <Infinity className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-base pr-4">Haz cambios cuando necesites</h3>
                </div>
                <div className="px-8">
                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    Haz actualizaciones en tu perfil a cualquier hora
                  </p>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-full py-2">
                  <div className="bg-white dark:bg-black w-10 h-10 rounded-full flex items-center justify-center mr-3 ml-2">
                    <HeartHandshake className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <h3 className="font-bold text-base pr-4">Recibe ayuda si lo necesitas</h3>
                </div>
                <div className="px-8">                
                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    Si necesitas ayuda o ves que algo no está funcionando correctamente no dudes en contactarnos
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Un sitio, todas las herramientas */}
          <div className="mb-40 px-4 md:px-10 lg:px-14 xl:px-16 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-3 max-w-3xl mx-auto">
                Un sitio, todas las herramientas
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Estadísticas */}
              <div className="flex flex-col items-center">
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl w-full aspect-square mb-6 flex items-center justify-center">
                  <BarChart3 className="h-24 w-24 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Estadísticas</h3>
                <div className="max-w-lg">
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Revisa las estadísticas de tu perfil a tiempo real.
                  </p>
                </div>
              </div>
              
              {/* Card 2: Mensajes */}
              <div className="flex flex-col items-center">
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl w-full aspect-square mb-6 flex items-center justify-center">
                  <MessageSquare className="h-24 w-24 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mensajes</h3>
                <div className="max-w-lg">
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Comunícate de manera fácil y rápida con tus clientes.
                  </p>
                </div>
              </div>
              
              {/* Card 3: Calendario */}
              <div className="flex flex-col items-center">
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-3xl w-full aspect-square mb-6 flex items-center justify-center">
                  <Calendar className="h-24 w-24 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Calendario</h3>
                <div className="max-w-lg">
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Organiza tus bolos en un solo calendario.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ¿Tienes alguna duda? */}
          <div className="mb-32 px-4 md:px-10 lg:px-14 xl:px-16 max-w-3xl mx-auto">
            <HelpSection />
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ArtistBenefitsPage;
