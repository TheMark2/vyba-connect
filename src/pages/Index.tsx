import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Function to handle scroll events
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };
  
  useEffect(() => {
    // Only add scroll listener on large screens (min-width: 1024px)
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    
    if (isLargeScreen) {
      window.addEventListener("scroll", handleScroll);
      
      // Apply animations based on scroll position
      if (imageRef.current && imageContainerRef.current) {
        // Scale image to fill container based on scroll (0-300px)
        const scaleProgress = Math.min(scrollY / 500, 0.3);
        const scale = 1.0 + scaleProgress;
        
        // Adjust image position to keep it centered as it scales
        const offsetY = -scrollY * 0.1; // Slight parallax effect
        imageRef.current.style.transform = `scale(${scale}) translateY(${offsetY}px)`;
      }
      
      if (headingRef.current) {
        // Calculate color transition - from black to white
        const scrollProgress = Math.min(scrollY / 300, 1);
        // Start with black (0,0,0) and transition to white (255,255,255)
        const colorValue = Math.floor(255 * scrollProgress);
        headingRef.current.style.color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
      }
    }
    
    return () => {
      if (isLargeScreen) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollY]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero section */}
        <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] py-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Left column with text and search */}
          <div className="flex-1 space-y-16">
            <h1 
              ref={headingRef} 
              className="text-5xl md:text-7xl font-black leading-tight text-black transition-colors duration-300"
            >
              El portal perfecto para encontrar tu dj
            </h1>
            
            {/* Search bar */}
            <div className="flex items-center max-w-xl">
              <Button variant="secondary" className="w-full relative flex items-center justify-start gap-3 px-6 py-7 text-lg font-normal hover:bg-secondary-hover">
                <Search className="size-5 text-black/60" />
                <span className="text-black font-bold">Buscar artistas</span>
              </Button>
            </div>
          </div>

          {/* Right column with image */}
          <div className="flex-1 overflow-hidden rounded-3xl" ref={imageContainerRef}>
            <div className="rounded-3xl overflow-hidden h-[500px]">
              <img 
                ref={imageRef} 
                src="/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png" 
                alt="DJ performing at a concert" 
                className="w-full h-full object-cover transition-transform duration-300 ease-out origin-center"
              />
            </div>
          </div>
        </div>
        
        {/* Additional content to make page scrollable */}
        <div className="bg-white py-32">
          <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px]">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Descubre los mejores DJs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-vyba-beige rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-64 bg-vyba-cream"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">DJ Ejemplo {item}</h3>
                    <p className="text-gray-600 mb-4">Especializado en música electrónica</p>
                    <Button variant="secondary" className="w-full">Ver perfil</Button>
                  </div>
                </div>
              ))}
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
