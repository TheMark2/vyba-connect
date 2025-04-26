import React, { useState, useRef, useEffect } from "react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { Button } from "@/components/ui/button";
import { artistsData as artistsDataFromArtistsPage } from "../ArtistsPage";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Diamond, Camera, ClipboardList } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Badge {
  id: number;
  icon: React.ReactNode;
  label: string;
  info: string;
}

const badges: Badge[] = [
  { id: 1, icon: <CheckCircle />, label: "Todos los perfiles verificados", info: "Nuestros artistas han sido verificados para garantizar calidad y confianza." },
  { id: 2, icon: <Diamond />, label: "Profesionales", info: "Contamos con artistas de alto nivel profesional para cualquier evento." },
  { id: 3, icon: <Camera />, label: "Equipo propio", info: "Nuestros artistas disponen de su propio equipo para asegurar el mejor sonido." },
  { id: 4, icon: <ClipboardList />, label: "Variedad de tipo de eventos", info: "Ofrecemos artistas para una amplia gama de eventos y celebraciones." }
];

interface CarouselNavigationProps {
  page: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({ page, onPrevPage, onNextPage }) => (
  <div className="flex gap-2">
    <Button 
      onClick={onPrevPage} 
      disabled={page === 0}
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full"
    >
      <ChevronLeft className="h-6 w-6" />
    </Button>
    <Button 
      onClick={onNextPage} 
      disabled={page === 1}
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full"
    >
      <ChevronRight className="h-6 w-6" />
    </Button>
  </div>
);

const HeroSection: React.FC = () => (
  <section className="dark:bg-vyba-dark-bg py-16 md:py-14">
    <div className="container mx-auto px-6 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-8">
          <div className="mb-12">
            <Button variant="secondary" className="text-center text-vyba-navy text-base px-10">TIPOS DE ARTISTAS</Button>
          </div>
          <h1 className="text-7xl font-bold">Los mejores DJs para tu evento</h1>
          <Button variant="terciary" className="px-10">Empezar a buscar</Button>
        </div>
        <div className="relative grid grid-cols-2 gap-4 h-[700px] overflow-hidden">
          {/* Degradado superior */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10" />
          
          {/* Degradado inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
          
          <div className="space-y-4 -mt-52">
            {/* Primera imagen */}
            <div className="relative rounded-2xl overflow-hidden h-[350px]">
              <img
                src="/images/djcielo1.webp"
                alt="DJ en el cielo 1"
                className="absolute w-full h-full object-cover"
              />
            </div>
            
            {/* Tercera imagen */}
            <div className="relative rounded-2xl overflow-hidden h-[350px]">
              <img
                src="/images/djefectoantiguo.webp"
                alt="DJ en el cielo 2"
                className="absolute w-full h-full object-cover"
              />
            </div>
            
            {/* Quinta imagen */}
            <div className="relative rounded-2xl overflow-hidden h-[350px]">
              <img
                src="/images/djescenario1.webp"
                alt="DJ en el cielo 3"
                className="absolute w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-4 -mt-32">
            {/* Segunda imagen */}
            <div className="relative rounded-2xl overflow-hidden h-[350px]">
              <img
                src="/images/djfotoantigua.webp"
                alt="DJ en el cielo 4"
                className="absolute w-full h-full object-cover"
              />
            </div>
            
            {/* Cuarta imagen */}
            <div className="relative rounded-2xl overflow-hidden h-[350px]">
              <img
                src="/images/djiluminado.webp"
                alt="DJ en el cielo 5"
                className="absolute w-full h-full object-cover"
              />
            </div>
            
            {/* Sexta imagen */}
            <div className="relative rounded-2xl overflow-hidden h-[350px]">
              <img
                src="/images/djpequeño.webp"
                alt="DJ en el cielo 6"
                className="absolute w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DjsSlider: React.FC = () => {
  const [page, setPage] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const selectedArtists = artistsDataFromArtistsPage
    .filter(artist => artist.type === 'DJ')
    .slice(0, 8);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        x: `${page * -100}%`,
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  }, [page]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-semibold">Descubre a los mejores DJs</h2>
        <CarouselNavigation 
          page={page}
          onPrevPage={() => setPage(0)}
          onNextPage={() => setPage(1)}
        />
      </div>

      <div className="relative overflow-hidden">
        <div ref={sliderRef} className="flex">
          {[0, 1].map((pageIndex) => (
            <div key={pageIndex} className="flex-none w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedArtists.slice(pageIndex * 4, (pageIndex + 1) * 4).map((artist, index) => (
                <div 
                  key={artist.id}
                  className="h-full opacity-0 scale-95"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`
                  }}
                >
                  <ArtistProfileCard {...artist} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Button variant="secondary" className="mt-4 px-10">Ver todos los DJs</Button>
    </div>
  );
};

const FeatureCards = () => {
  const isMobile = useIsMobile();

  return (
    <section className="dark:bg-vyba-dark-bg py-16 md:py-14">
      <div className="container mx-auto px-6 md:px-10">
        {isMobile ? (
          <Carousel className="w-full">
            <CarouselContent>
              {badges.map((badge, index) => (
                <CarouselItem key={badge.id}>
                  <div className="bg-vyba-navy/5 dark:bg-vyba-navy/10 backdrop-blur-xl rounded-2xl p-8">
                    <div className="flex flex-col items-start gap-6">
                      <div className="text-vyba-navy dark:text-white">{badge.icon}</div>
                      <div>
                        <h4 className="text-xl font-medium text-vyba-navy dark:text-white mb-2">{badge.label}</h4>
                        <p className="text-sm text-vyba-tertiary dark:text-vyba-tertiary/80">{badge.info}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className="bg-vyba-navy/5 dark:bg-vyba-navy/10 backdrop-blur-xl rounded-2xl p-8 transition-all duration-300 hover:bg-vyba-navy/10 dark:hover:bg-vyba-navy/20"
              >
                <div className="flex flex-col items-start gap-6">
                  <div className="text-vyba-navy dark:text-white">{badge.icon}</div>
                  <div>
                    <h4 className="text-xl font-medium text-vyba-navy dark:text-white mb-2">{badge.label}</h4>
                    <p className="text-sm text-vyba-tertiary dark:text-vyba-tertiary/80">{badge.info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const DjsPage: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const navigate = useNavigate();

  const otherDjs = artistsDataFromArtistsPage
    .filter(artist => artist.type === 'DJ')
    .slice(0, 8);

  return (
    <>
      <nav>
        <div className="fixed top-0 left-0 w-full bg-white/30 dark:bg-black z-50 backdrop-blur-xl px-4">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="p-1">
              <img
                src="/lovable-uploads/logovyba.png"
                alt="Logo Vyba Artists"
                className="h-10 w-auto"
              />
            </button>
            <Button onClick={() => navigate('/auth')}>Iniciar sesión</Button>
          </div>
        </div>
      </nav>
      <div className="pt-24">
        <HeroSection />
        <section className="dark:bg-vyba-dark-bg py-16 md:py-14">
          <div className="container mx-auto px-6 md:px-10">
            <DjsSlider />
          </div>
        </section>
        <FeatureCards />
        <section className="dark:bg-vyba-dark-bg py-16 md:py-14">
          <div className="container mx-auto px-6 md:px-10">
            <div className="sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-vyba-navy rounded-2xl flex flex-col items-center p-12 justify-center gap-12">
                <div className="flex flex-col items-left justify-center gap-4">
                  <h4 className="text-2xl font-medium text-white">Te Protegemos</h4>
                  <p className="text-base text-[#BEBEBE]">Nos aseguramos de que todos los perfiles creados sean seguros mediante autentificación</p>
                </div>
                <div className="flex items-center justify-center">
                  <Diamond className="text-white rounded-full w-44 h-44 p-12 backdrop-blur-lg from-white/10 to-black/10 bg-gradient-to-b" />
                </div>
              </div>
              <div className="bg-vyba-navy rounded-2xl flex flex-col items-center p-12 justify-center gap-12">
                <div className="flex flex-col items-left justify-center gap-4">
                  <h4 className="text-2xl font-medium text-white">Calidad Garantizada</h4>
                  <p className="text-base text-[#BEBEBE]">Todos nuestros artistas pasan por un riguroso proceso de selección para garantizar la mejor calidad</p>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="text-white rounded-full w-44 h-44 p-12 backdrop-blur-lg from-white/10 to-black/10 bg-gradient-to-b" />
                </div>
              </div>
              <div className="bg-vyba-navy rounded-2xl flex flex-col items-center p-12 justify-center gap-12">
                <div className="flex flex-col items-left justify-center gap-4">
                  <h4 className="text-2xl font-medium text-white">Experiencia Única</h4>
                  <p className="text-base text-[#BEBEBE]">Cada evento es único y nos adaptamos a tus necesidades específicas</p>
                </div>
                <div className="flex items-center justify-center">
                  <Camera className="text-white rounded-full w-44 h-44 p-12 backdrop-blur-lg from-white/10 to-black/10 bg-gradient-to-b" />
                </div>
              </div>
              <div className="bg-vyba-navy rounded-2xl flex flex-col items-center p-12 justify-center gap-12">
                <div className="flex flex-col items-left justify-center gap-4">
                  <h4 className="text-2xl font-medium text-white">Variedad de Eventos</h4>
                  <p className="text-base text-[#BEBEBE]">Ofrecemos artistas para una amplia gama de eventos y celebraciones</p>
                </div>
                <div className="flex items-center justify-center">
                  <ClipboardList className="text-white rounded-full w-44 h-44 p-12 backdrop-blur-lg from-white/10 to-black/10 bg-gradient-to-b" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dark:bg-vyba-dark-bg py-16 md:py-14">
          <div className="container mx-auto px-6 md:px-10">
            <h2 className="text-4xl font-semibold mb-12">Otros DJs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherDjs.map((dj) => (
                <div 
                  key={dj.id}
                  className="opacity-0 scale-95"
                  style={{
                    animation: `fadeIn 0.5s ease-out forwards`
                  }}
                >
                  <ArtistProfileCard {...dj} />
                </div>
              ))}
            </div>
            <div className="flex justify-left mt-6">
              <Button variant="secondary" className="px-10">
                Mostrar más
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DjsPage;

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);
