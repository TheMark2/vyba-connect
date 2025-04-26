import React, { useState, useRef, useEffect } from "react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { Button } from "@/components/ui/button";
import { artistsData as artistsDataFromArtistsPage } from "../ArtistsPage";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Diamond, Camera, ClipboardList } from "lucide-react";
import Navbar from "@/components/Navbar";
import gsap from "gsap";

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

const DjsPage: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-xl">
        <Navbar />
      </div>
      <div className="pt-24">
        <HeroSection />
        <section className="dark:bg-vyba-dark-bg py-16 md:py-14">
          <div className="container mx-auto px-6 md:px-10">
            <DjsSlider />
          </div>
        </section>
        <section className="dark:bg-vyba-dark-bg py-16 md:py-14">
          <div className="max-w-[1600px] mx-auto px-6 md:px-10">
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
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

            {/* Mobile Carousel */}
            <div className="sm:hidden relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentCard * 100}%)` }}
                >
                  <div className="w-full flex-shrink-0">
                    <div className="bg-vyba-navy rounded-2xl flex flex-col items-center p-12 justify-center gap-12">
                      <div className="flex flex-col items-left justify-center gap-4">
                        <h4 className="text-2xl font-medium text-white">Te Protegemos</h4>
                        <p className="text-base text-[#BEBEBE]">Nos aseguramos de que todos los perfiles creados sean seguros mediante autentificación</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <Diamond className="text-white rounded-full w-44 h-44 p-12 backdrop-blur-lg from-white/10 to-black/10 bg-gradient-to-b" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex-shrink-0">
                    <div className="bg-vyba-navy rounded-2xl flex flex-col items-center p-12 justify-center gap-12">
                      <div className="flex flex-col items-left justify-center gap-4">
                        <h4 className="text-2xl font-medium text-white">Calidad Garantizada</h4>
                        <p className="text-base text-[#BEBEBE]">Todos nuestros artistas pasan por un riguroso proceso de selección para garantizar la mejor calidad</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="text-white rounded-full w-44 h-44 p-12 backdrop-blur-lg from-white/10 to-black/10 bg-gradient-to-b" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex-shrink-0">
                    <div className="bg-vyba-navy rounded-2xl flex flex-col items-center p-12 justify-center gap-12">
                      <div className="flex flex-col items-left justify-center gap-4">
                        <h4 className="text-2xl font-medium text-white">Experiencia Única</h4>
                        <p className="text-base text-[#BEBEBE]">Cada evento es único y nos adaptamos a tus necesidades específicas</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <Camera className="text-white rounded-full w-44 h-44 p-12 backdrop-blur-lg from-white/10 to-black/10 bg-gradient-to-b" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex-shrink-0">
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
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentCard === index ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentCard(index)}
                  />
                ))}
              </div>
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
