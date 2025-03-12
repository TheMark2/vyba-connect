
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  // Animation constants
  const ANIMATION_END_SCROLL = 500; // px of scroll when animation completes
  
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
      if (heroContainerRef.current && textContainerRef.current && imageRef.current) {
        // Calculate animation progress (0 to 1)
        const progress = Math.min(scrollY / ANIMATION_END_SCROLL, 1);
        
        // When animation is complete, we allow normal scrolling
        if (progress >= 1 && contentRef.current) {
          contentRef.current.style.marginTop = '100vh';
          heroContainerRef.current.style.position = 'absolute';
          heroContainerRef.current.style.top = '0';
          heroContainerRef.current.style.left = '0';
          heroContainerRef.current.style.width = '100%';
          heroContainerRef.current.style.height = '100vh';
        } else if (contentRef.current) {
          contentRef.current.style.marginTop = '0';
          heroContainerRef.current.style.position = 'sticky';
          heroContainerRef.current.style.top = '0';
          heroContainerRef.current.style.height = '100vh';
        }
        
        // Expand image to full width
        imageRef.current.style.width = '100%';
        imageRef.current.style.height = '100vh';
        imageRef.current.style.objectFit = 'cover';
        imageRef.current.style.position = 'absolute';
        imageRef.current.style.top = '0';
        imageRef.current.style.left = '0';
        imageRef.current.style.zIndex = '0';
        
        // Move text container to center as we scroll
        const startX = 0;
        const endX = 50; // center position
        const xPos = startX + (endX - startX) * progress;
        
        textContainerRef.current.style.position = 'relative';
        textContainerRef.current.style.zIndex = '10';
        textContainerRef.current.style.left = `${xPos}%`;
        textContainerRef.current.style.transform = `translateX(-${xPos}%)`;
        
        // Add overlay gradient on text as we scroll
        const overlayOpacity = Math.min(0.6 * progress, 0.6);
        textContainerRef.current.style.backgroundColor = `rgba(0, 0, 0, ${overlayOpacity})`;
        textContainerRef.current.style.padding = '2rem';
        textContainerRef.current.style.borderRadius = '1rem';
      }
      
      if (headingRef.current) {
        // Transition text from black to white
        const colorProgress = Math.min(scrollY / 300, 1);
        headingRef.current.style.color = `rgb(255, 255, 255)`;
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
        {/* Hero section with sticky behavior */}
        <div 
          ref={heroContainerRef}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          {/* Image background */}
          <img 
            ref={imageRef} 
            src="/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png" 
            alt="DJ performing at a concert" 
            className="w-full h-full object-cover transition-all duration-300 ease-out"
          />
          
          {/* Centered container for text */}
          <div className="container mx-auto px-8 absolute inset-0 flex items-center">
            <div 
              ref={textContainerRef}
              className="max-w-xl transition-all duration-300 ease-out bg-transparent"
            >
              <h1 
                ref={headingRef} 
                className="text-5xl md:text-7xl font-black leading-tight text-black transition-colors duration-300 mb-8"
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
          </div>
        </div>
        
        {/* Content that appears after the hero animation */}
        <div ref={contentRef} className="bg-white transition-all duration-300">
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
