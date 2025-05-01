import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun, LaptopIcon, User as UserIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import MobileMenu from "@/components/MobileMenu";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

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

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          setUserRole(userData.user.user_metadata?.role || 'user');
          setUserAvatarUrl(userData.user.user_metadata?.avatar_url || null);
          setUserName(userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Usuario');
          setUser(userData.user);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          setUserRole(userData.user.user_metadata?.role || 'user');
          setUserAvatarUrl(userData.user.user_metadata?.avatar_url || null);
          setUserName(userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Usuario');
          setUser(userData.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserAvatarUrl(null);
        setUserName(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
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
      if (!user) return;
      
      const userRole = user.user_metadata?.role || 'user';
      const isOnboardingCompleted = user.user_metadata?.onboarding_completed === true;
      const isArtistOnboardingCompleted = user.user_metadata?.artist_onboarding_completed === true;
      
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
    await supabase.auth.signOut();
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

        {isMobile ? (
          <>
            {isAuthenticated ? (
              <Button 
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full border"
                onClick={handleDashboardClick}
              >
                {userAvatarUrl ? (
                  <img src={userAvatarUrl} alt={userName || 'Usuario'} className="h-full w-full object-cover rounded-full" />
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
              </Button>
            ) : (
              <Button 
                variant="default" 
                onClick={handleAuthClick}
              >
                Iniciar sesión
              </Button>
            )}
            
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
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-full border overflow-hidden"
                  >
                    {userAvatarUrl ? (
                      <img src={userAvatarUrl} alt={userName || 'Usuario'} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-white dark:bg-[#575654] border-none rounded-3xl p-3 shadow-none mr-3 min-w-[200px]" 
                  align="end"
                >
                  <div className="px-3 py-2 mb-2">
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-vyba-tertiary">
                      {userRole === 'artist' ? 'Artista' : 'Usuario'}
                    </p>
                  </div>
                  
                  <DropdownMenuItem 
                    className="rounded-lg px-3 py-3 flex mb-1 items-center gap-4 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300"
                    onClick={handleDashboardClick}
                  >
                    <span className="text-sm font-medium">Mi dashboard</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="rounded-lg px-3 py-3 flex items-center gap-4 hover:bg-[#F8F8F8] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300"
                    onClick={handleLogout}
                  >
                    <span className="text-sm font-medium">Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="text-sm"
                onClick={handleAuthClick}
              >
                Entrar/Registrarse
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
