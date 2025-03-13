
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

  const artists = [
    {
      type: "DJ",
      image: "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
      description: "El portal perfecto para encontrar tu DJ"
    },
    {
      type: "Saxofonista",
      image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=1200&h=800&auto=format&fit=crop",
      description: "Encuentra al saxofonista ideal para tu evento"
    },
    {
      type: "Guitarrista",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&auto=format&fit=crop",
      description: "Conecta con talentosos guitarristas"
    }
  ];

  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.25, 1],
    [1, 1, 0, 0]
  );

  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.25, 0.45, 0.5, 1],
    [0, 0, 1, 1, 0, 0]
  );

  const opacity3 = useTransform(
    scrollYProgress,
    [0, 0.45, 0.5, 1],
    [0, 0, 1, 1]
  );

  const paddingTop = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0px", "200px", "120px"]
  );

  const paddingBottom = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["200px", "120px", "120px"]
  );

  const textTranslateY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, -20, -40, -60, -80, -100]
  );

  const searchScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [1, 1.05, 1.1, 1.15]
  );

  const searchPlaceholder = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 1],
    ["Buscar DJs", "Buscar saxofonistas", "Buscar guitarristas", "Buscar guitarristas"]
  );

  const headingText = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5],
    ["Encuentra el mejor DJ para tu evento", "Descubre saxofonistas profesionales", "Conecta con guitarristas talentosos"]
  );

  const descriptionText = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5],
    [artists[0].description, artists[1].description, artists[2].description]
  );

  return (
    <div className="min-h-screen flex flex-col p-0 m-0">
      <div className="w-full">
        <Navbar className="mx-auto" />
      </div>

      <main className="flex-1">
        <div 
          ref={scrollRef}
          className="h-[300vh] relative"
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="relative w-full h-screen overflow-hidden">
              <motion.div 
                className="absolute inset-0 px-6 md:px-10 lg:px-14 xl:px-16"
                style={{ 
                  paddingTop, 
                  paddingBottom 
                }}
              >
                <motion.div 
                  className="relative w-full h-full rounded-[2vw] overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ opacity: opacity1 }}
                  >
                    <img 
                      src={artists[0].image}
                      alt="DJ performing" 
                      className="w-full h-full brightness-75 object-cover"
                    />
                  </motion.div>
                  
                  <motion.div
                    className="absolute inset-0"
                    style={{ opacity: opacity2 }}
                  >
                    <img 
                      src={artists[1].image}
                      alt="Saxofonista performing" 
                      className="w-full h-full brightness-75 object-cover"
                    />
                  </motion.div>
                  
                  <motion.div
                    className="absolute inset-0"
                    style={{ opacity: opacity3 }}
                  >
                    <img 
                      src={artists[2].image}
                      alt="Guitarrista performing" 
                      className="w-full h-full brightness-75 object-cover"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-black opacity-50"></div>
                  
                  {/* Contenido central con texto y buscador */}
                  <motion.div 
                    className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 md:px-12"
                    style={{ y: textTranslateY }}
                  >
                    <motion.h1 
                      className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center"
                      style={{ opacity: 1 }}
                    >
                      {headingText}
                    </motion.h1>
                    
                    <motion.p 
                      className="text-xl md:text-2xl text-center mb-8 max-w-2xl"
                      style={{ opacity: 1 }}
                    >
                      {descriptionText}
                    </motion.p>
                    
                    <motion.div 
                      className="flex w-full max-w-xl mx-auto relative"
                      style={{ scale: searchScale }}
                    >
                      <Input
                        type="text"
                        placeholder={String(searchPlaceholder)}
                        className="pr-10 bg-white/90 text-black placeholder:text-gray-500 h-12 text-lg rounded-l-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button 
                        className="rounded-r-full h-12" 
                        type="submit"
                      >
                        <Search className="h-5 w-5 mr-2" /> Buscar
                      </Button>
                    </motion.div>
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
