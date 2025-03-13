
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Index = () => {
  const scrollRef = useRef(null);
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

  // Configuramos el padding superior para que aumente progresivamente de 0 a 16
  const paddingTop = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0px", "32px", "16px"]
  );

  // Configuramos el padding inferior para que disminuya progresivamente de 32 a 16
  const paddingBottom = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["32px", "16px", "16px"]
  );

  const searchPlaceholder = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 1],
    ["Buscar DJs", "Buscar saxofonistas", "Buscar guitarristas", "Buscar guitarristas"]
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
              <div className="absolute inset-0 px-6 md:px-10 lg:px-14 xl:px-16">
                <motion.div 
                  className="relative w-full h-full rounded-[2vw] overflow-hidden"
                  style={{ 
                    paddingTop: paddingTop,
                    paddingBottom: paddingBottom
                  }}
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
                </motion.div>
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
