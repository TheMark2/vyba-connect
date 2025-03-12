
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  
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
      if (imageRef.current) {
        // Scale from 1 to 1.1 based on scroll position (0-300px)
        const scale = 1 + Math.min(scrollY / 1000, 0.1);
        imageRef.current.style.transform = `scale(${scale})`;
        imageRef.current.style.transition = "transform 0.3s ease-out";
      }
      
      if (headingRef.current) {
        // Calculate color transition - from black to purple
        const scrollProgress = Math.min(scrollY / 300, 1);
        const r = Math.floor(155 - (155 * scrollProgress));
        const g = Math.floor(155 - (155 * scrollProgress));
        const b = Math.floor(155 + (90 * scrollProgress));
        headingRef.current.style.color = `rgb(${r}, ${g}, ${b})`;
        headingRef.current.style.transition = "color 0.3s ease-out";
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
        <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px] py-16 flex items-center gap-12">
          {/* Left column with text and search */}
          <div className="flex-1 space-y-16">
            <h1 
              ref={headingRef} 
              className="text-7xl font-black leading-tight transition-colors duration-300"
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
          <div className="flex-1 overflow-hidden rounded-3xl">
            <div className="rounded-3xl overflow-hidden">
              <img 
                ref={imageRef} 
                src="/lovable-uploads/d79d697f-5c21-443c-bc75-d988a2dbc770.png" 
                alt="DJ performing at a concert" 
                className="w-full h-[500px] object-cover transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
