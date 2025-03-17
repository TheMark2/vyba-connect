
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor, Home, Users, Music, Palette, X, Search, SlidersHorizontal } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [theme, setTheme] = useState("system");
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Función para verificar si un enlace está activo
  const isActive = (path: string) => location.pathname === path;

  // Manejador de cambio de tema
  const handleThemeChange = (value: string) => {
    if (value) {
      setTheme(value);
      
      // Aplicar la clase dark al documento con animación
      if (value === 'dark') {
        document.documentElement.classList.add('theme-transition');
        document.documentElement.classList.add('dark');
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
        }, 500);
      } else if (value === 'light') {
        document.documentElement.classList.add('theme-transition');
        document.documentElement.classList.remove('dark');
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
        }, 500);
      } else if (value === 'system') {
        document.documentElement.classList.add('theme-transition');
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
        }, 500);
      }
    }
  };

  // Configurar el tema inicial
  useEffect(() => {
    // Verificar si existe preferencia guardada, sino usar el tema del sistema
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('system');
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Guardar el tema cuando cambia
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Gestionar la animación al abrir/cerrar y el scrolling del body
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar scroll cuando comienza la animación de cierre
      setTimeout(() => {
        if (!isOpen) {
          document.body.style.overflow = '';
        }
      }, 350); // Esperar a que termine la animación de salida
    }

    // Limpiar el efecto cuando se desmonta el componente
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    onClose();
  };

  // Controlador de animación al terminar
  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
      // Asegurarnos de restaurar el scroll después de la transición
      document.body.style.overflow = '';
    }
  };

  // Evitar renderizar si está cerrado y no está animando
  if (!isOpen && !isAnimating) {
    return null;
  }

  // Usar createPortal para renderizar el menú fuera de la jerarquía DOM normal
  return createPortal(
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{
        transition: "opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* Overlay de fondo oscuro con animación de fade y blur */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        style={{ transition: "opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)" }}
        onClick={onClose}
      />
      
      {/* Panel del menú con animación de entrada/salida */}
      <div 
        ref={menuRef}
        className={cn(
          "absolute top-0 right-0 bottom-0 w-full max-w-full h-full bg-white dark:bg-vyba-dark-bg dark:text-white shadow-lg flex flex-col",
          isOpen ? "animate-slide-in-right" : "animate-slide-out-right"
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Encabezado con botón de cierre */}
        <div className="flex justify-end p-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 hover:bg-slate-100 dark:hover:bg-vyba-dark-secondary transition-colors" 
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Contenido del menú con animación de fadeIn para los elementos */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex flex-col space-y-2 px-6 mb-4">
            {/* Links con animación de fade-in secuencial */}
            <Link 
              to="/" 
              className={`px-4 py-3 rounded-lg ${isActive('/') ? 'bg-[#F8F8F8] dark:bg-vyba-dark-secondary' : 'hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary'} text-black dark:text-white font-medium transition-all duration-200 animate-menu-item`}
              onClick={handleLinkClick}
              style={{ animationDelay: "50ms" }}
            >
              <div className="flex items-center space-x-3">
                <Home 
                  className={`h-5 w-5 transition-all duration-200 ${isActive('/') ? 'text-gray-800 dark:text-white' : 'hover:text-gray-800 dark:hover:text-white'}`} 
                  strokeWidth={isActive('/') ? 2 : 1.5}
                />
                <span>Inicio</span>
              </div>
            </Link>
            <Link 
              to="/artistas" 
              className={`px-4 py-3 rounded-lg ${isActive('/artistas') ? 'bg-[#F8F8F8] dark:bg-vyba-dark-secondary' : 'hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary'} text-black dark:text-white font-medium transition-all duration-200 animate-menu-item`}
              onClick={handleLinkClick}
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center space-x-3">
                <Users 
                  className={`h-5 w-5 transition-all duration-200 ${isActive('/artistas') ? 'text-gray-800 dark:text-white' : 'hover:text-gray-800 dark:hover:text-white'}`} 
                  strokeWidth={isActive('/artistas') ? 2 : 1.5}
                />
                <span>Artistas</span>
              </div>
            </Link>
            <Link 
              to="/todos-generos" 
              className={`px-4 py-3 rounded-lg ${isActive('/todos-generos') ? 'bg-[#F8F8F8] dark:bg-vyba-dark-secondary' : 'hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary'} text-black dark:text-white font-medium transition-all duration-200 animate-menu-item`}
              onClick={handleLinkClick}
              style={{ animationDelay: "150ms" }}
            >
              <div className="flex items-center space-x-3">
                <Palette 
                  className={`h-5 w-5 transition-all duration-200 ${isActive('/todos-generos') ? 'text-gray-800 dark:text-white' : 'hover:text-gray-800 dark:hover:text-white'}`} 
                  strokeWidth={isActive('/todos-generos') ? 2 : 1.5}
                />
                <span>Todos los géneros</span>
              </div>
            </Link>
            <Link 
              to="/todos-artistas" 
              className={`px-4 py-3 rounded-lg ${isActive('/todos-artistas') ? 'bg-[#F8F8F8] dark:bg-vyba-dark-secondary' : 'hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary'} text-black dark:text-white font-medium transition-all duration-200 animate-menu-item`}
              onClick={handleLinkClick}
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center space-x-3">
                <Music 
                  className={`h-5 w-5 transition-all duration-200 ${isActive('/todos-artistas') ? 'text-gray-800 dark:text-white' : 'hover:text-gray-800 dark:hover:text-white'}`} 
                  strokeWidth={isActive('/todos-artistas') ? 2 : 1.5}
                />
                <span>Todos los artistas</span>
              </div>
            </Link>
          </nav>
          
          {/* Separador que va de extremo a extremo */}
          <Separator className="animate-menu-item w-full dark:bg-vyba-dark-secondary" style={{ animationDelay: "250ms", margin: "0.5rem 0" }} />
          
          {/* Nuevos botones: Buscar con IA y Filtrar */}
          <div className="px-6 my-4 flex flex-col space-y-2 animate-menu-item" style={{ animationDelay: "300ms" }}>
            <Button 
              variant="ghost" 
              className="justify-start px-4 py-3 h-auto text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary rounded-lg w-full font-medium"
            >
              <div className="flex items-center space-x-3">
                <Search className="h-5 w-5" />
                <span>Buscar con IA</span>
              </div>
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start px-4 py-3 h-auto text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary rounded-lg w-full font-medium"
            >
              <div className="flex items-center space-x-3">
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filtrar</span>
              </div>
            </Button>
          </div>
          
          {/* Otro separador que va de extremo a extremo */}
          <Separator className="animate-menu-item w-full dark:bg-vyba-dark-secondary" style={{ animationDelay: "350ms", margin: "0.5rem 0" }} />
          
          {/* Selector de tema solo con iconos usando ToggleGroup */}
          <div className="px-6 my-4 animate-menu-item" style={{ animationDelay: "400ms" }}>
            <ToggleGroup 
              type="single" 
              value={theme} 
              onValueChange={handleThemeChange}
              className="w-full"
            >
              <ToggleGroupItem value="light" className="flex-1 flex items-center justify-center py-6">
                <Sun className="h-5 w-5" />
              </ToggleGroupItem>
              
              <ToggleGroupItem value="dark" className="flex-1 flex items-center justify-center py-6">
                <Moon className="h-5 w-5" />
              </ToggleGroupItem>
              
              <ToggleGroupItem value="system" className="flex-1 flex items-center justify-center py-6">
                <Monitor className="h-5 w-5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {/* Separador final */}
          <Separator className="animate-menu-item w-full dark:bg-vyba-dark-secondary" style={{ animationDelay: "450ms", margin: "0.5rem 0" }} />
          
          <div className="flex flex-col space-y-3 p-6 mt-auto">
            <Button 
              className="w-full rounded-full bg-[#D4DDFF] text-[#222845] hover:bg-[#C4D1FF] animate-menu-item"
              style={{ animationDelay: "500ms" }}
            >
              Iniciar sesión/Registrarse
            </Button>
            <Button 
              className="w-full rounded-full bg-[#E7D3D3] dark:bg-vyba-dark-secondary dark:text-white text-black hover:bg-[#DDCACA] dark:hover:bg-opacity-80 animate-menu-item"
              style={{ animationDelay: "550ms" }}
            >
              Promocionarse como artista
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileMenu;
