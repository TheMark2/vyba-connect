
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import MobileMenu from "@/components/MobileMenu";

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

  // Limpiar overflow en caso de que el componente se desmonte con el menú abierto
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  // Manejar apertura del menú
  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  // Manejar cierre del menú
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div 
      className={cn(
        "w-full mx-auto px-6 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between",
        isMobile ? "fixed top-0 left-0 right-0 z-50 transition-colors duration-500 h-20" : "h-24",
        isMobile && scrolled ? "bg-[#F5F1EB] dark:bg-vyba-dark-bg" : "bg-transparent",
        className
      )}
    >
      {/* Logo y enlaces alineados a la izquierda */}
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <h1 className="text-3xl font-bold dark:text-white">
          VYBA
        </h1>

        {/* Enlaces de navegación */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/" className={cn("px-6 py-3 rounded-full text-black dark:text-white font-medium relative overflow-hidden transition-colors duration-300", isActive("/") ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "hover:bg-[#F9F6F2] dark:hover:bg-vyba-dark-secondary")}>
            Inicio
          </Link>

          <Link to="/artistas" className={cn("px-6 py-3 rounded-full text-black dark:text-white font-medium relative overflow-hidden transition-colors duration-300", isActive("/artistas") ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "hover:bg-[#F9F6F2] dark:hover:bg-vyba-dark-secondary")}>
            Artistas
          </Link>

          <Link to="/todos-artistas" className={cn("px-6 py-3 rounded-full text-black dark:text-white font-medium relative overflow-hidden transition-colors duration-300", isActive("/todos-artistas") ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "hover:bg-[#F9F6F2] dark:hover:bg-vyba-dark-secondary")}>
            Todos los artistas
          </Link>

          <Link to="/todos-generos" className={cn("px-6 py-3 rounded-full text-black dark:text-white font-medium relative overflow-hidden transition-colors duration-300", isActive("/todos-generos") ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "hover:bg-[#F9F6F2] dark:hover:bg-vyba-dark-secondary")}>
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
              variant="default" 
            >
              Iniciar sesión
            </Button>
            
            {/* Botón de menú hamburguesa */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative w-10 h-10 flex items-center justify-center dark:text-white"
              onClick={handleOpenMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Menú móvil como componente independiente */}
            <MobileMenu 
              isOpen={isMenuOpen} 
              onClose={handleCloseMenu} 
            />
          </>
        ) : (
          <>
            <Button 
              variant="secondary" 
              className="text-sm hidden sm:flex bg-[#E7D3D3] dark:bg-vyba-dark-secondary dark:text-white"
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
