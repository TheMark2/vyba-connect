import React, { useState, useEffect } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageSquare, Bell, Search, Users, Music, Send, BellRing, UserCog, ArrowRight, AlertCircle, Star, Music2, Calendar, Sparkles, Guitar, Headphones, Mic2, Drum, Piano, Radio, ChevronRight, Package, GalleryVerticalEnd } from 'lucide-react';
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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';

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
    },
    {
      id: 3,
      icon: <GalleryVerticalEnd className="h-6 w-6 text-vyba-navy" />,
      title: "Todos los artistas",
      content: "Ver todos los artistas",
      route: "/artists"
    }
  ];

  // Datos para los badges de artistas
  const artistBadges = [
    { id: 1, icon: <Guitar className="h-4 w-4" />, label: "Guitarrista" },
    { id: 2, icon: <Users className="h-4 w-4" />, label: "Grupo de versiones" },
    { id: 4, icon: <Piano className="h-4 w-4" />, label: "Pianista" },
    { id: 5, icon: <Headphones className="h-4 w-4" />, label: "DJ" },
    { id: 6, icon: <Drum className="h-4 w-4" />, label: "Baterista" },
    { id: 7, icon: <Mic2 className="h-4 w-4" />, label: "Bajista" },
    { id: 8, icon: <Music2 className="h-4 w-4" />, label: "Trompetista" },
    { id: 9, icon: <Radio className="h-4 w-4" />, label: "Violinista" }
  ];
  
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);
  
  const handleBadgeClick = (id: number) => {
    setSelectedBadge(id === selectedBadge ? null : id);
    // Aquí podríamos filtrar artistas por tipo o navegar a una búsqueda específica
    navigate(`/search?type=${artistBadges.find(b => b.id === id)?.label || ''}`);
  };

  // Optimización: Cargar datos del usuario y estado de onboarding en un solo efecto
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Verificar si hay datos en caché
        const cachedUserData = sessionStorage.getItem('userData');
        const cacheTimestamp = sessionStorage.getItem('userDataTimestamp');
        const now = Date.now();
        
        // Si hay datos en caché y tienen menos de 5 minutos, usarlos
        if (cachedUserData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 5 * 60 * 1000) {
          const userData = JSON.parse(cachedUserData);
          setUserName(userData.name);
          setShowOnboardingAlert(userData.showOnboardingAlert);
          console.log("Usando caché - Estado de alerta:", userData.showOnboardingAlert);
          setFavoritesCount(userData.favoritesCount);
          setMessagesCount(userData.messagesCount);
          setFeaturedArtists(mockFeaturedArtists);
          setIsLoading(false);
          return;
        }

        // Obtener los datos del usuario
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No hay usuario autenticado');
          setIsLoading(false);
          return;
        }

        console.log("Usuario autenticado:", user.id);

        // Una sola llamada a la API para obtener todos los datos necesarios
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, onboarding_status')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error al obtener datos del usuario:', profileError);
          
          // Forzar a mostrar la alerta en caso de error
          setShowOnboardingAlert(true);
          console.log("Error en consulta - Mostrando alerta por defecto");
          
          // Datos por defecto en caso de error
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario');
          setFavoritesCount(5); // Valores predeterminados para datos no disponibles
          setMessagesCount(2);
        } else {
          console.log("Datos de perfil:", profileData);
          console.log("Estado de onboarding:", profileData.onboarding_status);
          
          // Determinar si mostrar la alerta - por defecto mostrar si no hay datos claros
          const shouldShowAlert = !profileData.onboarding_status || 
                                 profileData.onboarding_status === 'pending' || 
                                 profileData.onboarding_status === 'skipped';
          
          console.log("¿Mostrar alerta?", shouldShowAlert);
          
          // Guardar datos en la sesión
          const userData = {
            name: profileData.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
            showOnboardingAlert: shouldShowAlert,
            favoritesCount: 5, // Temporalmente usamos valores fijos
            messagesCount: 2
          };
          
          // Almacenar en caché
          sessionStorage.setItem('userData', JSON.stringify(userData));
          sessionStorage.setItem('userDataTimestamp', now.toString());
          
          // Actualizar estado
          setUserName(userData.name);
          setShowOnboardingAlert(userData.showOnboardingAlert);
          setFavoritesCount(userData.favoritesCount);
          setMessagesCount(userData.messagesCount);
        }

        // Usar datos de ejemplo para artistas destacados
        setFeaturedArtists(mockFeaturedArtists);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        // En caso de error, mostrar la alerta por defecto
        setShowOnboardingAlert(true);
        console.log("Error general - Mostrando alerta por defecto");
        
        toast.error('Error al cargar tus datos', {
          description: 'Por favor, intenta refrescar la página'
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Limpiar la caché al iniciar para forzar una nueva consulta
    // Solo en modo desarrollo
    if (import.meta.env.DEV) {
      sessionStorage.removeItem('userData');
      console.log("Caché limpiada en modo desarrollo");
    }

    fetchUserData();
  }, []);

  const handleArtistCardClick = (artistId: number) => {
    navigate(`/artista/${artistId}`);
  };

  const handleSummaryCardClick = (route: string) => {
    navigate(route);
  };
  
  const handleGoToOnboarding = () => {
    // Al ir al onboarding, removemos la bandera de que se ha saltado
    localStorage.removeItem('onboarding_skipped');
    // Limpiar la caché cuando el usuario decide completar el onboarding
    sessionStorage.removeItem('userData');
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

  const renderSkeletons = () => (
    <>
      {/* Skeleton para el encabezado y mensaje de alerta */}
      <div className="mb-6">
        <div className="bg-vyba-gray/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full bg-vyba-gray/50" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40 mb-2 bg-vyba-gray/50" />
              <Skeleton className="h-4 w-full max-w-md bg-vyba-gray/50" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md bg-vyba-gray/50" />
          </div>
        </div>
      </div>

      {/* Skeleton para los badges de artistas */}
      <div className="my-6">
        <div className="flex gap-2 overflow-x-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-md bg-vyba-gray/50 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Skeleton para las tarjetas de resumen */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-vyba-gray rounded-2xl p-8 h-48">
            <Skeleton className="h-6 w-6 mb-16 bg-vyba-gray/50" />
            <Skeleton className="h-6 w-32 mb-2 bg-vyba-gray/50" />
            <Skeleton className="h-4 w-24 bg-vyba-gray/50" />
          </div>
        ))}
      </div>

      {/* Skeleton para la sección de novedades */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48 bg-vyba-gray/50" />
        </div>
        <Skeleton className="h-16 w-full max-w-md rounded-2xl bg-vyba-gray/50" />
      </div>
    </>
  );

  return (
    <UserDashboardLayout>
      <main className="mt-8">
        <header className="container mx-auto py-4 px-0">
          <div className="px-6 md:px-8">
            <h1 className="text-4xl font-semibold">¡Buenas, {userName || 'Usuario'}!</h1>
          </div>
        </header>

        {isLoading ? (
          <section className="container mx-auto px-6 md:px-8">
            {renderSkeletons()}
          </section>
        ) : (
          <>
            {showOnboardingAlert && (
              <section className="container mx-auto px-6 md:px-8">
                <Alert className="bg-vyba-gray border-none rounded-xl my-8" role="alert">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-[#C13515] rounded-full" aria-hidden="true">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <AlertTitle className="text-base font-medium mb-0 text-vyba-navy">Completa tu perfil</AlertTitle>
                        <AlertDescription className="text-sm text-vyba-navy/80 font-figtree">
                          ¡Personaliza tu experiencia! Añade tu foto de perfil, ubicación y preferencias musicales para encontrar los mejores artistas.
                        </AlertDescription>
                      </div>
                    </div>
                    <Button 
                      onClick={handleGoToOnboarding} 
                      variant="terciary"
                      className="whitespace-nowrap flex items-center gap-2"
                      aria-label="Completar perfil ahora"
                    >
                      Completar ahora
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </Alert>
              </section>
            )}

            <nav className="my-3 container mx-auto px-0 md:px-0" aria-label="Filtros de artistas">
              <Swiper
                spaceBetween={10}
                slidesPerView={'auto'}
                className="w-full badge-slider px-6 md:px-8"
                centeredSlides={false}
                grabCursor={true}
                modules={[FreeMode]}
              >
                {artistBadges.map((badge) => (
                  <SwiperSlide key={badge.id} style={{ width: 'auto' }}>
                    <Button
                      variant="secondary"
                      onClick={() => handleBadgeClick(badge.id)}
                      className={cn(
                        "rounded-md py-2 px-4 flex items-center gap-2 transition-all font-medium",
                        selectedBadge === badge.id
                          ? "bg-vyba-navy text-white" 
                          : "bg-vyba-gray text-vyba-navy hover:bg-vyba-gray/80"
                      )}
                      aria-pressed={selectedBadge === badge.id}
                    >
                      {badge.icon}
                      <span className="text-sm font-medium">{badge.label}</span>
                    </Button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </nav>

            <section aria-label="Tarjetas de resumen">
              {shouldShowCarousel ? (
                <div className="px-0 md:px-0 mb-8 overflow-hidden">
                  <Swiper
                    spaceBetween={16}
                    slidesPerView={'auto'}
                    pagination={{ clickable: true }}
                    grabCursor={true}
                    className="px-6 md:px-8"
                  >
                    {summaryCards.map((card) => (
                      <SwiperSlide
                        key={card.id}
                        className={getSummaryCardSize() + " !w-[80%] md:!w-[60%] max-w-[400px] rounded-2xl"}
                      >
                        <Card
                          className={cn(
                            "bg-vyba-gray shadow-none rounded-2xl border-none cursor-pointer transition-all",
                            "active:scale-95 hover:bg-vyba-gray/80"
                          )}
                          onClick={() => handleSummaryCardClick(card.route)}
                        >
                          <CardContent className="p-8 flex flex-col justify-between items-start h-48">
                            <div aria-hidden="true">{card.icon}</div>
                            <div className="flex flex-col items-start">
                              <h3 className="text-vyba-navy text-xl font-medium mb-1 font-semibold">{card.title}</h3>
                              <p className="text-base text-vyba-tertiary mb-0">{card.content}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="container mx-auto px-4 md:px-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          <div aria-hidden="true">
                            {card.icon}
                          </div>
                          <div className="flex flex-col items-start">
                            <h3 className="text-vyba-navy text-xl font-medium mb-1 font-semibold">{card.title}</h3>
                            <p className="text-base text-vyba-tertiary mb-0">{card.content}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section aria-label="Novedades">
              <div className="container mx-auto px-6 md:px-8 mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-semibold">Novedades</h2>
                </div>
              </div>
              
              <div className="container px-4 md:px-8 mb-10">
                <div className="bg-vyba-gray rounded-2xl flex items-center justify-start gap-4 p-4 w-fit">
                  <Package className="h-6 w-6 text-vyba-navy" aria-hidden="true" />
                  <p className="text-vyba-navy text-base font-medium">Sin novedades por ahora. ¡Dentro de poco!</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </UserDashboardLayout>
  );
};

export default UserDashboardPage;