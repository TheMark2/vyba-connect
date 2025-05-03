
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  LogOut,
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

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

const UserDashboardLayout = ({ children }: UserDashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Usuario");

  // Obtener información del usuario desde Supabase
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const avatarUrl = user.user_metadata.avatar_url || null;
        setUserImage(avatarUrl);
        setUserName(user.user_metadata.name || user.email?.split('@')[0] || "Usuario");
      }
    };
    
    getUserInfo();
  }, []);

  const navItems = [
    { path: '/user-dashboard', icon: LayoutDashboard, label: 'Al día' },
    { path: '/user-dashboard/profile', icon: User, label: 'Perfil' },
    { path: '/user-dashboard/messages', icon: MessageSquare, label: 'Mensajes' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getUserInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <nav className="relative top-0 left-0 w-full bg-white/30 dark:bg-black z-50 backdrop-blur-xl px-4 hidden md:block">
        <div className="grid grid-cols-3 items-center py-4 px-8 md:px-32">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/logovyba.png" alt="Logo VYBA" className="h-10" />
          </div>

          {/* Navigation Links (centered) */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="link"
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray hover:no-underline",
                      isActive && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full"
                    )}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* User Avatar */}
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-12 w-12 rounded-full cursor-pointer overflow-hidden transition-colors duration-300">
                  {userImage ? (
                    <img 
                      src={userImage}
                      alt={userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-vyba-navy text-white">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/user-dashboard/profile')}>
                  <span>Perfil</span>
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
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center h-16 rounded-none",
                  isActive ? "text-vyba-navy" : "text-vyba-tertiary"
                )}
              >
                <item.icon className={cn("h-5 w-5 mb-1", isActive ? "text-vyba-navy" : "text-vyba-tertiary")} />
                <span className="text-xs">{item.label}</span>
              </Button>
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
