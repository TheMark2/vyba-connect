
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { artistsData as artistsDataFromArtistsPage } from "../ArtistsPage";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DjsSlider = () => {
  const selectedArtists = artistsDataFromArtistsPage
    .filter(artist => artist.type === 'DJ')
    .slice(0, 6);

  return (
    <div className="relative w-full">
      <h1 className="text-5xl font-semibold mb-14">Descubre a los mejores DJs</h1>
      
      <Carousel 
        opts={{
          align: "start",
          slidesToScroll: "page", // Hace que el scroll sea por páginas completas
          skipSnaps: false, // Impide que el scroll pueda quedar entre dos snaps
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-6">
          {selectedArtists.map((artist) => (
            <CarouselItem 
              key={artist.id} 
              className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3"
            >
              <div className="h-full">
                <ArtistProfileCard
                  name={artist.name}
                  type={artist.type}
                  description={artist.description}
                  images={artist.images}
                  rating={artist.rating}
                  priceRange={artist.priceRange}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-4 mt-8">
          <CarouselPrevious 
            className="position-static translate-y-0 h-10 w-10 rounded-full border-none bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
          />
          <CarouselNext 
            className="position-static translate-y-0 h-10 w-10 rounded-full border-none bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
          />
        </div>
      </Carousel>
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
