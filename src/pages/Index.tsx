import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import ArtistCard, { CardType } from "@/components/ArtistCard";
import { toast } from "sonner";
import TimelineStep from "@/components/TimelineStep";
import ArtistsList from "@/components/ArtistsList";
import StatsSummary from "@/components/StatsSummary";
import HelpSection from "@/components/HelpSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchAlt01 } from "@hugeicons/react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const combinedRef = React.useCallback((element: HTMLInputElement | null) => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
      }
    }
    inputRef.current = element;
  }, [ref]);
  React.useEffect(() => {
    if (inputRef.current && inputRef.current.value) {
      setHasValue(true);
    } else {
      setHasValue(false);
    }
  }, [props.value]);
  const shouldFloatLabel = isFocused || hasValue;
  return <div className="relative w-full">
        {props.placeholder && <span className={cn("absolute pointer-events-none transition-all duration-300 text-black font-bold dark:text-white", shouldFloatLabel ? "transform -translate-y-1 text-xs left-6 top-3" : "transform translate-y-0 text-base left-6 top-1/2 -mt-3")}>
            {props.placeholder}
          </span>}
        <input {...props} placeholder="" className={cn("flex h-14 w-full rounded-md border border-input bg-background px-6 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-vyba-dark-secondary", hasValue || isFocused ? "pt-5 pb-1" : "py-3", className)} ref={combinedRef} onFocus={e => {
      setIsFocused(true);
      props.onFocus && props.onFocus(e);
    }} onBlur={e => {
      setIsFocused(false);
      props.onBlur && props.onBlur(e);
    }} onChange={e => {
      setHasValue(e.target.value.length > 0);
      props.onChange && props.onChange(e);
    }} />
      </div>;
});
Input.displayName = "Input";

const BoldSearch = () => <SearchAlt01 className="h-5 w-5 stroke-[2.5px]" />;

