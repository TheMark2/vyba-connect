import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, UserSearch, Hourglass, Speaker, Theater, CalendarClock, MessageSquare, Clock, Lightbulb, Star, CircleAlert, FileUser, Wrench, Timer, GraduationCap, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { type ArtistProfile, type OnboardingCard } from "@/types/artist";

const Overview = () => {
  const [userName] = useState<string>("Usuario");
  const [profileProgress] = useState<number>(45);

  const [artistProfile] = useState<ArtistProfile>({
    experience: [],
    shows: [],
    equipment: undefined,
    timeRequirements: undefined,
    education: undefined,
    teamMembers: undefined
  });

  const getCardStatus = (field: keyof ArtistProfile) => {
    if (artistProfile[field] === undefined) return false;
    if (Array.isArray(artistProfile[field])) {
      return (artistProfile[field] as any[]).length > 0;
    }
    return true;
  };

  const onboardingCards: OnboardingCard[] = [
    {
      id: "essentials",
      title: "¡Rellena información importante!",
      description: "Informacion como tu biografia, genero musical, redes sociales, etc.",
      icon: <FileUser className="h-12 w-12 text-vyba-navy self-start mb-auto" strokeWidth={1.5} />,
      field: "teamMembers"
    },
    {
      id: "experience",
      title: "Experiéncia",
      description: "Cuéntanos qué has hecho hasta ahora: shows, proyectos, trayectoria...",
      icon: <Theater className="h-12 w-12 text-vyba-navy self-start mb-auto" strokeWidth={1.5} />,
      field: "experience"
    },
    {
      id: "equipment",
      title: "¿Tienes equipo propio?",
      description: "¿Tienes tu propio sonido, luces o set para tocar? ¡Esto suma puntos!",
      icon: <Speaker className="h-12 w-12 text-vyba-navy self-start mb-auto" strokeWidth={1.5} />,
      field: "equipment"
    },
    {
      id: "timeRequirements",
      title: "¿Cuáles son tus tiempos?",
      description: "Dinos cuánto tardas en montar y en realizar la prueba de sonido.",
      icon: <Hourglass className="h-12 w-12 text-vyba-navy self-start mb-auto" strokeWidth={1.5} />,
      field: "timeRequirements"
    },
    {
      id: "education",
      title: "¿Tienes formación?",
      description: "Si has estudiado música o algo relacionado, ¡este es tu espacio!",
      icon: <GraduationCap className="h-12 w-12 text-vyba-navy self-start mb-auto" strokeWidth={1.5} />,
      field: "education"
    },
    {
      id: "teamMembers",
      title: "¿Quiénes son los integrantes?",
      description: "Presenta a tu crew o banda. ¡Queremos saber quiénes están detrás del show!",
      icon: <UserSearch className="h-12 w-12 text-vyba-navy self-start mb-auto" strokeWidth={1.5} />,
      field: "teamMembers"
    }
  ];

  const incompleteCards = onboardingCards.filter(card => !artistProfile[card.field] || artistProfile[card.field]?.length === 0);

  return (
    <div className="mt-48">
      <div className="flex flex-col justify-between items-left mb-8 px-32 ">
        <h1 className="text-6xl font-semibold mb-6">Bienvenido, {userName}</h1>
        <p className="text-xl font-light text-muted-foreground text-vyba-tertiary">Acaba de completar tu perfil para recibir mas solicitudes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-32">
        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <h2 className="text-xl font-medium mb-1">Verifica tu identidad</h2>
          <p className="text-muted-foreground text-xs text-red-500">
            Requerido para publicar tu perfil
          </p>
          
          <div className="flex items-center w-full mt-4">
            <Button variant="link" className="p-0 text-vyba-tertiary text-sm text-vyba-navy underline rounded-none">
              Verificar ahora
            </Button>
          </div>
          <CircleAlert className="absolute top-1/2 right-6 stroke-[1.5] -translate-y-1/2 h-10 w-10 text-red-500" />
        </div>

        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <div className="flex justify-between items-center">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-medium mb-1">Progreso</h2>
              <p className="text-muted-foreground text-sm text-vyba-tertiary font-light mb-0">
                Con un 100% hay mas probabilidades de recibir mas solicitudes
              </p>
            </div>
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-vyba-tertiary/20 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                    />
                    <circle
                      className="text-green-500 stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 40}`,
                        strokeDashoffset: `${2 * Math.PI * 40 * (1 - profileProgress / 100)}`,
                        transformOrigin: '50% 50%',
                        transform: 'rotate(-90deg)',
                        transition: 'stroke-dashoffset 0.5s ease-in-out'
                      }}
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium">{profileProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <div className="flex-1 pr-12">
            <h2 className="text-xl font-medium mb-1">Eventos próximos</h2>
            <p className="text-muted-foreground text-sm text-vyba-tertiary pr-12 font-light">
              Tienes 3 eventos programados para este mes
            </p>
            
            <div className="flex items-center w-full mt-4">
              <Button variant="link" className="p-0 text-vyba-tertiary text-sm text-vyba-navy underline rounded-none">
                Ver calendario
              </Button>
            </div>
          </div>
          <CalendarClock className="absolute top-1/2 right-6 -translate-y-1/2 h-10 w-10 text-vyba-navy stroke-[1.5]" />
        </div>

        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <div className="flex-1 pr-12">
            <h2 className="text-xl font-medium mb-1">Mensajes nuevos</h2>
            <p className="text-muted-foreground text-sm text-vyba-tertiary pr-12 font-light">
              Tienes 5 mensajes sin leer de clientes potenciales
            </p>
            
            <div className="flex items-center w-full mt-4">
              <Button variant="link" className="p-0 text-vyba-tertiary text-sm text-vyba-navy underline rounded-none">
                Revisar mensajes
              </Button>
            </div>
          </div>
          <MessageSquare className="absolute top-1/2 right-6 stroke-[1.5] -translate-y-1/2 h-10 w-10 text-vyba-navy" />
        </div>

        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <div className="flex-1 pr-12">
            <h2 className="text-xl font-medium mb-1">Recordatorios</h2>
            <p className="text-muted-foreground text-sm text-vyba-tertiary pr-12 font-light">
              Apúntate todos los eventos en el calendario para así no olvidarte
            </p>
            
            <div className="flex items-center w-full mt-4">
              <Button variant="link" className="p-0 text-vyba-tertiary text-sm text-vyba-navy underline rounded-none">
                Ver todos
              </Button>
            </div>
          </div>
          <Clock className="absolute top-1/2 right-6 stroke-[1.5] -translate-y-1/2 h-10 w-10 text-vyba-navy" />
        </div>

        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <div className="flex-1 pr-12">
            <h2 className="text-xl font-medium mb-1">Consejos</h2>
            <p className="text-muted-foreground text-sm text-vyba-tertiary pr-12 font-light">
              Responde a los mensajes lo más rápido posible para así ofrecer una mejor experiencia a quienes te escriben.
            </p>
            
            <div className="flex items-center w-full mt-4">
              <Button variant="link" className="p-0 text-vyba-tertiary text-sm text-vyba-navy underline rounded-none">
                Más consejos
              </Button>
            </div>
          </div>
          <Lightbulb className="absolute top-1/2 right-6 stroke-[1.5] -translate-y-1/2 h-10 w-10 text-vyba-navy" />
        </div>

        <div className="bg-vyba-gray rounded-2xl p-6 relative">
          <div className="flex-1 pr-12">
            <h2 className="text-xl font-medium mb-1">Novedades</h2>
            <p className="text-muted-foreground text-sm text-vyba-tertiary pr-12 font-light">
              Nuevas funciones disponibles para mejorar tu visibilidad
            </p>
            
            <div className="flex items-center w-full mt-4">
              <Button variant="link" className="p-0 text-vyba-tertiary text-sm text-vyba-navy underline rounded-none">
                Explorar
              </Button>
            </div>
          </div>
          <Star className="absolute top-1/2 right-6 stroke-[1.5] -translate-y-1/2 h-10 w-10 text-vyba-navy" />
        </div>
      </div>

      {incompleteCards.length > 0 && (
        <section className="px-32 py-12 mt-24 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('/lovable-uploads/dashboardbannersteps.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>
          <div className="relative z-10 pt-16 text-white h-full flex flex-col justify-center">
            <h2 className="text-5xl font-semibold text-white mb-2">Pasos esenciales</h2>
            <p className="text-lg mb-6 text-white/80 font-light">Completa tu perfil para aumentar tus oportunidades de recibir más solicitudes</p>
          </div>
          
          <div className="relative z-10 pt-24 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {incompleteCards.map((card) => (
                <div key={card.id} className="h-64 bg-vyba-gray rounded-2xl p-6 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    {card.icon}
                    <div className={`w-3 h-3 rounded-full ${getCardStatus(card.field) ? 'bg-green-500' : 'bg-red-500'} self-start`}></div>
                  </div>
                  <div className="mt-auto">
                    <h2 className="text-lg font-medium text-vyba-navy mb-2">
                      {card.title}
                    </h2>
                    <p className="text-vyba-tertiary text-sm font-light mb-0">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button variant="secondary" className="w-max">Acabar de completar el perfil</Button>
        </section>
      )}
    </div>
  );
};

export default Overview;
