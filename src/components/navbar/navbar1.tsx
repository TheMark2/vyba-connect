import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MiniSearchBar from "@/components/search/MiniSearchBar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";

const Navbar1 = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, avatarUrl, userName, reloadUserData } = useAuth();
    const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    
    // Efecto para asegurarse de que los datos están actualizados
    useEffect(() => {
      const loadUserData = async () => {
        // Recargar datos de usuario para asegurar información actualizada
        if (isAuthenticated) {
          console.log("Navbar: Usuario autenticado, recargando datos");
          try {
            await reloadUserData();
            console.log("Navbar: Datos recargados con éxito");
          } catch (error) {
            console.error("Navbar: Error al recargar datos de usuario:", error);
          }
        }
      };
      
      loadUserData();
    }, [isAuthenticated, reloadUserData]);
    
    // Registrar cambios en avatarUrl
    useEffect(() => {
      console.log("Navbar: avatarUrl actualizada:", avatarUrl);
      setAvatarError(false);
      setIsAvatarLoaded(false);
    }, [avatarUrl]);
    
    const handleAuth = () => {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    };
    
    const handleLogout = async () => {
      await supabase.auth.signOut();
      navigate('/');
    };
    
    const getUserInitial = () => {
      if (userName) {
        return userName.charAt(0).toUpperCase();
      }
      return "U";
    };
    
    const handleAvatarLoad = () => {
      console.log("Navbar: Avatar cargado correctamente");
      setIsAvatarLoaded(true);
    };
    
    const handleAvatarError = () => {
      console.log("Navbar: Error al cargar avatar");
      setAvatarError(true);
    };
    
    return (
        <nav>
        <div className="fixed top-0 left-0 w-full bg-white/30 dark:bg-black z-50 backdrop-blur-xl px-6 md:px-6 lg:px-16">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button onClick={() => navigate('/')} className="p-1">
                <img
                  src="/lovable-uploads/logovyba.png"
                  alt="Logo Vyba Artists"
                  className="h-10 w-auto"
                />
              </button>
            </div>
            <MiniSearchBar />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-10 w-10 cursor-pointer">
                      {avatarUrl && !avatarError ? (
                        <AvatarImage 
                          src={avatarUrl} 
                          alt={userName || "Usuario"} 
                          onLoad={handleAvatarLoad}
                          onError={handleAvatarError}
                        />
                      ) : null}
                      <AvatarFallback className="bg-black text-white">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Mi cuenta
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/favorites')}>
                    <Heart className="h-4 w-4 mr-2" />
                    Mis favoritos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleAuth}>
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </nav>
    );
};

export default Navbar1;
