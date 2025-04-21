
import React, { useState } from "react";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { Button } from "@/components/ui/button";
import { artistsData as artistsDataFromArtistsPage } from "../ArtistsPage";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DjsSlider = () => {
  const selectedArtists = artistsDataFromArtistsPage
    .filter(artist => artist.type === 'DJ')
    .slice(0, 8);

  const [page, setPage] = useState(0);
  const cardsPerPage = 4;
  const totalPages = Math.ceil(selectedArtists.length / cardsPerPage);

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const currentCards = selectedArtists.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage
  );

  return (
    <div className="w-full">
      <h1 className="text-5xl font-semibold mb-14">Descubre a los mejores DJs</h1>
      
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <Button 
            onClick={handlePrev} 
            disabled={page === 0}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="text-lg font-medium">
            Página {page + 1} de {totalPages}
          </span>
          <Button 
            onClick={handleNext} 
            disabled={page === totalPages - 1}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={page}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, x: page > 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: page > 0 ? 100 : -100 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              {currentCards.map((artist) => (
                <div key={artist.id} className="h-full">
                  <ArtistProfileCard
                    name={artist.name}
                    type={artist.type}
                    description={artist.description}
                    images={artist.images}
                    rating={artist.rating}
                    priceRange={artist.priceRange}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Djs = () => {
  return (
    <>
      <section className="dark:bg-vyba-dark-bg py-16 md:py-32">
        <div className="container mx-auto px-6 md:px-10">
          <h2 className="text-center text-vyba-navy text-xl max-w-5xl mx-auto">TIPOS DE ARTISTAS</h2>
          <h1 className="text-7xl font-bold text-center">Descubre los mejores DJs para tu evento</h1>
          <p className="text-center text-vyba-navy text-xl max-w-5xl mx-auto">DJs para todo tipo de celebraciones, desde bodas y fiestas privadas hasta eventos corporativos y festivales. Explora perfiles verificados con vídeos, estilos musicales variados, opiniones reales y precios transparentes.</p>
        </div>
        <div className="relative flex items-center justify-center h-[450px] md:h-[550px] lg:h-[750px] mt-16 md:mt-32 w-full overflow-x-hidden">
          <div className="h-[90%] w-[20%] md:w-[30%] rounded-l-none overflow-hidden rounded-3xl relative z-10 translate-x-[-10%] md:translate-x-[-5%]">
            <img
              src="/lovable-uploads/image.png"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="h-[100%] w-[60%] md:w-[40%] overflow-hidden rounded-3xl z-20">
            <img
              src="/lovable-uploads/djcontroler.webp"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="h-[90%] w-[20%] md:w-[30%] rounded-r-none overflow-hidden rounded-3xl relative z-10 translate-x-[10%] md:translate-x-[5%]">
            <img
              src="/lovable-uploads/image2.png"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="dark:bg-vyba-dark-bg py-16 md:py-32">
        <div className="container mx-auto px-6 md:px-10">
          <DjsSlider />
        </div>
      </section>
    </>
  );
};

export default Djs;
