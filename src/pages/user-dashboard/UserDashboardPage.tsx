import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageSquare, Bell, Search, Users, Music, Send, BellRing, UserCog, ArrowRight, AlertCircle} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import ArtistProfileCard from '@/components/ArtistProfileCard';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [showOnboardingAlert, setShowOnboardingAlert] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Punto de corte para activar el carrusel (992px = lg en Tailwind)
  const CAROUSEL_BREAKPOINT = 1024;
  // Punto de corte para pantallas pequeñas vs medianas
  const MOBILE_BREAKPOINT = 640;

  // Actualizar el ancho de la ventana cuando cambia el tamaño
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determinar si se debe mostrar el carrusel basado en el ancho
  const shouldShowCarousel = windowWidth < CAROUSEL_BREAKPOINT;
  // Determinar si estamos en una pantalla móvil pequeña
  const isSmallMobile = windowWidth < MOBILE_BREAKPOINT;

  // Datos de ejemplo para artistas destacados
  const mockFeaturedArtists = [
    {
      id: 1,
      name: 'DJ Marcos',
      type: 'DJ',
      description: 'DJ con amplia experiencia en eventos y bodas',
      images: ['/images/dj1.webp', '/images/dj4.webp', '/images/dj5.webp'],
      rating: 4.8,
      priceRange: '300€'
    },
    {
      id: 2,
      name: 'Laura Voz',
      type: 'Cantante',
      description: 'Cantante versátil especializada en música pop y jazz',
      images: ['/images/dj2.webp', '/images/dj5.webp', '/images/dj6.webp'],
      rating: 4.7,
      priceRange: '450€'
    },
    {
      id: 3,
      name: 'Carlos Sax',
      type: 'Saxofonista',
      description: 'Saxofonista profesional con repertorio internacional',
      images: ['/images/dj3.webp', '/images/dj6.webp', '/images/dj1.webp'],
      rating: 4.9,
      priceRange: '350€'
    },
    {
      id: 4,
      name: 'María Guitarra',
      type: 'Guitarrista',
      description: 'Guitarrista clásica y flamenca para eventos exclusivos',
      images: ['/images/dj6.webp', '/images/dj2.webp', '/images/dj3.webp'],
      rating: 4.6,
      priceRange: '320€'
    }
  ];

  // Mock de mensajes recientes
  const recentMessages = [
    {
      id: 1,
      sender: 'DJ Marcos',
      avatar: '/images/dj1.webp',
      preview: 'Hola, gracias por contactarme...',
      time: '10:30'
    },
    {
      id: 2,
      sender: 'Laura Voz',
      avatar: '/images/dj2.webp',
      preview: 'Tengo disponibilidad para...',
      time: 'Ayer'
    }
  ];

  // Datos de resumen para el carrusel con rutas de navegación
  const summaryCards = [
    {
      id: 1,
      icon: <Heart className="h-6 w-6 text-vyba-navy" />,
      title: "Favoritos",
      content: `Tienes ${favoritesCount} favoritos`,
      route: "/user-dashboard/favorites"
    },
    {
      id: 2,
      icon: <Send className="h-6 w-6 text-vyba-navy" />,
      title: "Mensajes",
      content: `Tienes ${messagesCount} mensajes`,
      route: "/user-dashboard/messages"
    },
    {
      id: 3,
      icon: <BellRing className="h-6 w-6 text-vyba-navy" />,
      title: "Notificaciones",
      content: "Tienes 5 notificaciones",
      route: "/user-dashboard/notifications"
    }
  ];

  // Verificar si el usuario ha saltado el onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // 1. Obtener información del usuario desde Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No hay usuario autenticado');
          return;
        }
        
        // 2. Verificar si el usuario ha saltado el onboarding en sus metadatos
        const onboardingSkippedInMetadata = user.user_metadata?.onboarding_skipped === true;
        
        // 3. Si encontramos que el usuario ha saltado el onboarding en los metadatos,
        // sincronizamos localStorage para mantener consistencia
        if (onboardingSkippedInMetadata) {
          localStorage.setItem('onboarding_skipped', 'true');
        }
        
        // 4. También podemos verificar en localStorage por compatibilidad con código existente
        const hasSkippedOnboardingLocal = localStorage.getItem('onboarding_skipped') === 'true';
        const isFromRegistrationLocal = localStorage.getItem('is_from_registration') === 'true';
        
        // 5. Combinar todas las fuentes para determinar si mostrar la alerta
        const shouldShowAlert = onboardingSkippedInMetadata || hasSkippedOnboardingLocal || isFromRegistrationLocal;
        
        // Registrar valores para depuración
        console.log('Estado de onboarding:', {
          metadatos: onboardingSkippedInMetadata,
          localStorage: {
            hasSkippedOnboarding: hasSkippedOnboardingLocal,
            isFromRegistration: isFromRegistrationLocal,
          },
          mostrarAlerta: shouldShowAlert
        });
        
        // Actualizar el estado para mostrar la alerta si es necesario
        setShowOnboardingAlert(shouldShowAlert);
        
      } catch (error) {
        console.error('Error al verificar estado de onboarding:', error);
      }
    };
    
    checkOnboardingStatus();
  }, []);

  // Obtener información del usuario
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario');
          
          // Por ahora usamos datos simulados
          setFavoritesCount(5);
          setMessagesCount(2);
          setFeaturedArtists(mockFeaturedArtists);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        toast.error('Error al cargar tus datos', {
          description: 'Por favor, intenta refrescar la página'
        });
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, []);

  const handleArtistClick = (artistId: number) => {
    navigate(`/artista/${artistId}`);
  };

  const handleSummaryCardClick = (route: string) => {
    navigate(route);
  };
  
  const handleGoToOnboarding = () => {
    // Al ir al onboarding, removemos la bandera de que se ha saltado
    localStorage.removeItem('onboarding_skipped');
    navigate('/user-onboarding');
  };

  // Determinar el tamaño de las tarjetas en el carrusel según el ancho de pantalla
  const getSummaryCardSize = () => {
    if (isSmallMobile) {
      return 'basis-[76%] max-w-[76%]'; // Pantallas móviles pequeñas: una tarjeta con vista parcial de la siguiente
    } else {
      return 'basis-[42%] max-w-[42%]'; // Pantallas medianas: tarjetas más estrechas para ver más de la siguiente
    }
  };
  
  // Determinar el tamaño de las tarjetas de artistas en el carrusel según el ancho de pantalla
  const getArtistCardSize = () => {
    if (isSmallMobile) {
      return 'basis-[76%] max-w-[76%]'; // Pantallas móviles pequeñas: una tarjeta con vista parcial de la siguiente
    } else {
      return 'basis-[42%] max-w-[42%]'; // Pantallas medianas: tarjetas más estrechas para ver más de la siguiente
    }
  };

  return (
    <UserDashboardLayout>
      <div className="mt-16">
        {/* Contenido con padding solo para la parte superior */}
        <div className="container mx-auto py-8 px-4 md:px-8">
          {/* Encabezado y saludo */}
          <div>
            <h1 className="text-4xl font-semibold mb-4">¡Buenas, {userName}!</h1>
            
            {/* Alerta de onboarding no completado - simplificada */}
            {showOnboardingAlert && (
              <Alert className="bg-vyba-gray mb-6 border-none rounded-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#C13515] rounded-full">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <AlertTitle className="text-base font-medium mb-0 text-vyba-navy">Completa tu perfil</AlertTitle>
                      <AlertDescription className="text-sm text-vyba-navy/80 font-figtree">
                        ¡Personaliza tu experiencia! Añade tu foto de perfil y preferencias musicales para encontrar los mejores artistas.
                      </AlertDescription>
                    </div>
                  </div>
                  <Button 
                    onClick={handleGoToOnboarding} 
                    variant="terciary"
                    className="whitespace-nowrap flex items-center gap-2"
                  >
                    Completar ahora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Alert>
            )}
          </div>
        </div>

        {/* Tarjetas de resumen - Sin padding horizontal en modo carrusel */}
        {shouldShowCarousel ? (
          // Vista de carrusel para pantallas pequeñas - Sin padding horizontal
          <div className="mb-6 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 mb-4">
              <h2 className="text-2xl font-semibold">Resumen</h2>
            </div>
            <Carousel 
              opts={{
                align: "start",
                loop: false,
              }} 
              className="w-full"
            >
              <CarouselContent className="ml-0 gap-2 pl-4 pr-4">
                {summaryCards.map((card, index) => (
                  <CarouselItem 
                    key={card.id} 
                    className={`pl-2 ${getSummaryCardSize()}`}
                  >
                    <Card 
                      className={cn(
                        "bg-vyba-gray shadow-none rounded-2xl border-none h-48 cursor-pointer transition-all duration-150",
                        "active:scale-95 hover:bg-vyba-gray/80"
                      )}
                      onClick={() => handleSummaryCardClick(card.route)}
                    >
                      <CardContent className="p-8 flex flex-col justify-between items-start h-full">
                        <div>
                          {card.icon}
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-vyba-navy text-xl font-medium mb-1 font-semibold">{card.title}</p>
                          <p className="text-base text-vyba-tertiary mb-0">{card.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
                {/* Elemento vacío para dar espacio al final */}
                <CarouselItem className="pl-2 basis-4 min-w-[16px]"></CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        ) : (
          // Vista normal para pantallas grandes con padding
          <div className="container mx-auto px-4 md:px-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summaryCards.map((card) => (
                <Card 
                  key={card.id}
                  className={cn(
                    "bg-vyba-gray shadow-none rounded-2xl border-none cursor-pointer transition-all duration-150",
                    "active:scale-95 hover:bg-vyba-gray/80"
                  )}
                  onClick={() => handleSummaryCardClick(card.route)}
                >
                  <CardContent className="p-8 flex flex-col justify-between items-start h-48">
                    <div>
                      {card.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-vyba-navy text-xl font-medium mb-1 font-semibold">{card.title}</p>
                      <p className="text-base text-vyba-tertiary mb-0">{card.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Artistas Destacados - Sin padding horizontal en modo carrusel */}
        <div className="mt-8">
          <div className="container mx-auto px-4 md:px-8 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">Artistas destacados</h2>
              <Button variant="ghost" onClick={() => navigate('/artists')}>Ver todos</Button>
            </div>
          </div>
          
          {shouldShowCarousel ? (
            // Vista con carrusel para pantallas menores a lg (1024px) - Sin padding horizontal
            <div className="mb-10 overflow-hidden">
              <Carousel 
                opts={{
                  align: "start",
                  loop: false,
                }} 
                className="w-full"
              >
                <CarouselContent className="ml-0 gap-2 pl-4 pr-4">
                  {featuredArtists.map((artist, index) => (
                    <CarouselItem 
                      key={artist.id} 
                      className={`pl-2 ${getArtistCardSize()}`}
                    >
                      <div className="h-full">
                        <ArtistProfileCard
                          name={artist.name}
                          type={artist.type}
                          description={artist.description}
                          images={artist.images}
                          rating={artist.rating}
                          priceRange={artist.priceRange}
                          onClick={() => handleArtistClick(artist.id)}
                          isRecommended={artist.id === 3}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                  {/* Elemento vacío para dar espacio al final */}
                  <CarouselItem className="pl-2 basis-4 min-w-[16px]"></CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          ) : (
            // Vista desktop en grid para pantallas lg (1024px) y superiores - Con padding
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredArtists.map((artist) => (
                  <ArtistProfileCard
                    key={artist.id}
                    name={artist.name}
                    type={artist.type}
                    description={artist.description}
                    images={artist.images}
                    rating={artist.rating}
                    priceRange={artist.priceRange}
                    onClick={() => handleArtistClick(artist.id)}
                    isRecommended={artist.id === 3}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Eventos - Con padding */}
        <div className="container mx-auto px-4 md:px-8 mt-8 mb-8">
          <div className="flex flex-col justify-start items-start mb-4 gap-4">
            <div className="flex items-center gap-8 mb-4">
              <h2 className="text-3xl font-semibold mb-0">Crea tus eventos y organízate mejor</h2>
              <Badge className="bg-vyba-navy text-white px-4 py-2 rounded-full">Próximamente</Badge>
            </div>
          </div>
          <div className="bg-vyba-gray rounded-2xl w-full h-48 border-dashed border-2 border-vyba-tertiary">

          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default UserDashboardPage; 