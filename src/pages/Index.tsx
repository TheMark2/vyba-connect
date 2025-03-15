import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import ArtistCard, { CardType } from "@/components/ArtistCard";
import { toast } from "sonner";
import { MUSIC_GENRES, MUSICIAN_TYPES } from "@/constants/music";
import TimelineStep from "@/components/TimelineStep";

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
        {props.placeholder && <span className={cn("absolute pointer-events-none transition-all duration-300 text-black font-bold", shouldFloatLabel ? "transform -translate-y-1 text-xs left-6 top-3" : "transform translate-y-0 text-base left-6 top-1/2 -mt-3")}>
            {props.placeholder}
          </span>}
        <input {...props} placeholder="" className={cn("flex h-14 w-full rounded-md border border-input bg-background px-6 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", hasValue || isFocused ? "pt-5 pb-1" : "py-3", className)} ref={combinedRef} onFocus={e => {
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

const BoldSearch = () => <Search className="h-5 w-5 stroke-[2.5px]" />;

const Index = () => {
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    scrollYProgress
  } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
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

  return <div className="min-h-screen flex flex-col p-0 m-0">
      <div className="w-full">
        <Navbar className="mx-auto" />
      </div>

      <main className="flex-1">
        <div ref={scrollRef} className="h-[300vh] relative">
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
                      <div className="relative h-28">
                        <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-0 left-0 w-full" style={{
                        opacity: textOpacity1
                      }}>
                          Contacta con los mejores artistas
                        </motion.h1>
                        
                        <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-0 left-0 w-full" style={{
                        opacity: textOpacity2
                      }}>
                          De una forma fácil
                        </motion.h1>
                        
                        <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight absolute top-0 left-0 w-full" style={{
                        opacity: textOpacity3
                      }}>
                          Usa Vyba
                        </motion.h1>
                      </div>
                      
                      <motion.div className="flex w-full relative">
                        <div className="relative w-full flex items-center">
                          <Input type="text" placeholder="Buscar artistas" className="pr-14 bg-[#F5F1EB] text-black h-14 rounded-full border-0" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
        </div>

        <section className=" bg-vyba-cream">
          <div className="w-full overflow-hidden">
            <Marquee className="py-4" pauseOnHover>
              {genreCards.map((card, index) => <ArtistCard key={index} type={card.type} name={card.name} artistCount={card.artistCount} rating={card.rating} artistAvatars={card.artistAvatars} onClick={() => handleCardClick(card.name, card.type)} />)}
            </Marquee>
            
            <Marquee className="py-4" reverse pauseOnHover>
              {typeCards.map((card, index) => <ArtistCard key={index + genreCards.length} type={card.type} name={card.name} artistCount={card.artistCount} rating={card.rating} artistAvatars={card.artistAvatars} onClick={() => handleCardClick(card.name, card.type)} />)}
            </Marquee>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-16">
              Contratar a un artista nunca había sido tan fácil
            </h2>

            <div className="max-w-5xl mx-auto">
              <TimelineStep 
                stepNumber={1} 
                title="Busca entre todos los artistas disponibles"
                description="Busca a Rita y encuentra en pocos minutos al artista que mejor se adapte a tus condiciones."
              >
                <div className="bg-gray-50 p-4 rounded-xl max-w-sm">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex gap-2 mb-3">
                      <div className="bg-vyba-blue text-vyba-navy font-medium text-sm py-1 px-3 rounded-full">Busca con IA</div>
                      <div className="bg-gray-100 text-gray-700 font-medium text-sm py-1 px-3 rounded-full">Filtros</div>
                    </div>
                    <div className="bg-gray-100 h-20 rounded-lg"></div>
                  </div>
                </div>
              </TimelineStep>

              <TimelineStep 
                stepNumber={2} 
                title="Contacta con el artista de una forma fácil"
                description="Contacta de una forma fácil y rápida, un proceso seguro mediante a nuestro sistema de mensajes"
              >
                <div className="bg-gray-50 p-4 rounded-xl max-w-sm">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-center mb-3">
                      <div className="font-medium">Fines de semana</div>
                      <div className="text-xl font-bold">100-200€</div>
                    </div>
                    <Button className="w-full bg-vyba-blue text-vyba-navy hover:bg-vyba-blue/90">
                      Contactar
                    </Button>
                  </div>
                </div>
              </TimelineStep>

              <TimelineStep 
                stepNumber={3} 
                title="Escribe una reseña"
                description="Comparte tu experiencia con la comunidad y ayuda a otros a encontrar al artista perfecto para sus eventos."
                isLast={true}
              >
                <div className="bg-gray-50 p-4 rounded-xl max-w-sm">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <Button variant="outline" className="w-full mb-3">
                      Escribe una reseña
                    </Button>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                  </div>
                </div>
              </TimelineStep>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};

export default Index;
