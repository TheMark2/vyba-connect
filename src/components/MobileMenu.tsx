import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Monitor, Home, Users, Music, Palette, X, Search, SlidersHorizontal, LogOut, User } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  userDisplayName?: string;
  onAuthClick?: () => void;
  onDashboardClick?: () => Promise<void>;
  onLogoutClick?: () => Promise<void>;
  currentTheme?: 'light' | 'dark' | 'system';
  setTheme?: (theme: 'light' | 'dark' | 'system') => void;
}

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  isAuthenticated = false,
  userDisplayName = 'Usuario',
  onAuthClick,
  onDashboardClick,
  onLogoutClick,
  currentTheme: propTheme,
  setTheme: propSetTheme
}: MobileMenuProps) => {
  const [theme, setTheme] = useState(propTheme || "system");
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // Obtener el rol de usuario y estado de carga del contexto
  const { userRole, isLoading } = useAuth();

  // Función para verificar si un enlace está activo
  const isActive = (path: string) => location.pathname === path;

  // Manejador de cambio de tema
  const handleThemeChange = (value: string) => {
    if (value && (value === 'light' || value === 'dark' || value === 'system')) {
      if (propSetTheme) {
        propSetTheme(value as 'light' | 'dark' | 'system');
      } else {
        setTheme(value as 'light' | 'dark' | 'system');
        
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
    }
  };

  // Configurar el tema inicial
  useEffect(() => {
    if (propTheme) {
      setTheme(propTheme);
    } else {
      // Verificar si existe preferencia guardada, sino usar el tema del sistema
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setTheme(savedTheme as 'light' | 'dark' | 'system');
      } else {
        setTheme('system');
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }, [propTheme]);

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
    if (!propSetTheme) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, propSetTheme]);

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

  // Manejar redirección según el rol
  const handleMyAccountClick = () => {
    if (userRole === 'artist') {
      onDashboardClick?.();
    } else {
      // Ir directamente al dashboard de usuario
      navigate('/user-dashboard');
    }
    onClose();
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
        <div className="flex justify-between items-center p-6">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-vyba-gray rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium">{userDisplayName}</span>
            </div>
          ) : null}
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
                  className={`h-5 w-5 ${isActive('/') ? 'text-gray-800 dark:text-white' : 'hover:text-gray-800 dark:hover:text-white'}`} 
                  strokeWidth={isActive('/') ? 2.5 : 2}
                />
                <span>Inicio</span>
              </div>
            </Link>
            <Link 
              to="/artists" 
              className={`px-4 py-3 rounded-lg ${isActive('/artists') ? 'bg-[#F8F8F8] dark:bg-vyba-dark-secondary' : 'hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary'} text-black dark:text-white font-medium transition-all duration-200 animate-menu-item`}
              onClick={handleLinkClick}
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center space-x-3">
                <Users 
                  className={`h-5 w-5 ${isActive('/artists') ? 'text-gray-800 dark:text-white' : 'hover:text-gray-800 dark:hover:text-white'}`} 
                  strokeWidth={isActive('/artists') ? 2.5 : 2}
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
                  className={`h-5 w-5 ${isActive('/todos-generos') ? 'text-gray-800 dark:text-white' : 'hover:text-gray-800 dark:hover:text-white'}`} 
                  strokeWidth={isActive('/todos-generos') ? 2.5 : 2}
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
                  className={`h-5 w-5 ${isActive('/todos-artistas') ? 'text-gray-800 dark:text-white' : 'hover:text-gray-800 dark:hover:text-white'}`} 
                  strokeWidth={isActive('/todos-artistas') ? 2.5 : 2}
                />
                <span>Todos los artistas</span>
              </div>
            </Link>
          </nav>
          
          {/* Separador que va de extremo a extremo */}
          <Separator className="animate-menu-item w-full dark:bg-vyba-dark-secondary" style={{ animationDelay: "250ms", margin: "0.5rem 0" }} />
          
          {/* Botones de autenticación */}
          <div className="px-6 my-4 flex flex-col space-y-2 animate-menu-item" style={{ animationDelay: "300ms" }}>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="justify-start px-4 py-3 h-auto text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary rounded-lg w-full font-medium"
                  onClick={handleMyAccountClick}
                >
                  <User className="mr-3 h-5 w-5" />
                  Mi cuenta
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start px-4 py-3 h-auto text-red-500 hover:text-red-600 hover:bg-[#F8F8F8] dark:hover:bg-vyba-dark-secondary rounded-lg w-full font-medium"
                  onClick={() => {
                    onLogoutClick?.();
                    onClose();
                  }}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                className="px-4 py-3 h-auto rounded-full w-full font-medium"
                onClick={() => {
                  onAuthClick?.();
                  onClose();
                }}
              >
                Iniciar sesión
              </Button>
            )}
          </div>
          
          <Separator className="animate-menu-item w-full dark:bg-vyba-dark-secondary" style={{ animationDelay: "350ms", margin: "0.5rem 0" }} />
          
          {/* Selector de tema */}
          <div className="px-6 pt-2 pb-6 animate-menu-item" style={{ animationDelay: "400ms" }}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Tema</h3>
            <ToggleGroup type="single" value={propTheme || theme} onValueChange={handleThemeChange} className="flex justify-between">
              <ToggleGroupItem value="light" className="flex-1 p-2 data-[state=on]:bg-[#F8F8F8] dark:data-[state=on]:bg-vyba-dark-secondary">
                <Sun className="mx-auto h-5 w-5" />
                <span className="block text-xs mt-1">Claro</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="system" className="flex-1 p-2 data-[state=on]:bg-[#F8F8F8] dark:data-[state=on]:bg-vyba-dark-secondary">
                <Monitor className="mx-auto h-5 w-5" />
                <span className="block text-xs mt-1">Sistema</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" className="flex-1 p-2 data-[state=on]:bg-[#F8F8F8] dark:data-[state=on]:bg-vyba-dark-secondary">
                <Moon className="mx-auto h-5 w-5" />
                <span className="block text-xs mt-1">Oscuro</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileMenu;
