import React, { useState, useEffect, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  LogOut,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

// Componente memoizado para el avatar del usuario
const UserAvatar = memo(({ userImage, userName, getUserInitial, onClick }: { 
  userImage: string | null; 
  userName: string; 
  getUserInitial: () => string;
  onClick?: () => void;
}) => (
  <div className="h-12 w-12 rounded-full cursor-pointer overflow-hidden transition-colors duration-300" onClick={onClick}>
    {userImage ? (
      <Avatar className="h-full w-full">
        <AvatarImage 
          src={userImage}
          alt={userName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <AvatarFallback className="bg-vyba-navy text-white">
          {getUserInitial()}
        </AvatarFallback>
      </Avatar>
    ) : (
      <Avatar className="h-full w-full">
        <AvatarFallback className="bg-vyba-navy text-white">
          {getUserInitial()}
        </AvatarFallback>
      </Avatar>
    )}
  </div>
));

// Componente memoizado para los elementos de navegación
const NavItems = memo(({ items, location, navigate }: { 
  items: { path: string; icon: any; label: string }[]; 
  location: ReturnType<typeof useLocation>; 
  navigate: ReturnType<typeof useNavigate>;
}) => (
  <div className="flex justify-center">
    <div className="flex items-center gap-2">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray hover:no-underline flex items-center",
              isActive && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  </div>
));

const UserDashboardLayout = ({ children }: UserDashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Usuario");

  // Obtener información del usuario desde el contexto de autenticación
  useEffect(() => {
    if (user) {
      const avatarUrl = user.user_metadata?.avatar_url || null;
      setUserImage(avatarUrl);
      setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Usuario");
    }
  }, [user]);

  const navItems = [
    { path: '/user-dashboard', icon: LayoutDashboard, label: 'Al día' },
    { path: '/user-dashboard/favorites', icon: Heart, label: 'Favoritos' },
    { path: '/user-dashboard/profile', icon: User, label: 'Perfil' },
    { path: '/user-dashboard/messages', icon: MessageSquare, label: 'Mensajes' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <nav className="sticky top-0 left-0 w-full bg-white/30 dark:bg-black z-50 backdrop-blur-xl px-4 hidden md:block">
        <div className="grid grid-cols-3 items-center py-4 px-8 md:px-32">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/logovyba.png" alt="Logo VYBA" className="h-10" />
          </div>

          {/* Navigation Links (centered) */}
          <NavItems items={navItems} location={location} navigate={navigate} />

          {/* User Avatar */}
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <UserAvatar 
                    userImage={userImage} 
                    userName={userName} 
                    getUserInitial={getUserInitial} 
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/user-dashboard/profile">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center h-16 rounded-none px-4",
                  isActive ? "text-vyba-navy" : "text-vyba-tertiary"
                )}
              >
                <item.icon className={cn("h-5 w-5 mb-1", isActive ? "text-vyba-navy" : "text-vyba-tertiary")} />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
};

export default UserDashboardLayout;
