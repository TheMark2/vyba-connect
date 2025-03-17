
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileMenu from "@/components/MobileMenu";
import { useState, useEffect, useRef } from "react";

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
  const scrollPositionRef = useRef(0);

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

  // Manejo de apertura/cierre del menú
  const handleMenuOpenChange = (open: boolean) => {
    if (open) {
      // Guardar la posición actual antes de abrir
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // Restaurar la posición al cerrar
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPositionRef.current);
    }
    
    setIsMenuOpen(open);
  };

  return (
    <div 
      className={cn(
        "w-full mx-auto px-6 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between",
        // Cambiamos de sticky a fixed para móvil y reducimos altura
        isMobile ? "fixed top-0 left-0 right-0 z-50 transition-colors duration-500 h-20" : "h-24",
        // Cambiamos el fondo basado en el estado de scroll (solo en móvil)
        isMobile && scrolled ? "bg-[#F5F1EB]" : "bg-transparent",
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
          <>
            {/* Botón de iniciar sesión en móvil */}
            <Button 
              size="sm" 
              variant="ghost" 
              className="bg-[#D4DDFF] text-[#222845] hover:bg-[#C4D1FF] border-none"
            >
              Iniciar sesión
            </Button>
            
            <Sheet open={isMenuOpen} onOpenChange={handleMenuOpenChange}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative w-10 h-10 flex items-center justify-center">
                  <div className="relative w-6 h-6">
                    <Menu className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                    <X className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} />
                  </div>
                </Button>
              </SheetTrigger>
              <MobileMenu />
            </Sheet>
          </>
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
