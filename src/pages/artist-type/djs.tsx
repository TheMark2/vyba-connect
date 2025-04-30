import React, { useState, useEffect } from "react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { Button } from "@/components/ui/button";
import { artistsData as artistsDataFromArtistsPage } from "../ArtistsPage";
import { ChevronLeft, ChevronRight, LandPlot, ScanFace, SquareMousePointer, KeyboardMusic, Guitar, Piano, MicVocal, AudioWaveform, Drum, CassetteTape, Disc3 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Navbar1 from "@/components/navbar/navbar1";

const AutoPlayCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/images/dj1.webp",
    "/images/dj2.webp",
    "/images/dj3.webp",
    "/images/dj4.webp",
    "/images/dj5.webp",
    "/images/dj6.webp"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000",
            currentIndex === index ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={image}
            alt={`DJ image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index ? "bg-white scale-125" : "bg-white/50"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="dark:bg-vyba-dark-bg">
      <div className="container mx-auto px-6 md:px-10 h-[100svh] flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="space-y-8">
            <div className="flex items-center gap-1 text-base">
              <Button 
                variant="secondary" 
                className="text-vyba-tertiary bg-vyba-gray hover:text-vyba-navy py-2 px-4"
                onClick={() => navigate('/')}
              >
                Inicio
              </Button>
              <ChevronRight className="w-4 h-4 text-vyba-tertiary" />
              <Button 
                variant="secondary" 
                className="text-vyba-tertiary bg-vyba-gray hover:text-vyba-navy py-2 px-4"
                onClick={() => navigate('/artist-type')}
              >
                Tipos de artistas
              </Button>
              <ChevronRight className="w-4 h-4 text-vyba-tertiary" />
              <span className="text-vyba-navy font-medium bg-vyba-gray py-2 px-4 rounded-full">DJs</span>
            </div>
            <h1 className="text-7xl font-semibold">Los mejores DJs para tu evento</h1>
            <Button variant="terciary" className="px-10">Empezar a buscar</Button>
          </div>
          <div className="relative grid grid-cols-2 gap-4 h-[700px] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
            <div className="space-y-4 -mt-52">
              {[1, 2, 4].map((num) => (
                <div key={num} className="relative rounded-2xl overflow-hidden h-[350px]">
                  <img
                    src={`/images/dj${num}.webp`}
                    alt={`DJ ${num}`}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4 -mt-32">
              {[3, 5, 6].map((num) => (
                <div key={num} className="relative rounded-2xl overflow-hidden h-[350px]">
                  <img
                    src={`/images/dj${num}.webp`}
                    alt={`DJ ${num}`}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DjsSlider = () => {
  const selectedArtists = artistsDataFromArtistsPage
    .filter(artist => artist.type === 'DJ')
    .slice(0, 8);

  const [page, setPage] = useState(0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-semibold">Descubre a los mejores DJs</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setPage(0)} 
            disabled={page === 0}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            onClick={() => setPage(1)} 
            disabled={page === 1}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {[0, 1].map((pageIndex) => (
            <div key={pageIndex} className="flex-none w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {selectedArtists.slice(pageIndex * 4, (pageIndex + 1) * 4).map((artist) => (
                <div 
                  key={artist.id}
                  className="opacity-0 scale-95 animate-[fadeIn_0.5s_ease-out_forwards]"
                  style={{
                    animationDelay: `${artist.id * 0.1}s`
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
  return (
    <section className="bg-white dark:bg-vyba-dark-bg py-16 md:py-14">
      <div className="max-w-[1700px] mx-auto px-6 md:px-10">
        <h2 className="text-4xl font-semibold mb-12">¿Por qué nosotros?</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 grid-rows-3 md:grid-rows-2 gap-2 md:gap-4">
          <div className="hidden md:block md:col-start-1 md:row-start-1 md:col-span-4 md:row-span-1 bg-vyba-gray rounded-3xl p-10">
            <div className="flex flex-col items-left justify-center space-y-2">
              <h3 className="text-2xl font-semibold">Dj con experiencia real en eventos</h3>
              <p className="text-base text-vyba-tertiary">Mezclas en vivo adaptadas al público, gestión del ritmo, transiciones perfectas y repertorio a medida.</p>
            </div>
            <div className="flex -space-x-8 mt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <img 
                  key={i}
                  className="w-20 h-20 rounded-full border-4 border-vyba-gray" 
                  src={`/images/user-image/avatar${i + 1}.webp`}
                  alt={`Avatar ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="hidden md:block md:col-start-5 md:row-start-1 md:col-span-2 md:row-span-2 bg-vyba-gray rounded-3xl overflow-hidden">
            <AutoPlayCarousel />
          </div>
          <div className="hidden md:block md:col-start-1 md:row-start-2 md:col-span-1 md:row-span-1 bg-vyba-gray rounded-3xl p-10 h-full">
            <div className="flex flex-col items-start justify-between h-full">
              <LandPlot className="w-9 h-9" />
              <h3 className="text-2xl font-semibold mb-0">Equipo profesional</h3>
            </div>
          </div>
          <div className="hidden md:block md:col-start-2 md:row-start-2 md:col-span-1 md:row-span-1 bg-vyba-gray rounded-3xl p-10">
            <div className="flex flex-col items-start justify-between h-full">
              <ScanFace className="w-9 h-9" />
              <h3 className="text-2xl font-semibold mb-0">Artistas verificados</h3>
            </div>
          </div>
          <div className="hidden md:block md:col-start-3 md:row-start-2 md:col-span-1 md:row-span-1 bg-vyba-gray rounded-3xl p-10">
            <div className="flex flex-col items-start justify-between h-full">
              <SquareMousePointer className="w-9 h-9" />
              <h3 className="text-2xl font-semibold mb-0">Sets para todo tipo de fiestas</h3>
            </div>
          </div>
          <div className="hidden md:block md:col-start-4 md:row-start-2 md:col-span-1 md:row-span-1 bg-vyba-navy rounded-3xl px-6 py-6">
            <div className="flex flex-col items-start justify-between h-full">
              <p className="text-base font-light text-white mb-0">Ver todas las ventajas de vyba</p>
              <Button variant="secondary" className="bg-white text-vyba-navy w-full">Ver todas</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DjsPage = () => {
  const navigate = useNavigate();
  const otherDjs = artistsDataFromArtistsPage
    .filter(artist => artist.type === 'DJ')
    .slice(0, 8);

  const otherCategories = [
    { id: 1, icon: <KeyboardMusic className="w-6 h-6" />, label: "Saxofonistas", href: "/artist-type/saxofonistas" },
    { id: 2, icon: <MicVocal className="w-6 h-6" />, label: "Cantantes", href: "/artist-type/cantantes" },
    { id: 3, icon: <Guitar className="w-6 h-6" />, label: "Guitarristas", href: "/artist-type/guitarristas" },
    { id: 4, icon: <Piano className="w-6 h-6" />, label: "Pianistas", href: "/artist-type/pianistas" },
    { id: 5, icon: <AudioWaveform className="w-6 h-6" />, label: "Violinistas", href: "/artist-type/violinistas" },
    { id: 6, icon: <Drum className="w-6 h-6" />, label: "Trompetistas", href: "/artist-type/trompetistas" },
    { id: 7, icon: <CassetteTape className="w-6 h-6" />, label: "Bateristas", href: "/artist-type/bateristas" },
    { id: 8, icon: <Disc3 className="w-6 h-6" />, label: "Bajistas", href: "/artist-type/bajistas" }
  ];

  return (
    <>
      <Navbar1 />
      <div>
        <HeroSection />
        <section className="dark:bg-vyba-dark-bg py-16 md:py-14">
          <div className="container mx-auto px-6 md:px-10">
            <DjsSlider />
          </div>
        </section>
        <FeatureCards />
        <section className="py-16 md:py-14">
          <div className="container mx-auto px-6 md:px-10">
            <h2 className="text-4xl font-semibold mb-12">Otros DJs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {otherDjs.map((dj) => (
                <div 
                  key={dj.id}
                  className="opacity-0 scale-95 animate-[fadeIn_0.5s_ease-out_forwards]"
                  style={{
                    animationDelay: `${dj.id * 0.1}s`
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

        <section className="bg-vyba-gray dark:bg-vyba-dark-bg py-16 md:py-14">
          <div className="container mx-auto px-6 md:px-10">
            <h2 className="text-4xl font-semibold mb-12">Otras categorías que te pueden interesar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherCategories.map((category) => (
                <div
                  key={category.id}
                  className="h-20 flex items-center justify-start px-8 text-base font-medium bg-white hover:bg-white/80 rounded-md cursor-pointer transition-all duration-300 gap-4"
                  onClick={() => navigate(category.href)}
                >
                  {category.icon}
                  {category.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DjsPage;
