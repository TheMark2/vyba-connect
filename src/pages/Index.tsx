import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
const Index = () => {
  return <div className="min-h-screen flex flex-col p-0 m-0">
      {/* Navbar */}
      <div className="w-full">
        <Navbar className="mx-auto" />
      </div>

      <main className="flex-1">
        {/* Sección Hero con imagen de fondo */}
        <div className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0 px-6 md:px-10 lg:px-14 xl:px-16 pb-32">
            <div className="relative w-full h-full rounded-[2vw] overflow-hidden">
              {/* Imagen */}
              <motion.img initial={{
              opacity: 0,
              scale: 1.05
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.8,
              ease: "easeOut"
            }} src="/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png" alt="DJ performing at a concert" className="w-full h-full brightness-75 object-cover" />

              {/* Degradado */}
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
          </div>

          {/* Contenido principal sobre la imagen */}
          <div className="relative z-20 container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] h-full flex flex-col justify-center pb-32">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }} className="max-w-2xl space-y-16 p-4">
              <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
                El portal perfecto<br />para encontrar tu DJ
              </h1>

              {/* Barra de búsqueda */}
              <div className="flex items-center max-w-xl">
                <div className="relative w-full flex items-center">
                  <input type="text" placeholder="Buscar artistas" className="w-full pl-6 pr-14 py-4 rounded-full text-black font-medium bg-white" />
                  <Button variant="secondary" className="absolute right-1 rounded-full aspect-square p-2 bg-gray-100">
                    <Search className="size-5 text-gray-500" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sección de DJs */}
        <div className="bg-white py-32">
          <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px]">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              Descubre los mejores DJs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(item => <div key={item} className="bg-vyba-beige rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-64 bg-vyba-cream"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">DJ Ejemplo {item}</h3>
                    <p className="text-gray-600 mb-4">
                      Especializado en música electrónica
                    </p>
                    <Button variant="secondary" className="w-full">
                      Ver perfil
                    </Button>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Sección de Beneficios */}
        <div className="bg-vyba-cream py-32">
          <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">¿Por qué elegirnos?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-16">
              Conectamos a los mejores DJs con clientes que buscan experiencias musicales inolvidables.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[{
              title: "Variedad",
              desc: "Amplia selección de DJs para todo tipo de eventos y estilos musicales."
            }, {
              title: "Calidad",
              desc: "Solo trabajamos con profesionales verificados y con experiencia."
            }, {
              title: "Facilidad",
              desc: "Proceso sencillo para contratar el DJ perfecto para tu evento."
            }].map((item, index) => <div key={index} className="space-y-4">
                  <div className="bg-vyba-blue h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p>{item.desc}</p>
                </div>)}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Index;