
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileMenu from "@/components/MobileMenu";
import { useState, useEffect } from "react";

interface NavbarProps {
  className?: string;
}

const Navbar = ({
  className
}: NavbarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar el scroll y cambiar el estado
  useEffect(() => {
    const handleScroll = () => {
      // En dispositivos móviles, cambiamos el color después de 20px de scroll
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  return (
    <div 
      className={cn(
        "w-full mx-auto px-6 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between",
        // Cambiamos de sticky a fixed para móvil y reducimos altura
        isMobile ? "fixed top-0 left-0 right-0 z-50 transition-colors duration-500 h-20" : "h-24",
        // Cambiamos el fondo y el degradado basado en el estado de scroll (solo en móvil)
        isMobile && scrolled ? "bg-[#F5F1EB] navbar-gradient" : "bg-transparent",
        className
      )}
    >
      {/* Logo y enlaces alineados a la izquierda */}
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <h1 className="text-3xl font-bold">
          VYBA
        </h1>

        {/* Enlaces de navegación */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/" className={cn("px-6 py-3 rounded-full text-black font-medium relative overflow-hidden transition-colors duration-300", isActive("/") ? "bg-[#F5F1EB]" : "hover:bg-[#F9F6F2]")}>
            Inicio
          </Link>

          <Link to="/artistas" className={cn("px-6 py-3 rounded-full text-black font-medium relative overflow-hidden transition-colors duration-300", isActive("/artistas") ? "bg-[#F5F1EB]" : "hover:bg-[#F9F6F2]")}>
            Artistas
          </Link>

          <Link to="/todos-artistas" className={cn("px-6 py-3 rounded-full text-black font-medium relative overflow-hidden transition-colors duration-300", isActive("/todos-artistas") ? "bg-[#F5F1EB]" : "hover:bg-[#F9F6F2]")}>
            Todos los artistas
          </Link>

          <Link to="/todos-generos" className={cn("px-6 py-3 rounded-full text-black font-medium relative overflow-hidden transition-colors duration-300", isActive("/todos-generos") ? "bg-[#F5F1EB]" : "hover:bg-[#F9F6F2]")}>
            Todos los géneros
          </Link>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center space-x-3">
        {isMobile ? (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden relative w-10 h-10 flex items-center justify-center">
                <div className="relative w-6 h-6">
                  <Menu className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                  <X className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} />
                </div>
              </Button>
            </SheetTrigger>
            <MobileMenu />
          </Sheet>
        ) : (
          <>
            <Button 
              variant="secondary" 
              className="text-sm hidden sm:flex bg-[#E7D3D3]"
            >
              Promocionarse como artista
            </Button>
            <Button className="text-sm">
              Entrar/Registrarse
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
export default Navbar;
