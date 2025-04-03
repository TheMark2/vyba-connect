
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import TimelineStep from "@/components/TimelineStep";
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
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-10 pb-20">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mb-8" 
            onClick={() => navigate(-1)}
            aria-label="Volver atrás"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-black mb-4 dark:text-white">
                Impulsa tu carrera con VYBA
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Conecta con nuevas audiencias, gestiona tus eventos y haz crecer tu presencia como artista con nuestra plataforma especializada.
              </p>
              <Button 
                onClick={handleGetStarted}
                className="text-base px-8 py-6"
              >
                Empezar ahora
              </Button>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="max-w-[300px] relative">
                <div className="rounded-[40px] overflow-hidden border-[12px] border-black shadow-2xl">
                  <AspectRatio ratio={9/19} className="bg-black">
                    <img 
                      src="/lovable-uploads/a0f787b7-95b2-4812-bb47-92c07a3dde8b.png" 
                      alt="VYBA app en iPhone" 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <div className="absolute -z-10 top-8 -left-8 -right-8 -bottom-8 rounded-[55px] bg-black/10 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Beneficios Section */}
        <div className="bg-vyba-cream dark:bg-vyba-dark-secondary py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 dark:text-white">
              Beneficios de ser artista en VYBA
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Mayor visibilidad",
                  description: "15 personas han visitado tu perfil",
                  icon: "/lovable-uploads/44a24fa0-075e-4cca-8379-09d59e85165c.png",
                },
                {
                  title: "Comunicación directa",
                  description: "15 mensajes sin leer",
                  icon: "/lovable-uploads/44a24fa0-075e-4cca-8379-09d59e85165c.png",
                },
                {
                  title: "Gestión de eventos",
                  description: "Tienes 3 eventos dentro de poco",
                  icon: "/lovable-uploads/44a24fa0-075e-4cca-8379-09d59e85165c.png",
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-white dark:bg-vyba-dark-bg rounded-2xl p-6 shadow-lg transition-transform hover:translate-y-[-5px]">
                  <img 
                    src={benefit.icon} 
                    alt={benefit.title} 
                    className="w-16 h-16 object-cover mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Features Timeline */}
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 dark:text-white">
            Cómo VYBA impulsa tu carrera
          </h2>
          
          <TimelineStep 
            title="Perfil profesional personalizado"
            description="Crea un perfil atractivo que muestre tu talento, experiencia y estilo. Atrae a más clientes potenciales con una presencia online profesional."
            imagePosition="right"
          >
            <div className="rounded-xl overflow-hidden shadow-lg">
              <AspectRatio ratio={16/9}>
                <img 
                  src="/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png" 
                  alt="Perfil de artista" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </TimelineStep>
          
          <TimelineStep 
            title="Gestión eficiente de eventos"
            description="Administra tus actuaciones, talleres y eventos en un solo lugar. Recibe notificaciones y mantén un calendario organizado de tus actividades."
            imagePosition="left"
          >
            <div className="rounded-xl overflow-hidden shadow-lg">
              <AspectRatio ratio={16/9}>
                <img 
                  src="/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png" 
                  alt="Calendario de eventos" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </TimelineStep>
          
          <TimelineStep 
            title="Comunicación directa con clientes"
            description="Responde a consultas, negocia contratos y coordina detalles directamente con los interesados en tu trabajo mediante nuestra plataforma de mensajería integrada."
            imagePosition="right"
          >
            <div className="rounded-xl overflow-hidden shadow-lg">
              <AspectRatio ratio={16/9}>
                <img 
                  src="/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png" 
                  alt="Comunicación con clientes" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </TimelineStep>
        </div>
        
        {/* Call-to-Action */}
        <div className="bg-vyba-cream dark:bg-vyba-dark-secondary py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white">
              ¿Listo para impulsar tu carrera artística?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Únete a VYBA hoy y comienza a disfrutar de todas las herramientas y oportunidades diseñadas especialmente para artistas como tú.
            </p>
            <Button 
              onClick={handleGetStarted}
              className="text-base px-8 py-6"
            >
              Empezar ahora
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ArtistBenefitsPage;
