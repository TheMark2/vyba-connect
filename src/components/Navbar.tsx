
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
        left: `${activeIndex * 100}px`,
        opacity: 1,
        width: '100px',
        height: '40px',
      };
    }
    
    return {
      left: `${hoverIndex * 100}px`,
      opacity: 1,
      width: '100px',
      height: '40px',
    };
  };

  return (
    <nav className="bg-vyba-cream backdrop-blur-xl">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">VYBA</h1>
          <div className="hidden md:flex items-center space-x-1 relative">
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute bg-secondary transition-all duration-300 ease-in-out rounded-full"
                style={getHoverStyles()}
              />
            </div>
            <Button
              variant="ghost"
              asChild
              className="relative z-10"
              onMouseEnter={() => setHoverIndex(0)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <Link to="/">Inicio</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="relative z-10"
              onMouseEnter={() => setHoverIndex(1)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <Link to="/artistas">Artistas</Link>
            </Button>
            <Button 
              variant="ghost"
              className="relative z-10"
              onMouseEnter={() => setHoverIndex(2)} 
              onMouseLeave={() => setHoverIndex(null)}
            >
              Todos los artistas
            </Button>
            <Button 
              variant="ghost"
              className="relative z-10"
              onMouseEnter={() => setHoverIndex(3)} 
              onMouseLeave={() => setHoverIndex(null)}
            >
              Todos los géneros
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