const Index = () => {
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFixedSearch, setShowFixedSearch] = useState(false);
  const [fixedSearchQuery, setFixedSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [activeArtistIndex, setActiveArtistIndex] = useState(1);
  const artists = [{
    type: "DJ",
    image: "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png",
    description: "El portal perfecto para encontrar tu DJ"
  }, {
    type: "Saxofonista",
    image: "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png",
    description: "Encuentra al saxofonista ideal para tu evento"
  }, {
    type: "Guitarrista",
    image: "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png",
    description: "Conecta con talentosos guitarristas"
  }];
  const {
    scrollYProgress
  } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const footerElement = document.querySelector('footer');
      const footerPosition = footerElement ? footerElement.getBoundingClientRect().top + window.scrollY - window.innerHeight : 0;
      const shouldShowSearchThreshold = isMobile ? window.innerHeight * 1.5 : window.innerHeight * 3;
      const shouldHideBeforeFooter = scrollPosition > footerPosition - 100;
      const shouldShowSearch = scrollPosition > shouldShowSearchThreshold && !shouldHideBeforeFooter;
      if (shouldShowSearch !== showFixedSearch) {
        setShowFixedSearch(shouldShowSearch);
      }
      if (isMobile) {
        const carouselSection = document.querySelector('.carousel-section');
        if (carouselSection) {
          const rect = carouselSection.getBoundingClientRect();
          const viewHeight = window.innerHeight;
          const percentVisible = Math.max(0, Math.min(1, (viewHeight - rect.top) / (viewHeight + rect.height)));
          if (percentVisible > 0 && percentVisible < 1) {
            const carouselApi = (window as any).carouselApi;
            if (carouselApi) {
              const slideCount = artists.length;
              const targetIndex = Math.min(slideCount - 1, Math.floor(percentVisible * slideCount * 1.5));
              carouselApi.scrollTo(targetIndex);
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFixedSearch, isMobile, artists.length]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.19, 0.25, 0.3], [1, 0.9, 0.3, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.19, 0.25, 0.3, 0.43, 0.5, 0.55], [0, 0.3, 0.9, 1, 0.3, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.43, 0.5, 0.55, 1], [0, 0.3, 1, 1]);
  const scale1 = useTransform(scrollYProgress, [0, 0.19, 0.25], [1, 1.05, 1.1]);
  const scale2 = useTransform(scrollYProgress, [0.19, 0.25, 0.45, 0.5], [0.95, 1, 1.05, 1.1]);
  const scale3 = useTransform(scrollYProgress, [0.45, 0.5, 0.7], [0.95, 1, 1.05]);
  const moveY1 = useTransform(scrollYProgress, [0, 0.25], ["0%", "-3%"]);
  const moveY2 = useTransform(scrollYProgress, [0.25, 0.5], ["0%", "-3%"]);
  const moveY3 = useTransform(scrollYProgress, [0.5, 0.75], ["0%", "-3%"]);
  const moveX1 = useTransform(scrollYProgress, [0, 0.25], ["0%", "1%"]);
  const moveX2 = useTransform(scrollYProgress, [0.25, 0.5], ["0%", "-1%"]);
  const moveX3 = useTransform(scrollYProgress, [0.5, 0.75], ["0%", "1%"]);
  const textOpacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 0.3, 0]);
  const textOpacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [0, 1, 0]);
  const textOpacity3 = useTransform(scrollYProgress, [0.45, 0.55, 1], [0, 1, 1]);
  const topArtists = [{
    name: "Antonia Pedragosa",
    role: "DJ",
    rating: 4.9
  }, {
    name: "Marco Valiente",
    role: "Saxofonista",
    rating: 4.8
  }, {
    name: "Sofía Montero",
    role: "DJ",
    rating: 4.9
  }, {
    name: "Lucas Mendoza",
    role: "Guitarrista",
    rating: 4.7
  }, {
    name: "Daniela Jiménez",
    role: "DJ",
    rating: 4.9
  }, {
    name: "Rafael Torres",
    role: "DJ",
    rating: 4.8
  }];
  const genreCards = [{
    type: "género" as CardType,
    name: "Pop",
    artistCount: 15,
    rating: 4.7,
    artistAvatars: Array(7).fill("/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png")
  }, {
    type: "género" as CardType,
    name: "Rock",
    artistCount: 12,
    rating: 4.8,
    artistAvatars: Array(5).fill("/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png")
  }, {
    type: "género" as CardType,
    name: "Jazz",
    artistCount: 8,
    rating: 4.9,
    artistAvatars: Array(4).fill("/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png")
  }, {
    type: "género" as CardType,
    name: "Electrónica",
    artistCount: 20,
    rating: 4.6,
    artistAvatars: Array(7).fill("/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png")
  }];
  const typeCards = [{
    type: "tipo" as CardType,
    name: "DJ",
    artistCount: 18,
    rating: 4.9,
    artistAvatars: Array(7).fill("/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png")
  }, {
    type: "tipo" as CardType,
    name: "Saxofonista",
    artistCount: 6,
    rating: 4.8,
    artistAvatars: Array(3).fill("/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png")
  }, {
    type: "tipo" as CardType,
    name: "Bandas",
    artistCount: 10,
    rating: 4.7,
    artistAvatars: Array(6).fill("/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png")
  }, {
    type: "tipo" as CardType,
    name: "Guitarrista",
    artistCount: 14,
    rating: 4.8,
    artistAvatars: Array(7).fill("/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png")
  }];
  const handleCardClick = (name: string, type: CardType) => {
    toast.success(`Has seleccionado ${type === "género" ? "el género" : "el tipo"} ${name}`);
  };
  const recommendedArtists = [{
    id: "1",
    name: "Antonia Pedragosa",
    type: "DJ",
    description: "DJ para todo tipo de eventos",
    images: ["/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }, {
    id: "2",
    name: "Marco Valiente",
    type: "Saxofonista",
    description: "Saxofonista para eventos exclusivos",
    images: ["/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"],
    rating: 4.8,
    priceRange: "450-550€",
    isFavorite: false
  }, {
    id: "3",
    name: "Sofía Montero",
    type: "DJ",
    description: "DJ especializada en bodas y eventos",
    images: ["/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    rating: 4.9,
    priceRange: "400-500€",
    isFavorite: false
  }, {
    id: "4",
    name: "Lucas Mendoza",
    type: "Guitarrista",
    description: "Guitarrista versátil para cualquier evento",
    images: ["/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png"],
    rating: 4.7,
    priceRange: "350-450€",
    isFavorite: false
  }, {
    id: "5",
    name: "Daniela Jiménez",
    type: "DJ",
    description: "DJ con años de experiencia en festivales",
    images: ["/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png"],
    rating: 4.9,
    priceRange: "500-600€",
    isFavorite: false
  }, {
    id: "6",
    name: "Rafael Torres",
    type: "DJ",
    description: "DJ especializado en música electrónica",
    images: ["/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png"],
    rating: 4.8,
    priceRange: "450-550€",
    isFavorite: false
  }];
  const musicCategories = ["Reggaeton", "Pop", "House", "House", "Techno", "Jazz", "Rock"];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const handleArtistClick = (artist: any) => {
    toast.success(`Has seleccionado a ${artist.name}`);
  };
  const handleFavoriteToggle = (artist: any) => {
    toast(`${artist.isFavorite ? "Eliminado de" : "Añadido a"} favoritos: ${artist.name}`);
  };
  const filteredArtists = activeCategory ? recommendedArtists.filter(artist => artist.type.toLowerCase().includes(activeCategory.toLowerCase()) || artist.description.toLowerCase().includes(activeCategory.toLowerCase())) : recommendedArtists;
  const renderMobileHero = () => <div className="min-h-screen flex flex-col bg-vyba-cream dark:bg-vyba-dark-bg">
      <div className="px-6 pt-20 pb-10">
        <h1 className="text-5xl font-black leading-tight">
          El portal perfecto para encontrar tu dj
        </h1>
        
        <div className="mt-10 relative">
          <div className="flex items-center bg-[#F5F1EB] dark:bg-vyba-dark-secondary rounded-full">
            <input type="text" placeholder="Buscar artistas" className="pl-6 pr-12 py-4 w-full bg-transparent text-black dark:text-white rounded-full focus:outline-none" />
            <Button type="submit" size="icon" className="absolute right-1 rounded-full h-11 w-11 flex items-center justify-center">
              <BoldSearch />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="relative w-full mt-4 carousel-section">
        <Carousel opts={{
        align: "center",
        loop: true,
        dragFree: true,
        containScroll: false
      }} className="w-full" onMouseDown={e => e.stopPropagation()} setApi={api => {
        (window as any).carouselApi = api;
      }}>
          <CarouselContent className="-ml-3">
            {artists.map((artist, index) => <CarouselItem key={index} className="basis-[70%] md:basis-1/2 lg:basis-1/3 pl-3">
                <div className="h-[370px] relative rounded-[30px] overflow-hidden">
                  <img src={artist.image} alt={artist.type} className="absolute inset-0 w-full h-full object-cover" loading="eager" onError={e => {
                console.error(`Error loading image: ${artist.image}`);
                e.currentTarget.src = '/placeholder.svg';
              }} />
                </div>
              </CarouselItem>)}
          </CarouselContent>
        </Carousel>
      </div>
    </div>;
  const renderDesktopHero = () => <div ref={scrollRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative w-full h-screen overflow-hidden">
          <motion.div className="absolute inset-0 px-6 md:px-10 lg:px-14 xl:px-16 pt-8 pb-32">
            <motion.div className="relative w-full h-full rounded-[2vw] overflow-hidden">
              <motion.div className="absolute inset-0 origin-center" style={{
              opacity: opacity1,
              scale: scale1,
              y: moveY1,
              x: moveX1
            }}>
                <img src={artists[0].image} alt="DJ performing" className="w-full h-full brightness-75 blur-[2px] object-cover" />
              </motion.div>
              
              <motion.div className="absolute inset-0 origin-center" style={{
              opacity: opacity2,
              scale: scale2,
              y: moveY2,
              x: moveX2
            }}>
                <img src={artists[1].image} alt="Saxofonista performing" className="w-full h-full brightness-75 blur-[2px] object-cover" />
              </motion.div>
              
              <motion.div className="absolute inset-0 origin-center" style={{
              opacity: opacity3,
              scale: scale3,
              y: moveY3,
              x: moveX3
            }}>
                <img src={artists[2].image} alt="Guitarrista performing" className="w-full h-full brightness-75 blur-[2px] object-cover rounded-[2vw]" />
              </motion.div>

              <div className="absolute inset-0 bg-black opacity-50"></div>
              
              <motion.div className="absolute inset-0 flex flex-col justify-center text-white px-6 md:px-12 lg:px-16">
                <div className="max-w-2xl mx-0 space-y-14">
                  <div className="relative h-36">
                    <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-0 left-0 w-full" style={{
                    opacity: textOpacity1
                  }}>
                      Contacta con los mejores artistas
                    </motion.h1>
                    
                    <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-16 left-0 w-full" style={{
                    opacity: textOpacity2
                  }}>
                      De una forma fácil
                    </motion.h1>
                    
                    <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-16 left-0 w-full" style={{
                    opacity: textOpacity3
                  }}>
                      Usa Vyba
                    </motion.h1>
                  </div>
                  
                  <motion.div className="flex w-full relative">
                    <div className="relative w-full flex items-center">
                      <Input type="text" placeholder="Buscar artistas" className="pr-14 bg-[#F5F1EB] dark:bg-vyba-dark-secondary text-black dark:text-white h-14 rounded-full border-0" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                      <Button type="submit" size="icon" className="absolute right-2 rounded-full h-11 w-11 flex items-center justify-center">
                        <BoldSearch />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>;
  return <div className="min-h-screen flex flex-col p-0 m-0">
      <div className="w-full">
        <Navbar className="mx-auto" />
      </div>

      {showFixedSearch && <motion.div initial={{
      opacity: 0,
      y: 50
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 50
    }} transition={{
      duration: 0.3,
      ease: "easeOut"
    }} className="fixed bottom-6 left-0 right-0 z-50 px-6 md:px-10 flex justify-center">
        <div className="bg-white dark:bg-[#575654] py-3 px-4 rounded-full inline-flex gap-3 shadow-sm">
          <Button onClick={() => toast.success("Búsqueda iniciada")} className="rounded-full text-black dark:text-white bg-[#F5F1EB] dark:bg-vyba-dark-secondary hover:bg-[#EAE6E0] dark:hover:bg-opacity-80 shadow-none" variant="secondary">
            Empezar a buscar
          </Button>
          <Button onClick={() => toast.success("Búsqueda con IA iniciada")} className="rounded-full shadow-none" variant="default">
            Buscar con IA
          </Button>
        </div>
      </motion.div>}

      <main className="flex-1">
        {isMobile ? renderMobileHero() : renderDesktopHero()}

        <section className="bg-vyba-cream dark:bg-vyba-dark-bg">
          <div className="w-full overflow-hidden mt-3 md:mt-2 lg:mt-0">
            <Marquee pauseOnHover className="mb-4">
              {genreCards.map((card, index) => <ArtistCard key={index} type={card.type} name={card.name} artistCount={card.artistCount} rating={card.rating} artistAvatars={card.artistAvatars} onClick={() => handleCardClick(card.name, card.type)} />)}
            </Marquee>
            
            <Marquee reverse pauseOnHover className="">
              {typeCards.map((card, index) => <ArtistCard key={index + genreCards.length} type={card.type} name={card.name} artistCount={card.artistCount} rating={card.rating} artistAvatars={card.artistAvatars} onClick={() => handleCardClick(card.name, card.type)} />)}
            </Marquee>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-secondary/10 dark:bg-vyba-dark-bg">
          <div className="container mx-auto px-6 md:px-10">
            <h2 className="text-5xl md:text-5xl lg:text-7xl font-black text-center mb-20 md:mb-32">
              Contratar a un artista nunca había sido tan fácil
            </h2>

            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-12">
                <div className="order-1 md:order-1">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">Explora y elige el artista perfecto para tu evento.</h2>
                  <p className="text-gray-900 dark:text-gray-200 font-medium mb-6">
                    Descubre el talento que mejor se adapta a tu evento. Filtra por género, estilo o popularidad y encuentra al artista perfecto en segundos.
                  </p>
                  <Button variant="secondary" className="mt-2">Empieza a buscar ahora</Button>
                </div>
                <div className="order-2 md:order-2">
                  <img src="/lovable-uploads/pexels-rovenimages-com-344613-949592.jpg" alt="Búsqueda de artistas" className="w-full max-h-[450px]  object-cover aspect-[4/3] rounded-[40px] md:rounded-[40px] lg:rounded-[50px]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-12">
                <div className="order-2 md:order-1">
                  <img src="/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png" alt="Contacto con artistas" className="w-full max-h-[450px]  object-cover aspect-[4/3] rounded-[40px] md:rounded-[40px] lg:rounded-[50px]" />
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">Contacta con el artista de una forma fácil y rápida.</h2>
                  <p className="text-gray-900 dark:text-gray-200 font-medium mb-6">
                    Contacta de una forma fácil y rápida, un proceso seguro mediante a nuestro sistema de mensajes.
                  </p>
                  <Button variant="secondary" className="mt-2">Empieza a buscar ahora</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-12">
                <div className="order-1 md:order-1">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">Confirma la reserva y disfruta de un show inolvidable.</h2>
                  <p className="text-gray-900 dark:text-gray-200 font-medium mb-6">
                    Comparte tu experiencia con la comunidad y ayuda a otros a encontrar al artista perfecto para sus eventos.
                  </p>
                  <Button variant="secondary" className="mt-2">Empieza a buscar ahora</Button>
                </div>
                <div className="order-2 md:order-2">
                  <img src="/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png" alt="Escribir reseñas" className="w-full max-h-[450px] object-cover aspect-[4/3] rounded-[40px] md:rounded-[40px] lg:rounded-[50px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4 md:py-8 bg-vyba-cream dark:bg-vyba-dark-bg">
          <div className="container mx-auto px-6 md:px-10">
            <h2 className="text-5xl md:text-5xl lg:text-7xl font-black text-center mb-12 md:mb-20">
              Los que te recomendamos
            </h2>

            <div className="flex flex-wrap gap-3 mb-10 justify-center">
              {musicCategories.map((category, index) => <button key={index} className={cn("px-5 py-3 rounded-full text-sm font-medium transition-colors", activeCategory === category ? "bg-black text-white" : "bg-[#F5F1EB] dark:bg-vyba-dark-secondary hover:bg-[#EAE6E0] dark:hover:bg-opacity-80")} onClick={() => setActiveCategory(activeCategory === category ? null : category)}>
                {category}
              </button>)}
            </div>
          </div>
        </section>
        
        <section className="pb-20 bg-vyba-cream dark:bg-vyba-dark-bg">
          <ArtistsList artists={filteredArtists} onArtistClick={handleArtistClick} onFavoriteToggle={handleFavoriteToggle} />
        </section>
        
        <StatsSummary className="px-6 md:px-8 lg:px-8 mb-16" />
        <HelpSection className="px-6 md:px-8 lg:px-8 mb-16" />
      </main>

      <Footer />
    </div>;
};
export default Index;
