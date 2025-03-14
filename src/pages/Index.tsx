import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });

  const artists = [{
    type: "DJ",
    image: "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
    description: "El portal perfecto para encontrar tu DJ"
  }, {
    type: "Saxofonista",
    image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=1200&h=800&auto=format&fit=crop",
    description: "Encuentra al saxofonista ideal para tu evento"
  }, {
    type: "Guitarrista",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&auto=format&fit=crop",
    description: "Conecta con talentosos guitarristas"
  }];

  // Transiciones de opacidad más suaves para las imágenes
  const opacity1 = useTransform(scrollYProgress, [0, 0.18, 0.25, 1], [1, 1, 0, 0]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.18, 0.25, 0.43, 0.5, 1], [0, 0, 1, 1, 0, 0]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.43, 0.5, 1], [0, 0, 1, 1]);

  // Animaciones de escala para las imágenes
  const scale1 = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const scale2 = useTransform(scrollYProgress, [0.2, 0.4], [1, 1.1]);
  const scale3 = useTransform(scrollYProgress, [0.4, 0.6], [1, 1.05]);
  
  // Animaciones de rotación para añadir dinamismo sutil
  const rotate1 = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const rotate2 = useTransform(scrollYProgress, [0.2, 0.4], [0, -1]);
  const rotate3 = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

  // Transformaciones de texto con timing mejorado
  const textTranslateY = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, -20, -40, -60, -80, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.25, 0.45, 0.5, 0.7, 0.75], [1, 1, 0.7, 0.7, 0.4, 0.4, 1]);
  
  // Mejoras en la animación de búsqueda
  const searchScale = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], [1, 1.05, 1.1, 1.15]);
  const searchTranslateY = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], [0, 5, 10, 15]);
  const searchPlaceholder = useTransform(scrollYProgress, [0, 0.24, 0.26, 0.48, 0.52], [
    "Buscar artistas",
    "Buscar artistas",
    "Buscar saxofonistas",
    "Buscar saxofonistas",
    "Buscar guitarristas"
  ]);
  
  // Texto de cabecera con transiciones más suaves
  const headingText = useTransform(scrollYProgress, [0, 0.23, 0.25, 0.48, 0.5], [
    "El portal perfecto para encontrar tu DJ",
    "El portal perfecto para encontrar tu DJ",
    "Descubre saxofonistas profesionales",
    "Descubre saxofonistas profesionales",
    "Conecta con guitarristas talentosos"
  ]);
  
  // Transformador para el padding izquierdo de la última imagen con movimiento más orgánico
  const lastImagePaddingLeft = useTransform(
    scrollYProgress, 
    [0, 0.45, 0.5, 0.65, 0.8, 0.9, 1], 
    [0, 0, 400, 600, 800, 1000, 1200]
  );
  
  // Animación de desplazamiento lateral para el contenido
  const contentTranslateX = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], [0, -20, -40, -60]);
  
  // Efectos de blur para transiciones más suaves
  const blur1 = useTransform(scrollYProgress, [0.15, 0.25], [0, 5]);
  const blur2 = useTransform(scrollYProgress, [0.4, 0.5], [0, 5]);

  return (
    <div className="min-h-screen flex flex-col p-0 m-0">
      <div className="w-full">
        <Navbar className="mx-auto" />
      </div>

      <main className="flex-1">
        <div ref={scrollRef} className="h-[300vh] relative">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="relative w-full h-screen overflow-hidden">
              <motion.div className="absolute inset-0 px-6 md:px-10 lg:px-14 xl:px-16 pt-8 pb-32">
                <motion.div className="relative w-full h-full rounded-[2vw] overflow-hidden">
                  <motion.div 
                    className="absolute inset-0" 
                    style={{
                      opacity: opacity1,
                      scale: scale1,
                      rotate: rotate1,
                      filter: `blur(${blur1}px)`
                    }}
                  >
                    <img src={artists[0].image} alt="DJ performing" className="w-full h-full brightness-75 object-cover" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute inset-0" 
                    style={{
                      opacity: opacity2,
                      scale: scale2,
                      rotate: rotate2,
                      filter: `blur(${blur2}px)`
                    }}
                  >
                    <img src={artists[1].image} alt="Saxofonista performing" className="w-full h-full brightness-75 object-cover" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute inset-0" 
                    style={{
                      opacity: opacity3,
                      paddingLeft: lastImagePaddingLeft,
                      scale: scale3,
                      rotate: rotate3
                    }}
                  >
                    <img 
                      src={artists[2].image} 
                      alt="Guitarrista performing" 
                      className="w-full h-full brightness-75 object-cover rounded-[2vw] transition-all duration-300"
                    />
                  </motion.div>

                  <motion.div 
                    className="absolute inset-0 bg-black"
                    style={{
                      paddingLeft: lastImagePaddingLeft,
                      opacity: useTransform(opacity3, value => value > 0 ? 0.5 : 0.5)
                    }}
                  ></motion.div>
                  
                  {/* Content with enhanced animations */}
                  <motion.div 
                    className="absolute inset-0 flex flex-col justify-center text-white px-6 md:px-12 lg:px-16"
                    style={{
                      y: textTranslateY,
                      opacity: textOpacity,
                      x: contentTranslateX
                    }}
                  >
                    <div className="max-w-xl mx-0">
                      <motion.h1 
                        className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 text-white leading-tight"
                        style={{
                          textShadow: useTransform(
                            scrollYProgress, 
                            [0, 0.5, 1], 
                            ['0px 2px 4px rgba(0,0,0,0.3)', '0px 3px 6px rgba(0,0,0,0.4)', '0px 4px 8px rgba(0,0,0,0.5)']
                          )
                        }}
                      >
                        {headingText}
                      </motion.h1>
                      
                      <motion.div 
                        className="flex w-full relative"
                        style={{
                          scale: searchScale,
                          y: searchTranslateY
                        }}
                      >
                        <div className="relative w-full flex items-center">
                          <Input 
                            type="text" 
                            placeholder={String(searchPlaceholder)} 
                            className="pr-14 bg-white/95 text-black placeholder:text-gray-500 h-14 text-lg rounded-full border-0 shadow-md transition-all duration-300" 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                          />
                          <Button 
                            type="submit" 
                            size="icon" 
                            className="absolute right-1 rounded-full h-12 w-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                          >
                            <Search className="h-5 w-5" />
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
      </main>

      <Footer />
    </div>
  );
};

export default Index;