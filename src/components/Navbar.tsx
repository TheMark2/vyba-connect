
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun, LaptopIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import MobileMenu from "@/components/MobileMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  className?: string;
}

const Navbar = ({
  className
}: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  const isAuthPage = location.pathname === '/auth';

  // Limpiar overflow en caso de que el componente se desmonte con el menú abierto
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Detectar el tema inicial del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setCurrentTheme('dark');
    } else if (savedTheme === 'light') {
      setCurrentTheme('light');
    } else {
      setCurrentTheme('system');
    }
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

  // Función para cambiar el tema
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      localStorage.setItem('theme', 'system');
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
    
    setCurrentTheme(theme);
  };

  // Función para obtener el icono correcto según el tema actual
  const getThemeIcon = () => {
    if (currentTheme === 'dark') {
      return <Moon className="h-5 w-5" />;
    } else if (currentTheme === 'light') {
      return <Sun className="h-5 w-5" />;
    } else {
      // Para 'system', comprobar la preferencia actual del sistema
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isSystemDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
    }
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handlePromoteClick = () => {
    navigate('/auth');
  };

  return (
    <header 
      className={cn(
        "w-full mx-auto px-6 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between",
        isMobile ? "fixed top-0 left-0 right-0 z-50 transition-colors duration-500 h-20" : "h-24",
        isMobile && scrolled ? "bg-[#F5F1EB] dark:bg-vyba-dark-bg" : "bg-transparent",
        isMobile && !scrolled ? "bg-white dark:bg-vyba-dark-bg" : "",
        className
      )}
    >
      {/* Logo y enlaces alineados a la izquierda */}
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold dark:text-white">
          VYBA
        </Link>

        {/* Enlaces de navegación */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/" className={cn("px-6 py-3 text-sm rounded-full text-black dark:text-white font-medium relative overflow-hidden transition-colors duration-300", isActive("/") ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "hover:bg-[#F9F6F2] dark:hover:bg-vyba-dark-secondary")}>
            Inicio
          </Link>

          <Link to="/artistas" className={cn("px-6 py-3 text-sm rounded-full text-black dark:text-white font-medium relative overflow-hidden transition-colors duration-300", isActive("/artistas") ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "hover:bg-[#F9F6F2] dark:hover:bg-vyba-dark-secondary")}>
            Artistas
          </Link>

          <Link to="/todos-artistas" className={cn("px-6 py-3 text-sm rounded-full text-black dark:text-white font-medium relative overflow-hidden transition-colors duration-300", isActive("/todos-artistas") ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "hover:bg-[#F9F6F2] dark:hover:bg-vyba-dark-secondary")}>
            Todos los artistas
          </Link>

          <Link to="/todos-generos" className={cn("px-6 py-3 text-sm rounded-full text-black dark:text-white font-medium relative overflow-hidden transition-colors duration-300", isActive("/todos-generos") ? "bg-[#F5F1EB] dark:bg-vyba-dark-secondary" : "hover:bg-[#F9F6F2] dark:hover:bg-vyba-dark-secondary")}>
            Todos los géneros
          </Link>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center space-x-3">
        {/* Dropdown para cambio de tema (solo en pantallas grandes) */}
        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-full"
              >
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-white dark:bg-[#575654] border-none rounded-3xl p-3 shadow-none mr-3 min-w-[200px]" 
              align="end"
            >
              <DropdownMenuItem 
                className={cn(
                  "rounded-lg px-3 py-3 flex mb-1 items-center gap-4 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300",
                  currentTheme === 'light' && "bg-[#F8F8F8] dark:bg-[#444341]"
                )}
                onClick={() => setTheme('light')}
              >
                <Sun className="h-5 w-5" />
                <span className="text-sm font-medium">Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn(
                  "rounded-lg px-3 py-3 flex mb-1 items-center gap-4 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300",
                  currentTheme === 'dark' && "bg-[#F8F8F8] dark:bg-[#444341]"
                )}
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-5 w-5" />
                <span className="text-sm font-medium">Oscuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn(
                  "rounded-lg px-3 py-3 flex items-center gap-4 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300",
                  currentTheme === 'system' && "bg-[#F8F8F8] dark:bg-[#444341]"
                )}
                onClick={() => setTheme('system')}
              >
                <LaptopIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isMobile ? (
          <>
            {/* Botón de iniciar sesión en móvil */}
            <Button 
              variant="default" 
              onClick={handleAuthClick}
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
              onClick={handlePromoteClick}
            >
              Promocionarse como artista
            </Button>
            <Button 
              className="text-sm"
              onClick={handleAuthClick}
            >
              Entrar/Registrarse
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
