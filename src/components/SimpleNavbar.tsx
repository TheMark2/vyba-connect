import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowLeft, Menu, Moon, Sun, LaptopIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenu from '@/components/MobileMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SimpleNavbarProps {
  className?: string;
}

const SimpleNavbar = ({
  className
}: SimpleNavbarProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  // Detectar el tema inicial del sistema
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setCurrentTheme('dark');
    } else if (savedTheme === 'light') {
      setCurrentTheme('light');
    } else {
      setCurrentTheme('system');
    }
  }, []);
  
  const handleGetStarted = () => {
    navigate('/thank-you');
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
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
  
  return (
    <div 
      className={cn(
        "w-full mx-auto flex items-center justify-between",
        "px-6 md:px-10 lg:px-14 xl:px-16 h-24 bg-white dark:bg-vyba-dark-bg",
        className
      )}
    >
      {/* Logo */}
      <Link to="/" className="text-3xl font-bold dark:text-white">
        VYBA
      </Link>

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
            {/* Botón de volver atrás */}
            <Button 
              variant="secondary"
              size="icon"
              onClick={handleGoBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            {/* Botón de iniciar sesión en móvil */}
            <Button 
              variant="default" 
              onClick={handleGetStarted}
            >
              Empezar
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
              size="icon"
              onClick={handleGoBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Button 
              onClick={handleGetStarted}
              className="text-sm"
            >
              Empezar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleNavbar;
