
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Set active index based on current path
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveIndex(0);
    } else if (location.pathname === "/artistas") {
      setActiveIndex(1);
    }
  }, [location.pathname]);

  // Calculate position for the hover background
  const getHoverStyles = () => {
    if (hoverIndex === null) {
      return {
        opacity: 0,
        transform: 'translateX(-100%)',
      };
    }
    
    return {
      opacity: 1,
      transform: 'translateX(0)',
    };
  };

  return (
    <nav className="bg-vyba-cream backdrop-blur-xl">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">VYBA</h1>
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              asChild
              className="relative z-10 overflow-hidden"
              onMouseEnter={() => setHoverIndex(0)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <Link to="/" className="relative">
                <div
                  className="absolute inset-0 bg-secondary rounded-full transition-all duration-300 ease-in-out -z-10"
                  style={hoverIndex === 0 ? getHoverStyles() : { opacity: activeIndex === 0 ? 1 : 0 }}
                />
                Inicio
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="relative z-10 overflow-hidden"
              onMouseEnter={() => setHoverIndex(1)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <Link to="/artistas" className="relative">
                <div
                  className="absolute inset-0 bg-secondary rounded-full transition-all duration-300 ease-in-out -z-10"
                  style={hoverIndex === 1 ? getHoverStyles() : { opacity: activeIndex === 1 ? 1 : 0 }}
                />
                Artistas
              </Link>
            </Button>
            <Button 
              variant="ghost"
              className="relative z-10 overflow-hidden"
              onMouseEnter={() => setHoverIndex(2)} 
              onMouseLeave={() => setHoverIndex(null)}
            >
              <span className="relative">
                <div
                  className="absolute inset-0 bg-secondary rounded-full transition-all duration-300 ease-in-out -z-10"
                  style={hoverIndex === 2 ? getHoverStyles() : { opacity: 0 }}
                />
                Todos los artistas
              </span>
            </Button>
            <Button 
              variant="ghost"
              className="relative z-10 overflow-hidden"
              onMouseEnter={() => setHoverIndex(3)} 
              onMouseLeave={() => setHoverIndex(null)}
            >
              <span className="relative">
                <div
                  className="absolute inset-0 bg-secondary rounded-full transition-all duration-300 ease-in-out -z-10"
                  style={hoverIndex === 3 ? getHoverStyles() : { opacity: 0 }}
                />
                Todos los géneros
              </span>
            </Button>
          </div>
        </div>
        <Button className="btn-primary">
          Entrar/Registrarse
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
