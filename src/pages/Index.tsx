
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
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
      if (heroRef.current && imageRef.current && contentRef.current) {
        // Maximum scroll value for animation
        const maxScroll = 500;
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        
        // Adjust the image container to expand from right to left
        const startWidth = 50; // Starting width percentage
        const finalWidth = 100; // Final width percentage
        const currentWidth = startWidth + ((finalWidth - startWidth) * scrollProgress);
        
        // Update image width
        imageRef.current.style.width = `${currentWidth}%`;
        
        // Update image border radius
        const startRadius = 20; // Starting border radius
        const endRadius = 0; // End border radius
        const currentRadius = startRadius - (startRadius * scrollProgress);
        imageRef.current.style.borderRadius = `${currentRadius}px`;
        
        // Move text and search box over the image as it expands
        if (headingRef.current && searchRef.current) {
          // Adjust text container width as the image expands
          contentRef.current.style.zIndex = "10";
          
          // Change heading text color to white
          if (scrollProgress > 0.3) {
            headingRef.current.style.color = "white";
            headingRef.current.style.textShadow = "0px 2px 4px rgba(0, 0, 0, 0.5)";
          } else {
            headingRef.current.style.color = "black";
            headingRef.current.style.textShadow = "none";
          }
        }
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
        <div 
          ref={heroRef}
          className="relative w-full h-screen overflow-hidden"
        >
          {/* Background image with initial styling */}
          <img 
            ref={imageRef} 
            src="/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png" 
            alt="DJ performing at a concert" 
            className="transition-all duration-300 ease-out shadow-lg"
            style={{
              width: "50%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              right: 0,
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px"
            }}
          />
          
          {/* Content container */}
          <div 
            ref={contentRef}
            className="container relative mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] py-16 h-full flex items-center"
          >
            {/* Left column with text and search */}
            <div className="max-w-2xl space-y-16 relative z-10">
              <h1 
                ref={headingRef} 
                className="text-5xl md:text-7xl font-black leading-tight transition-colors duration-300"
              >
                El portal perfecto para encontrar tu dj
              </h1>
              
              {/* Search bar */}
              <div 
                ref={searchRef} 
                className="flex items-center max-w-xl transition-all duration-300"
              >
                <div className="relative w-full flex items-center">
                  <input 
                    type="text" 
                    placeholder="Buscar artistas" 
                    className="w-full pl-6 pr-14 py-4 rounded-full text-black font-medium bg-white shadow-md"
                  />
                  <Button variant="secondary" className="absolute right-1 rounded-full aspect-square p-2">
                    <Search className="size-5" />
                  </Button>
                </div>
              </div>
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
