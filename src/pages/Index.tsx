
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

  // Transiciones de opacidad mejoradas con valores más optimizados
  const opacity1 = useTransform(scrollYProgress, [0, 0.19, 0.25, 0.3], [1, 0.9, 0.3, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.19, 0.25, 0.3, 0.43, 0.5, 0.55], [0, 0.3, 0.9, 1, 0.3, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.43, 0.5, 0.55, 1], [0, 0.3, 1, 1]);

  // Efectos de escala refinados para las imágenes
  const scale1 = useTransform(scrollYProgress, [0, 0.19, 0.25], [1, 1.05, 1.1]);
  const scale2 = useTransform(scrollYProgress, [0.19, 0.25, 0.45, 0.5], [0.95, 1, 1.05, 1.1]);
  const scale3 = useTransform(scrollYProgress, [0.45, 0.5, 0.7], [0.95, 1, 1.05]);
  
  // Efectos de movimiento paralaje para las imágenes - más sutiles
  const moveY1 = useTransform(scrollYProgress, [0, 0.25], ["0%", "-3%"]);
  const moveY2 = useTransform(scrollYProgress, [0.25, 0.5], ["0%", "-3%"]);
  const moveY3 = useTransform(scrollYProgress, [0.5, 0.75], ["0%", "-3%"]);

  // Movimiento sutil en el eje X para dar profundidad
  const moveX1 = useTransform(scrollYProgress, [0, 0.25], ["0%", "1%"]);
  const moveX2 = useTransform(scrollYProgress, [0.25, 0.5], ["0%", "-1%"]);
  const moveX3 = useTransform(scrollYProgress, [0.5, 0.75], ["0%", "1%"]);
  
  // Mantener el texto y el placeholder sin animaciones
  const searchPlaceholder = useTransform(scrollYProgress, [0, 0.25, 0.5, 1], ["Buscar artistas", "Buscar saxofonistas", "Buscar guitarristas", "Buscar guitarristas"]);
  const headingText = useTransform(scrollYProgress, [0, 0.25, 0.5], ["El portal perfecto para encontrar tu dj", "Descubre saxofonistas profesionales", "Conecta con guitarristas talentosos"]);
  
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
                  {/* DJ image layer */}
                  <motion.div 
                    className="absolute inset-0 origin-center" 
                    style={{
                      opacity: opacity1,
                      scale: scale1,
                      y: moveY1,
                      x: moveX1
                    }}
                  >
                    <img 
                      src={artists[0].image} 
                      alt="DJ performing" 
                      className="w-full h-full brightness-75 object-cover"
                    />
                  </motion.div>
                  
                  {/* Saxofonista image layer */}
                  <motion.div 
                    className="absolute inset-0 origin-center" 
                    style={{
                      opacity: opacity2,
                      scale: scale2,
                      y: moveY2,
                      x: moveX2
                    }}
                  >
                    <img 
                      src={artists[1].image} 
                      alt="Saxofonista performing" 
                      className="w-full h-full brightness-75 object-cover"
                    />
                  </motion.div>
                  
                  {/* Guitarrista image layer sin padding */}
                  <motion.div
                    className="absolute inset-0 origin-center"
                    style={{
                      opacity: opacity3,
                      scale: scale3,
                      y: moveY3,
                      x: moveX3
                    }}
                  >
                    <img 
                      src={artists[2].image} 
                      alt="Guitarrista performing" 
                      className="w-full h-full brightness-75 object-cover rounded-[2vw]" 
                    />
                  </motion.div>

                  {/* Background overlay negro */}
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                  
                  {/* Content */}
                  <motion.div 
                    className="absolute inset-0 flex flex-col justify-center text-white px-6 md:px-12 lg:px-16"
                    style={{
                      y: useTransform(scrollYProgress, [0.8, 1], ["0%", "100vh"])
                    }}
                  >
                    <div className="max-w-xl mx-0">
                      <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 text-white leading-tight">
                        {headingText}
                      </motion.h1>
                      
                      <motion.div className="flex w-full relative">
                        <div className="relative w-full flex items-center">
                          <Input 
                            type="text" 
                            placeholder={String(searchPlaceholder)} 
                            className="pr-14 bg-white/95 text-black placeholder:text-gray-500 h-14 text-lg rounded-full border-0 shadow-md" 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                          />
                          <Button 
                            type="submit" 
                            size="icon" 
                            className="absolute right-1 rounded-full h-12 w-12 flex items-center justify-center"
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

        {/* Nueva sección con contenido sticky e imagen */}
        <div className="relative bg-vyba-cream">
          <div className="container mx-auto px-6 md:px-10 lg:px-14 xl:px-16 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="sticky top-24">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-vyba-navy">Encuentra al artista perfecto para tu evento</h2>
                <p className="text-lg mb-8 text-gray-700">
                  Descubre una amplia selección de talentosos artistas disponibles para todo tipo de eventos y celebraciones.
                </p>
                <div className="relative w-full flex items-center mb-8">
                  <Input 
                    type="text" 
                    placeholder="Buscar artistas" 
                    className="pr-14 bg-white text-black placeholder:text-gray-500 h-14 text-lg rounded-full border-0 shadow-md" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-1 rounded-full h-12 w-12 flex items-center justify-center"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
                <Button className="h-14 px-8 text-lg rounded-full">
                  Ver todos los artistas
                </Button>
              </div>
              <div className="relative overflow-hidden rounded-[2vw]">
                <img 
                  src="https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&h=800&auto=format&fit=crop" 
                  alt="Músico tocando en un evento" 
                  className="w-full h-auto object-cover rounded-[2vw] shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
