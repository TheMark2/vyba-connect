
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Index = () => {
  // Referencias para el contenedor de animación
  const scrollRef = useRef(null);
  
  // Configuración de la animación de scroll
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  // Artistas para la animación
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

  // Transformaciones basadas en el progreso del scroll - Haciendo la animación más rápida
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.25, 1],  // Acelerado (antes era [0, 0.3, 0.35, 1])
    [1, 1, 0, 0]
  );
  
  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.25, 0.45, 0.5, 1],  // Acelerado (antes era [0, 0.3, 0.35, 0.65, 0.7, 1])
    [0, 0, 1, 1, 0, 0]
  );
  
  const opacity3 = useTransform(
    scrollYProgress,
    [0, 0.45, 0.5, 1],  // Acelerado (antes era [0, 0.65, 0.7, 1])
    [0, 0, 1, 1]
  );
  
  // Transformaciones para los márgenes superior e inferior (para centrar la imagen)
  const marginTopBottom = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0%", "10%", "20%"]
  );
  
  // Placeholder de búsqueda dinámico
  const searchPlaceholder = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 1],
    ["Buscar DJs", "Buscar saxofonistas", "Buscar guitarristas", "Buscar guitarristas"]
  );

  return (
    <div className="min-h-screen flex flex-col p-0 m-0">
      {/* Navbar */}
      <div className="w-full">
        <Navbar className="mx-auto" />
      </div>

      <main className="flex-1">
        {/* Sección de animación con scroll */}
        <div 
          ref={scrollRef}
          className="h-[300vh] relative"
        >
          {/* Contenedor sticky que permanece desde el inicio */}
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Imagen de fondo con transición */}
            <div className="relative w-full h-screen overflow-hidden">
              <div className="absolute inset-0 px-6 md:px-10 lg:px-14 xl:px-16">
                <motion.div 
                  className="relative w-full h-full rounded-[2vw] overflow-hidden"
                  style={{ 
                    marginTop: marginTopBottom,
                    marginBottom: marginTopBottom
                  }}
                >
                  {/* Primera imagen (DJ) */}
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
                  
                  {/* Segunda imagen (Saxofonista) */}
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
                  
                  {/* Tercera imagen (Guitarrista) */}
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

                  {/* Degradado */}
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                </motion.div>
              </div>

              {/* Contenido principal sobre la imagen */}
              <div className="relative z-20 container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] h-full flex flex-col justify-center">
                <div className="max-w-2xl space-y-10 p-4">
                  {/* Textos con animación de crossfade */}
                  <div className="h-[120px] md:h-[160px] relative">
                    {/* Texto para DJ */}
                    <motion.h1
                      style={{ opacity: opacity1 }}
                      className="text-5xl md:text-6xl font-black leading-tight text-white absolute"
                    >
                      {artists[0].description}
                    </motion.h1>
                    
                    {/* Texto para Saxofonista */}
                    <motion.h1
                      style={{ opacity: opacity2 }}
                      className="text-5xl md:text-6xl font-black leading-tight text-white absolute"
                    >
                      {artists[1].description}
                    </motion.h1>
                    
                    {/* Texto para Guitarrista */}
                    <motion.h1
                      style={{ opacity: opacity3 }}
                      className="text-5xl md:text-6xl font-black leading-tight text-white absolute"
                    >
                      {artists[2].description}
                    </motion.h1>
                  </div>

                  {/* Barra de búsqueda */}
                  <div className="flex items-center max-w-xl">
                    <div className="relative w-full flex items-center">
                      <input
                        type="text"
                        className="w-full pl-6 pr-14 py-4 rounded-full text-black font-medium bg-white"
                        placeholder={searchPlaceholder.get()}            
                      />
                      <Button
                        variant="secondary"
                        className="absolute right-1 rounded-full aspect-square p-2 bg-gray-100"
                      >
                        <Search className="size-5 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Artistas */}
        <div className="bg-white py-32">
          <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px]">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              Descubre los mejores artistas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  key={item}
                  className="bg-vyba-beige rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="h-64 bg-vyba-cream"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Artista {item}</h3>
                    <p className="text-gray-600 mb-4">
                      Especializado en su arte
                    </p>
                    <Button variant="secondary" className="w-full">
                      Ver perfil
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección de Beneficios */}
        <div className="bg-vyba-cream py-32">
          <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">¿Por qué elegirnos?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-16">
              Conectamos a los mejores artistas con clientes que buscan experiencias musicales inolvidables.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Variedad", desc: "Amplia selección de artistas para todo tipo de eventos y estilos musicales." },
                { title: "Calidad", desc: "Solo trabajamos con profesionales verificados y con experiencia." },
                { title: "Facilidad", desc: "Proceso sencillo para contratar al artista perfecto para tu evento." },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="bg-vyba-blue h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
