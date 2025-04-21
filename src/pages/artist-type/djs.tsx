import React, { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ArtistProfileCard from "@/components/ArtistProfileCard";
import { artistsData as artistsDataFromArtistsPage } from "../ArtistsPage";

const Djs = () => {
    // Filtra solo los artistas de tipo 'DJ' y selecciona hasta 6  
    const selectedArtists = artistsDataFromArtistsPage
      .filter(artist => artist.type === 'DJ')
      .slice(0, 6);
      
    return (
        <>
            <section className="dark:bg-vyba-dark-bg py-16 md:py-32">
                <div className="container mx-auto px-6 md:px-10">
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
                        src="/lovable-uploads/image1.png"
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
                    <h1 className="text-5xl font-semibold text-left mb-14">Descubre a los mejores Djs</h1>
                </div>
            </section>
            <section className="dark:bg-vyba-dark-bg py-16 md:py-32">
                <div className="container mx-auto px-6 md:px-10">
                    <Carousel opts={{ loop: false, align: "start", containScroll: "trimSnaps", dragFree: false, skipSnaps: false, slidesToScroll: 4 }}>
                        <CarouselContent className="flex gap-4">
                            {selectedArtists.map((artist, index) => (
                                <CarouselItem key={artist.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                    <ArtistProfileCard
                                        name={artist.name}
                                        type={artist.type}
                                        description={artist.description}
                                        images={artist.images}
                                        rating={artist.rating}
                                        priceRange={artist.priceRange}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </section>
        </>
    );
};

export default Djs;