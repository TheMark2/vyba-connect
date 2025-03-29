import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Facebook, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import MobileMenu from "@/components/MobileMenu";
import { Moon01, Sun01, Laptop } from '@hugeicons/react';
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

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
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

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

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

  const getThemeIcon = () => {
    if (currentTheme === 'dark') {
      return <Moon01 className="h-5 w-5" />;
    } else if (currentTheme === 'light') {
      return <Sun01 className="h-5 w-5" />;
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isSystemDark ? <Moon01 className="h-5 w-5" /> : <Sun01 className="h-5 w-5" />;
    }
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handlePromoteClick = () => {
    navigate('/auth');
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
      <div className="flex items-center space-x-12">
        <Link to="/" className="text-3xl font-bold dark:text-white">
          VYBA
        </Link>

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

      <div className="flex items-center space-x-3">
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
                <Sun01 className="h-5 w-5" />
                <span className="text-sm font-medium">Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn(
                  "rounded-lg px-3 py-3 flex mb-1 items-center gap-4 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300",
                  currentTheme === 'dark' && "bg-[#F8F8F8] dark:bg-[#444341]"
                )}
                onClick={() => setTheme('dark')}
              >
                <Moon01 className="h-5 w-5" />
                <span className="text-sm font-medium">Oscuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn(
                  "rounded-lg px-3 py-3 flex items-center gap-4 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300",
                  currentTheme === 'system' && "bg-[#F8F8F8] dark:bg-[#444341]"
                )}
                onClick={() => setTheme('system')}
              >
                <Laptop className="h-5 w-5" />
                <span className="text-sm font-medium">Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isMobile ? (
          <>
            <Button 
              variant="default" 
              onClick={handleAuthClick}
            >
              Iniciar sesión
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative w-10 h-10 flex items-center justify-center dark:text-white"
              onClick={handleOpenMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>

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
    </div>
  );
};

export default Navbar;
