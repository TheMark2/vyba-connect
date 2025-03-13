import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const Index = () => {
  // Referencias para el contenedor de animación
  const scrollRef = useRef(null);
  
  // Estado para rastrear el artista actual
  const [currentArtist, setCurrentArtist] = useState(0);
  
  // Datos de artistas para la animación
  const artists = [
    {
      type: "DJ",
      image: "/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png",
      description: "El portal perfecto para encontrar tu DJ"
    },
    {
      type: "Saxofonista",
      image: "/api/placeholder/1200/800",
      description: "Encuentra al saxofonista ideal para tu evento"
    },
    {
      type: "Guitarrista",
      image: "/api/placeholder/1200/800",
      description: "Conecta con talentosos guitarristas"
    }
  ];

  // Configuración de la animación de scroll
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  // Efecto para cambiar el artista basado en el progreso del scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      // Mapear el progreso del scroll a los índices de artistas
      // Dividimos el rango de 0-1 en partes iguales basadas en el número de artistas
      const artistIndex = Math.min(
        Math.floor(value * artists.length),
        artists.length - 1
      );
      setCurrentArtist(artistIndex);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress]);

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
          {/* Contenedor sticky que permanece hasta terminar la animación */}
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Imagen de fondo con transición */}
            <div className="relative w-full h-screen overflow-hidden">
              <div className="absolute inset-0 px-6 md:px-10 lg:px-14 xl:px-16 pb-32">
                <div className="relative w-full h-full rounded-[2vw] overflow-hidden">
                  {/* Mapeamos todas las imágenes y animamos su opacidad */}
                  {artists.map((artist, index) => (
                    <motion.img
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: currentArtist === index ? 1 : 0,
                        scale: currentArtist === index ? 1 : 1.05
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      src={artist.image}
                      alt={`${artist.type} performing`}
                      className="absolute inset-0 w-full h-full brightness-75 object-cover"
                    />
                  ))}

                  {/* Degradado */}
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
              </div>

              {/* Contenido principal sobre la imagen */}
              <div className="relative z-20 container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] h-full flex flex-col justify-center pb-32">
                <motion.div
                  className="max-w-2xl space-y-10 p-4"
                >
                  {/* Título con animación */}
                  <div className="h-[120px] md:h-[160px] relative">
                    {artists.map((artist, index) => (
                      <motion.h1
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: currentArtist === index ? 1 : 0,
                          y: currentArtist === index ? 0 : 20
                        }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-6xl font-black leading-tight text-white absolute"
                      >
                        {artist.description}
                      </motion.h1>
                    ))}
                  </div>

                  {/* Barra de búsqueda */}
                  <div className="flex items-center max-w-xl">
                    <div className="relative w-full flex items-center">
                      <input
                        type="text"
                        placeholder={`Buscar ${artists[currentArtist].type.toLowerCase()}s`}
                        className="w-full pl-6 pr-14 py-4 rounded-full text-black font-medium bg-white"
                      />
                      <Button
                        variant="secondary"
                        className="absolute right-1 rounded-full aspect-square p-2 bg-gray-100"
                      >
                        <Search className="size-5 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
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