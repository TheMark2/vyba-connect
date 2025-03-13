
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero section with full-width background image */}
        <div className="relative w-full h-screen overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0 px-8 md:px-16 lg:px-24 xl:px-32 mb-32">
            <motion.img 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src="/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png" 
              alt="DJ performing at a concert" 
              className="rounded-[2vw] w-full h-full brightness-75 object-cover"
            />
          </div>
          
          {/* Content with text and search */}
          <div className="relative z-10 container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] h-full flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl space-y-8 p-4">
              <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
                El portal perfecto<br />para encontrar tu dj
              </h1>
              
              {/* Search bar */}
              <div className="flex items-center max-w-xl">
                <div className="relative w-full flex items-center">
                  <input 
                    type="text" 
                    placeholder="Buscar artistas" 
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
        
        {/* Additional content to make page scrollable */}
        <div className="bg-white py-32">
          <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px]">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Descubre los mejores DJs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(item => <div key={item} className="bg-vyba-beige rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-64 bg-vyba-cream"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">DJ Ejemplo {item}</h3>
                    <p className="text-gray-600 mb-4">Especializado en música electrónica</p>
                    <Button variant="secondary" className="w-full">Ver perfil</Button>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        
        {/* Another section for more scroll space */}
        <div className="bg-vyba-cream py-32">
          <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">¿Por qué elegirnos?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-16">Conectamos a los mejores DJs con clientes que buscan experiencias musicales inolvidables.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="bg-vyba-blue h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold">Variedad</h3>
                <p>Amplia selección de DJs para todo tipo de eventos y estilos musicales.</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-vyba-blue h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold">Calidad</h3>
                <p>Solo trabajamos con profesionales verificados y con experiencia.</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-vyba-blue h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold">Facilidad</h3>
                <p>Proceso sencillo para contratar el DJ perfecto para tu evento.</p>
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
