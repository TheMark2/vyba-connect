import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun, LaptopIcon, UserIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import MobileMenu from "@/components/MobileMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

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
  
  // Usar el contexto de autenticación
  const { 
    isAuthenticated, 
    userRole, 
    avatarUrl, 
    userDisplayName, 
    user, 
    signOut,
    isOnboardingCompleted,
    isArtistOnboardingCompleted 
  } = useAuth();
  
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
      return <Moon className="h-5 w-5" />;
    } else if (currentTheme === 'light') {
      return <Sun className="h-5 w-5" />;
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isSystemDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
    }
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleDashboardClick = async () => {
    try {
      if (!isAuthenticated) return;
      
      // Determinar la ruta adecuada según el rol y el estado del onboarding
      if (userRole === 'artist') {
        if (!isArtistOnboardingCompleted) {
          navigate('/register/artist');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Permitir al usuario elegir si quiere completar el onboarding
        if (!isOnboardingCompleted) {
          const shouldSkip = window.confirm('¿Quieres completar tu perfil ahora o prefieres acceder directamente?');
          
          if (shouldSkip) {
            navigate('/check-dashboard?skipOnboarding=true');
          } else {
            navigate('/user-onboarding');
          }
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header 
      className={cn(
        "w-full mx-auto px-6 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between",
        isMobile ? "h-20" : "h-24",
        isMobile ? "bg-[#F5F1EB] dark:bg-vyba-dark-bg" : "bg-white dark:bg-vyba-dark-bg",
        className
      )}
    >
      <div className="flex items-center space-x-12">
        <Button variant="link" onClick={() => navigate("/")} className="text-3xl font-bold dark:text-white">
          <img src="/lovable-uploads/logovyba.png" alt="VYBA" className="h-10" />
        </Button>

        <div className="hidden md:flex items-center space-x-2">
          <Button variant="link" onClick={() => navigate("/")} className={cn("text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray hover:no-underline", isActive("/") && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full")}>
            Inicio
          </Button>

          <Button variant="link" onClick={() => navigate("/artists")} className={cn("text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray hover:no-underline", isActive("/artists") && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full")}>
            Artistas
          </Button>
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

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userDisplayName || 'Usuario'} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-white dark:bg-[#575654] border-none rounded-3xl p-3 shadow-none mr-3 min-w-[200px]" 
              align="end"
            >
              <DropdownMenuItem 
                className="rounded-lg px-3 py-3 flex items-center gap-4 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300"
                onClick={handleDashboardClick}
              >
                <span className="text-sm font-medium">Mi cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="rounded-lg px-3 py-3 flex items-center gap-4 text-red-500 hover:text-red-600 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300"
                onClick={handleLogout}
              >
                <span className="text-sm font-medium">Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={handleAuthClick}
            className="rounded-full hover:bg-blue-700"
          >
            Iniciar sesión
          </Button>
        )}

        {isMobile && !isAuthPage && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 rounded-full" 
            onClick={handleOpenMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={handleCloseMenu} 
        isAuthenticated={isAuthenticated}
        onAuthClick={handleAuthClick}
        onDashboardClick={handleDashboardClick}
        onLogoutClick={handleLogout}
        userDisplayName={userDisplayName || 'Usuario'}
        setTheme={setTheme}
        currentTheme={currentTheme}
      />
    </header>
  );
};

export default Navbar;
